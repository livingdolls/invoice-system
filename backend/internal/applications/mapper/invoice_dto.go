package mapper

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/domain"
	"time"
)

// Request → Domain filter
func ToDomainInvoiceFilter(req dto.GetInvoiceFilterRequest) domain.InvoiceFilter {
	return domain.InvoiceFilter{
		InvoiceID:    req.InvoiceID,
		IssueDate:    req.IssueDate,
		Subject:      req.Subject,
		CustomerName: req.CustomerName,
		DueDate:      req.DueDate,
		Status:       req.Status,
		Cursor:       req.Cursor,
		Limit:        req.Limit,
	}
}

// Domain → Response
func ToInvoiceResponse(d domain.Invoice) dto.InvoiceResponse {
	var customerName string
	if d.Customer != nil {
		customerName = d.Customer.Name
	}

	return dto.InvoiceResponse{
		ID:            d.ID,
		InvoiceNumber: d.InvoiceNumber,
		IssueDate:     d.IssueDate,
		DueDate:       d.DueDate,
		Subject:       d.Subject,
		CustomerName:  customerName,
		TotalAmount:   d.TotalAmount,
		Status:        d.Status,
	}
}

func ToInvoiceDetailResponse(d domain.Invoice) dto.InvoiceDetailResponse {
	var customer dto.CustomerResponse
	if d.Customer != nil {
		customer = dto.CustomerResponse{
			ID:      d.Customer.ID,
			Name:    d.Customer.Name,
			Email:   d.Customer.Email,
			Phone:   d.Customer.Phone,
			Address: d.Customer.Address,
		}
	}

	items := make([]dto.InvoiceItemResponse, len(d.Items))
	for i, item := range d.Items {
		items[i] = dto.InvoiceItemResponse{
			ID:         item.ID,
			ItemID:     item.ItemID,
			ItemName:   item.ItemName,
			Type:       item.Type,
			Quantity:   item.Quantity,
			Price:      item.Price,
			TotalPrice: item.TotalPrice,
			CreatedAt:  item.CreatedAt.Format(time.RFC3339),
		}
	}

	return dto.InvoiceDetailResponse{
		ID:            d.ID,
		InvoiceNumber: d.InvoiceNumber,
		IssueDate:     d.IssueDate,
		DueDate:       d.DueDate,
		Subject:       d.Subject,
		Customer:      customer,
		Subtotal:      d.Subtotal,
		Tax:           d.Tax,
		TotalAmount:   d.TotalAmount,
		Status:        d.Status,
		Items:         items,
		CreatedAt:     d.CreatedAt,
		UpdatedAt:     d.UpdatedAt,
	}
}

func ToInvoiceListResponse(invoices []domain.Invoice, nextCursor *time.Time) dto.InvoiceListResponse {
	resp := make([]dto.InvoiceResponse, len(invoices))
	for i, inv := range invoices {
		resp[i] = ToInvoiceResponse(inv)
	}
	return dto.InvoiceListResponse{
		Invoices:   resp,
		NextCursor: nextCursor,
	}
}
