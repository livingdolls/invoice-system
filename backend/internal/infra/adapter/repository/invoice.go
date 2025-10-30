package repository

import (
	"errors"
	"fmt"
	"invoice-system/internal/applications/ports/repository"
	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/mapper"
	"invoice-system/internal/infra/db/models"
	"time"

	"gorm.io/gorm"
)

type invoiceRepository struct {
	db *gorm.DB
}

func NewInvoiceRepository(db *gorm.DB) repository.InvoiceRepository {
	return &invoiceRepository{db: db}
}

// GetAllInvoices implements repository.InvoiceRepository.
func (i *invoiceRepository) GetAllInvoices(filters domain.InvoiceFilter) ([]domain.Invoice, *time.Time, error) {
	db := i.db.Model(&models.Invoice{}).Preload("Customer").Preload("Items")

	// filter invoice id
	if filters.InvoiceID != nil && *filters.InvoiceID != "" {
		db = db.Where("invoice_number = ?", *filters.InvoiceID)
	}

	// filter issue date
	if filters.IssueDate != nil {
		date := filters.IssueDate.Format("2006-01-02")
		db = db.Where("issue_date = ?", date)
	}

	// filter subject
	if filters.Subject != nil && *filters.Subject != "" {
		db = db.Where("subject LIKE ?", "%"+*filters.Subject+"%")
	}

	// filter customer name
	if filters.CustomerName != "" {
		db = db.Joins("JOIN customers ON customers.id = invoices.customer_id").
			Where("customers.name LIKE ?", "%"+filters.CustomerName+"%")
	}

	// filter due date
	if filters.DueDate != nil {
		date := filters.DueDate.Format("2006-01-02")
		db = db.Where("due_date = ?", date)
	}

	// filter status
	if filters.Status != "" {
		db = db.Where("status = ?", filters.Status)
	}

	// pagination
	limit := filters.Limit
	if limit <= 0 {
		limit = 10
	}

	if filters.Cursor != nil && !filters.Cursor.IsZero() {
		db = db.Where("invoices.created_at < ?", *filters.Cursor)
	}

	db = db.Order("invoices.created_at DESC").Limit(limit + 1)

	var invoices []models.Invoice

	if err := db.Find(&invoices).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []domain.Invoice{}, nil, nil
		}
		return nil, nil, err
	}

	// next cursor
	var nextCursor *time.Time
	if len(invoices) > limit {
		next := invoices[len(invoices)-1].CreatedAt
		nextCursor = &next
		invoices = invoices[:limit]
	}

	result := make([]domain.Invoice, 0, len(invoices))
	for _, inv := range invoices {
		result = append(result, mapper.ToDomainInvoice(inv))
	}

	return result, nextCursor, nil
}

func (i *invoiceRepository) CreateInvoice(invoice domain.Invoice) error {
	invModel := mapper.ToModelInvoice(invoice)

	err := i.db.Transaction(func(tx *gorm.DB) error {
		// Buat invoice terlebih dahulu
		if err := tx.Omit("Items").Create(&invModel).Error; err != nil {
			return fmt.Errorf("create invoice failed: %w", err)
		}

		// Assign invoice_id ke items
		for idx := range invModel.Items {
			invModel.Items[idx].InvoiceID = invModel.ID
		}

		// Insert items jika ada
		if len(invModel.Items) > 0 {
			if err := tx.Create(&invModel.Items).Error; err != nil {
				return fmt.Errorf("create items failed: %w", err)
			}
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("failed to create invoice: %w", err)
	}

	return nil
}

func (i *invoiceRepository) GetInvoiceByID(id uint) (domain.Invoice, error) {
	var invModel models.Invoice

	err := i.db.Preload("Customer").Preload("Items.Item").First(&invModel, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Invoice{}, nil
		}
		return domain.Invoice{}, fmt.Errorf("failed to get invoice by ID: %w", err)
	}

	return mapper.ToDomainInvoice(invModel), nil
}

func (i *invoiceRepository) UpdateInvoice(id uint, invoice domain.Invoice) error {
	return i.db.Transaction(func(tx *gorm.DB) error {
		// Ambil invoice lama beserta items
		var existing models.Invoice
		if err := tx.Preload("Items").First(&existing, id).Error; err != nil {
			return fmt.Errorf("invoice not found: %w", err)
		}

		// Mapping item_id lama -> model
		existingItems := make(map[uint]models.InvoiceItem)
		for _, it := range existing.Items {
			existingItems[it.ItemID] = it
		}

		var subtotal float64
		for _, newItem := range invoice.Items {
			total := newItem.Price * float64(newItem.Quantity)

			if oldItem, ok := existingItems[newItem.ItemID]; ok {
				// Update item lama
				if err := tx.Model(&oldItem).Updates(models.InvoiceItem{
					Quantity:   newItem.Quantity,
					Price:      newItem.Price,
					TotalPrice: total,
				}).Error; err != nil {
					return err
				}
				delete(existingItems, newItem.ItemID) // tandai sudah diproses
			} else {
				// Insert item baru
				if err := tx.Create(&models.InvoiceItem{
					InvoiceID:  id,
					ItemID:     newItem.ItemID,
					Quantity:   newItem.Quantity,
					Price:      newItem.Price,
					TotalPrice: total,
				}).Error; err != nil {
					return err
				}
			}
			subtotal += total
		}

		// Hapus item yang ada di DB tapi tidak ada di request
		for _, oldItem := range existingItems {
			if err := tx.Delete(&oldItem).Error; err != nil {
				return err
			}
		}

		// Update total invoice
		if err := tx.Model(&existing).Updates(models.Invoice{
			IssueDate:   invoice.IssueDate,
			DueDate:     invoice.DueDate,
			Subject:     invoice.Subject,
			CustomerID:  invoice.CustomerID,
			Status:      invoice.Status,
			Subtotal:    subtotal,
			Tax:         subtotal * 0.11,
			TotalAmount: subtotal * 1.11,
			TotalItems:  len(invoice.Items),
			UpdatedAt:   time.Now(),
		}).Error; err != nil {
			return err
		}

		return nil
	})
}
