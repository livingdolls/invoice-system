package services

import "invoice-system/internal/applications/dto"

type CustomerService interface {
	Create(req dto.CreateCustomerRequest) (dto.CustomerResponse, error)
	FindCustomers() ([]dto.CustomerResponse, error)
}
