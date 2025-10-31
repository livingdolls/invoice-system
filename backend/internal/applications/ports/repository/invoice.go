package repository

import (
	"invoice-system/internal/domain"
)

type InvoiceRepository interface {
	GetAllInvoices(filters domain.InvoiceFilter) ([]domain.Invoice, domain.Pagination, error)
	CreateInvoice(invoice domain.Invoice) error
	GetInvoiceByID(id uint) (domain.Invoice, error)
	UpdateInvoice(id uint, invoice domain.Invoice) error
}
