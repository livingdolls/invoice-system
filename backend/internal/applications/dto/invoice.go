package dto

import "time"

type GetInvoiceFilterRequest struct {
	InvoiceID    *string    `form:"invoice_id"`
	IssueDate    *time.Time `form:"issue_date"`
	Subject      *string    `form:"subject"`
	CustomerName string     `form:"customer_name"`
	DueDate      *time.Time `form:"due_date"`
	Status       string     `form:"status"`
	Cursor       *time.Time `form:"cursor"`
	Limit        int        `form:"limit"`
}

type InvoiceResponse struct {
	ID            uint      `json:"id"`
	InvoiceNumber string    `json:"invoice_number"`
	IssueDate     time.Time `json:"issue_date"`
	DueDate       time.Time `json:"due_date"`
	Subject       string    `json:"subject"`
	CustomerName  string    `json:"customer_name"`
	TotalAmount   float64   `json:"total_amount"`
	Status        string    `json:"status"`
}

type InvoiceListResponse struct {
	Invoices   []InvoiceResponse `json:"invoices"`
	NextCursor *time.Time        `json:"next_cursor,omitempty"`
}

type InvoiceDetailResponse struct {
	ID            uint                  `json:"id"`
	InvoiceNumber string                `json:"invoice_number"`
	IssueDate     time.Time             `json:"issue_date"`
	DueDate       time.Time             `json:"due_date"`
	Subject       string                `json:"subject"`
	Customer      CustomerResponse      `json:"customer"`
	Items         []InvoiceItemResponse `json:"items"`
	Subtotal      float64               `json:"subtotal"`
	Tax           float64               `json:"tax"`
	TotalAmount   float64               `json:"total_amount"`
	Status        string                `json:"status"`
	CreatedAt     time.Time             `json:"created_at"`
	UpdatedAt     time.Time             `json:"updated_at"`
}

type CreateInvoiceItemRequest struct {
	ItemID   uint    `json:"item_id" validate:"required"`
	Quantity int     `json:"quantity" validate:"required,gt=0"`
	Price    float64 `json:"price" validate:"required,gt=0"`
}

type CreateInvoiceRequest struct {
	InvoiceNumber string                     `json:"invoice_number" validate:"required"`
	IssueDate     time.Time                  `json:"issue_date" validate:"required"`
	DueDate       time.Time                  `json:"due_date" validate:"required"`
	Subject       string                     `json:"subject"`
	CustomerID    uint                       `json:"customer_id" validate:"required"`
	Subtotal      float64                    `json:"subtotal" validate:"required,gt=0"`
	Tax           float64                    `json:"tax"`
	TotalAmount   float64                    `json:"total_amount" validate:"required,gt=0"`
	Status        string                     `json:"status" validate:"oneof=paid unpaid"`
	Items         []CreateInvoiceItemRequest `json:"items" validate:"required,dive"`
}

// UpdateInvoiceRequest represents the request payload for updating an invoice
type UpdateInvoiceRequest struct {
	InvoiceNumber string    `json:"invoice_number"`
	IssueDate     time.Time `json:"issue_date"`
	DueDate       time.Time `json:"due_date"`
	Tax           float64
	Subject       string             `json:"subject"`
	CustomerID    uint               `json:"customer_id"`
	Status        string             `json:"status"`
	Items         []InvoiceItemInput `json:"items"`
}

type InvoiceItemInput struct {
	ItemID   uint    `json:"item_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}
