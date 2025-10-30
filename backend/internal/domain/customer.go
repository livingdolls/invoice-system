package domain

import (
	"time"
)

type Customer struct {
	ID        uint
	Name      string
	Email     string
	Phone     string
	Address   string
	CreatedAt time.Time
	UpdatedAt time.Time

	Invoices []Invoice
}
