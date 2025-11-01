package repository

import (
	"errors"
	"fmt"
	"invoice-system/internal/applications/ports/repository"
	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/mapper"
	"invoice-system/internal/infra/db/models"
	"invoice-system/internal/utils"
	"math"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type invoiceRepository struct {
	db *gorm.DB
}

func NewInvoiceRepository(db *gorm.DB) repository.InvoiceRepository {
	return &invoiceRepository{db: db}
}

// GetAllInvoices implements repository.InvoiceRepository.
func (i *invoiceRepository) GetAllInvoices(filters domain.InvoiceFilter) ([]domain.Invoice, domain.Pagination, error) {
	// helper to apply all filters consistently
	applyFilters := func(db *gorm.DB) *gorm.DB {
		// filter invoice id
		if filters.InvoiceID != nil && *filters.InvoiceID != "" {
			db = db.Where("invoice_number LIKE ?", "%"+*filters.InvoiceID+"%")
		}

		// filter issue date
		if filters.IssueDate != nil {
			date := filters.IssueDate.Format("2006-01-02")
			db = db.Where("DATE(issue_date) = ?", date)
		}

		// filter subject
		if filters.Subject != nil && *filters.Subject != "" {
			db = db.Where("subject LIKE ?", "%"+*filters.Subject+"%")
		}

		if filters.TotalItems != nil {
			db = db.Where("total_items = ?", filters.TotalItems)
		}

		// filter customer name
		if filters.CustomerName != "" {
			db = db.Joins("JOIN customers ON customers.id = invoices.customer_id").
				Where("customers.name LIKE ?", "%"+filters.CustomerName+"%")
		}

		// filter due date
		if filters.DueDate != nil {
			date := filters.DueDate.Format("2006-01-02")
			db = db.Where("DATE(due_date) = ?", date)
		}

		// filter status
		if filters.Status != "" {
			db = db.Where("status = ?", filters.Status)
		}

		return db
	}

	// pagination params
	limit := filters.Limit
	if limit <= 0 {
		limit = 10
	}
	page := filters.Page
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	// COUNT total items with filters
	var totalItems int64
	countDB := applyFilters(i.db.Model(&models.Invoice{}))
	if err := countDB.Count(&totalItems).Error; err != nil {
		return nil, domain.Pagination{}, fmt.Errorf("failed to count invoices: %w", err)
	}

	// Fetch data with preloads and ordering
	dataDB := applyFilters(i.db.Model(&models.Invoice{})).
		Preload("Customer").
		Preload("Items.Item").
		Order("invoices.created_at DESC").
		Limit(limit).
		Offset(offset)

	var invoices []models.Invoice
	if err := dataDB.Find(&invoices).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []domain.Invoice{}, domain.Pagination{TotalItems: 0, TotalPages: 0, CurrentPage: page, Limit: limit}, nil
		}
		return nil, domain.Pagination{}, err
	}

	// compute pagination metadata
	totalPages := int(math.Ceil(float64(totalItems) / float64(limit)))
	var prevPage *int
	var nextPage *int
	if page > 1 {
		p := page - 1
		prevPage = &p
	}
	if page < totalPages {
		n := page + 1
		nextPage = &n
	}
	pagination := domain.Pagination{
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		CurrentPage: page,
		PrevPage:    prevPage,
		NextPage:    nextPage,
		Limit:       limit,
	}

	// map models to domain
	result := make([]domain.Invoice, 0, len(invoices))
	for _, inv := range invoices {
		result = append(result, mapper.ToDomainInvoice(inv))
	}

	return result, pagination, nil
}

func (i *invoiceRepository) CreateInvoice(invoice domain.Invoice) error {
	invModel := mapper.ToModelInvoice(invoice)

	err := i.db.Transaction(func(tx *gorm.DB) error {

		last, err := i.getLastInvoiceCode()

		if err != nil {
			return fmt.Errorf("failed get last invoice code : %w", err)
		}

		// generate code invoice
		codeInvice := utils.GenerateNextInvoiceCode(last)
		invModel.InvoiceNumber = codeInvice

		// Buat invoice
		if err := tx.Omit("Items").Create(&invModel).Error; err != nil {
			return fmt.Errorf("create invoice failed: %w", err)
		}

		// Assign invoice_id ke items
		for idx := range invModel.Items {
			invModel.Items[idx].InvoiceID = invModel.ID
		}

		// Insert items jika
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
		if utils.IsNotFound(err) {
			return domain.Invoice{}, utils.ErrInvoiceNotFound
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
			Tax:         subtotal * (10.0 / 100.0),
			TotalAmount: subtotal + (subtotal * (10.0 / 100.0)),
			TotalItems:  len(invoice.Items),
			UpdatedAt:   time.Now(),
		}).Error; err != nil {
			return err
		}

		return nil
	})
}

func (i *invoiceRepository) getLastInvoiceCode() (string, error) {
	var last string

	err := i.db.Table("invoices").Select("invoice_number").Order("invoice_number DESC").Limit(1).Clauses(clause.Locking{Strength: "UPDATE"}).Scan(&last).Error

	return last, err
}
