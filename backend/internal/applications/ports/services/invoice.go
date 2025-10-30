package services

import (
	"invoice-system/internal/applications/dto"
)

type InvoiceService interface {
	GetAllInvoices(filters dto.GetInvoiceFilterRequest) (dto.InvoiceListResponse, error)
	CreateInvoice(req dto.CreateInvoiceRequest) error
	GetInvoiceByID(id uint) (dto.InvoiceDetailResponse, error)
	UpdateInvoice(id uint, req dto.UpdateInvoiceRequest) error
}
