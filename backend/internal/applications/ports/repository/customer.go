package repository

import "invoice-system/internal/domain"

type CustomerRepository interface {
	CreateCustomer(customer *domain.Customer) error
	FindCustomers() ([]domain.Customer, error)
}
