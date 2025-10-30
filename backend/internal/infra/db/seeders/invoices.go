package seeders

import (
	"invoice-system/internal/infra/db/models"
	"time"

	"gorm.io/gorm"
)

func SeedInvoices(db *gorm.DB) error {
	// ambil salah satu customer
	var customer models.Customer
	if err := db.First(&customer).Error; err != nil {
		return err
	}

	invoices := []models.Invoice{
		{
			InvoiceNumber: "INV-001",
			IssueDate:     time.Now(),
			DueDate:       time.Now().AddDate(0, 0, 14),
			Subject:       "Website Development Project",
			CustomerID:    customer.ID,
			TotalItems:    2,
			Subtotal:      4500000,
			Tax:           0,
			TotalAmount:   4500000,
			Status:        "unpaid",
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
	}

	for _, inv := range invoices {
		var existing models.Invoice
		if err := db.Where("invoice_number = ?", inv.InvoiceNumber).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&inv).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
	}

	return nil
}
