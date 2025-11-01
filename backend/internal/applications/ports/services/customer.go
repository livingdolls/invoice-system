package services

import "invoice-system/internal/applications/dto"

type CustomerService interface {
	Create(req dto.CreateCustomerRequest) error
	FindCustomers() ([]dto.CustomerResponse, error)
}
