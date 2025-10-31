package seeders

import (
	"invoice-system/internal/infra/db/models"
	"time"

	"gorm.io/gorm"
)

func SeedInvoiceItems(db *gorm.DB) error {
	var invoices []models.Invoice
	var items []models.Item

	if err := db.Find(&invoices).Error; err != nil {
		return err
	}
	if err := db.Find(&items).Error; err != nil {
		return err
	}

	if len(invoices) == 0 || len(items) == 0 {
		return nil // Skip if no invoices or items exist
	}

	// Create invoice items for each invoice
	var invoiceItems []models.InvoiceItem

	for i, invoice := range invoices {
		// Determine number of items per invoice based on TotalItems
		numItems := int(invoice.TotalItems)
		if numItems > len(items) {
			numItems = len(items)
		}

		// Calculate price per item based on subtotal
		pricePerItem := invoice.Subtotal / float64(numItems)

		// Create items for this invoice
		for j := 0; j < numItems; j++ {
			itemIndex := (i + j) % len(items) // Rotate through available items

			quantity := 1
			if j == 0 && numItems == 1 {
				// If only one item, use full subtotal
				pricePerItem = invoice.Subtotal
			} else if j == numItems-1 {
				// For last item, adjust price to match exact subtotal
				remainingPrice := invoice.Subtotal
				for k := 0; k < j; k++ {
					remainingPrice -= pricePerItem
				}
				pricePerItem = remainingPrice
			}

			invoiceItem := models.InvoiceItem{
				InvoiceID:  invoice.ID,
				ItemID:     items[itemIndex].ID,
				Quantity:   quantity,
				Price:      pricePerItem,
				TotalPrice: pricePerItem * float64(quantity),
				CreatedAt:  time.Now(),
			}

			invoiceItems = append(invoiceItems, invoiceItem)
		}
	}

	// Insert all invoice items
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
