package service

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/applications/mapper"
	"invoice-system/internal/applications/ports/repository"
	"invoice-system/internal/applications/ports/services"
	"invoice-system/internal/domain"
)

type InvoiceService struct {
	repo repository.InvoiceRepository
}

func NewInvoiceService(repo repository.InvoiceRepository) services.InvoiceService {
	return &InvoiceService{repo: repo}
}

// GetAllInvoices implements services.InvoiceService.
func (i *InvoiceService) GetAllInvoices(filters dto.GetInvoiceFilterRequest) (dto.InvoiceListResponse, error) {
	filter := mapper.ToDomainInvoiceFilter(filters)

	invoice, next, err := i.repo.GetAllInvoices(filter)

	if err != nil {
		return dto.InvoiceListResponse{}, err
	}

	return mapper.ToInvoiceListResponse(invoice, next), nil
}

// CreateInvoice implements services.InvoiceService.
func (i *InvoiceService) CreateInvoice(req dto.CreateInvoiceRequest) error {
	items := make([]domain.InvoiceItem, len(req.Items))

	var subtotal float64

	for i, item := range req.Items {
		items[i] = domain.InvoiceItem{
			ItemID:     item.ItemID,
			Quantity:   item.Quantity,
			Price:      item.Price,
			TotalPrice: item.Price * float64(item.Quantity),
		}

		subtotal += items[i].TotalPrice
	}

	invoice := domain.Invoice{
		InvoiceNumber: req.InvoiceNumber,
		IssueDate:     req.IssueDate,
		DueDate:       req.DueDate,
		Subject:       req.Subject,
		CustomerID:    req.CustomerID,
		Subtotal:      subtotal,
		Tax:           req.Tax,
		TotalAmount:   subtotal + (subtotal * req.Tax / 100),
		Status:        req.Status,
		TotalItems:    len(items),
		Items:         items,
	}

	err := i.repo.CreateInvoice(invoice)
	if err != nil {
		return err
	}

	return nil
}

func (i *InvoiceService) GetInvoiceByID(id uint) (dto.InvoiceDetailResponse, error) {
	invoice, err := i.repo.GetInvoiceByID(id)
	if err != nil {
		return dto.InvoiceDetailResponse{}, err
	}

	return mapper.ToInvoiceDetailResponse(invoice), nil
}

func (i *InvoiceService) UpdateInvoice(id uint, req dto.UpdateInvoiceRequest) error {
	items := make([]domain.InvoiceItem, len(req.Items))
	var subtotal float64

	for i, item := range req.Items {
		items[i] = domain.InvoiceItem{
			ItemID:     item.ItemID,
			Quantity:   item.Quantity,
			Price:      item.Price,
			TotalPrice: item.Price * float64(item.Quantity),
		}

		subtotal += items[i].TotalPrice
	}

	invoice := domain.Invoice{
		InvoiceNumber: req.InvoiceNumber,
		IssueDate:     req.IssueDate,
		DueDate:       req.DueDate,
		Subject:       req.Subject,
		CustomerID:    req.CustomerID,
		Subtotal:      subtotal,
		Tax:           req.Tax,
		TotalAmount:   subtotal + (subtotal * req.Tax / 100),
		Status:        req.Status,
		TotalItems:    len(items),
		Items:         items,
	}

	err := i.repo.UpdateInvoice(id, invoice)
	if err != nil {
		return err
	}

	return nil
}
