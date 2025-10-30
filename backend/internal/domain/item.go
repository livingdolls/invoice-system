package domain

import "time"

type Item struct {
	ID           uint
	Name         string
	Type         string
	IsActive     bool
	CreatedAt    time.Time
	UpdatedAt    time.Time
	InvoiceItems []InvoiceItem
}
