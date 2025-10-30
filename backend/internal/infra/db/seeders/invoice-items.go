package seeders

import (
	"invoice-system/internal/infra/db/models"
	"time"

	"gorm.io/gorm"
)

func SeedInvoiceItems(db *gorm.DB) error {
	var invoice models.Invoice
	var items []models.Item

	if err := db.First(&invoice).Error; err != nil {
		return err
	}
	if err := db.Find(&items).Error; err != nil {
		return err
	}

	invoiceItems := []models.InvoiceItem{
		{
			InvoiceID:  invoice.ID,
			ItemID:     items[0].ID,
			Quantity:   1,
			Price:      2500000,
			TotalPrice: 2500000,
			CreatedAt:  time.Now(),
		},
		{
			InvoiceID:  invoice.ID,
			ItemID:     items[1].ID,
			Quantity:   1,
			Price:      2000000,
			TotalPrice: 2000000,
			CreatedAt:  time.Now(),
		},
	}

	for _, it := range invoiceItems {
		var existing models.InvoiceItem
		if err := db.Where("invoice_id = ? AND item_id = ?", it.InvoiceID, it.ItemID).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&it).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
	}

	return nil
}
