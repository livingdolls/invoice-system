package mapper

import (
	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/models"
)

func ToDomainInvoiceItem(m models.InvoiceItem) domain.InvoiceItem {
	return domain.InvoiceItem{
		ID:         m.ID,
		InvoiceID:  m.InvoiceID,
		ItemID:     m.ItemID,
		ItemName:   m.Item.Name,
		Type:       m.Item.Type,
		Quantity:   m.Quantity,
		Price:      m.Price,
		TotalPrice: m.TotalPrice,
		CreatedAt:  m.CreatedAt,
	}
}

func ToModelInvoiceItem(d domain.InvoiceItem) models.InvoiceItem {
	return models.InvoiceItem{
		ID:         d.ID,
		InvoiceID:  d.InvoiceID,
		ItemID:     d.ItemID,
		Quantity:   d.Quantity,
		Price:      d.Price,
		TotalPrice: d.TotalPrice,
		CreatedAt:  d.CreatedAt,
	}
}

func ToDomainInvoice(m models.Invoice) domain.Invoice {
	var items []domain.InvoiceItem
	for _, it := range m.Items {
		items = append(items, ToDomainInvoiceItem(it))
	}

	var customer domain.Customer
	if m.Customer != nil {
		customer = ToDomainCustomer(*m.Customer)
	}

	return domain.Invoice{
		ID:            m.ID,
		InvoiceNumber: m.InvoiceNumber,
		IssueDate:     m.IssueDate,
		DueDate:       m.DueDate,
		Subject:       m.Subject,
		CustomerID:    m.CustomerID,
		TotalItems:    m.TotalItems,
		Subtotal:      m.Subtotal,
		Tax:           m.Tax,
		TotalAmount:   m.TotalAmount,
		Status:        m.Status,
		CreatedAt:     m.CreatedAt,
		UpdatedAt:     m.UpdatedAt,
		Customer:      &customer,
		Items:         items,
	}
}

func ToModelInvoice(d domain.Invoice) models.Invoice {
	var items []models.InvoiceItem
	for _, it := range d.Items {
		items = append(items, ToModelInvoiceItem(it))
	}

	return models.Invoice{
		ID:            d.ID,
		InvoiceNumber: d.InvoiceNumber,
		IssueDate:     d.IssueDate,
		DueDate:       d.DueDate,
		Subject:       d.Subject,
		CustomerID:    d.CustomerID,
		TotalItems:    d.TotalItems,
		Subtotal:      d.Subtotal,
		Tax:           d.Tax,
		TotalAmount:   d.TotalAmount,
		Status:        d.Status,
		CreatedAt:     d.CreatedAt,
		UpdatedAt:     d.UpdatedAt,
		Items:         items,
	}
}
