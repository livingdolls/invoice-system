package domain

import "time"

type Invoice struct {
	ID            uint
	InvoiceNumber string
	IssueDate     time.Time
	DueDate       time.Time
	Subject       string
	CustomerID    uint
	TotalItems    int
	Subtotal      float64
	Tax           float64
	TotalAmount   float64
	Status        string
	CreatedAt     time.Time
	UpdatedAt     time.Time

	Customer *Customer
	Items    []InvoiceItem
}

type Pagination struct {
	TotalItems  int64
	TotalPages  int
	CurrentPage int
	PrevPage    *int
	NextPage    *int
	Limit       int
}

type InvoiceItem struct {
	ID         uint
	InvoiceID  uint
	ItemID     uint
	ItemName   string
	Type       string
	Quantity   int
	Price      float64
	TotalPrice float64
	CreatedAt  time.Time

	Item    *Item
	Invoice *Invoice
}

type InvoiceFilter struct {
	InvoiceID    *string
	IssueDate    *time.Time
	Subject      *string
	CustomerName string
	DueDate      *time.Time
	Status       string

	Limit  int
	Page   int
	Cursor *time.Time
}
