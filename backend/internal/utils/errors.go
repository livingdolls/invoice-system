package utils

import "errors"

var (
	ErrCustomerAlreadyExists = errors.New("customer already exists")
	ErrInvoiceNotFound       = errors.New("invoice not found")
	ErrItemAlreadyExists     = errors.New("item already exists")
)
