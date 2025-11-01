package service

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/applications/mapper"
	"invoice-system/internal/applications/ports/repository"
	"invoice-system/internal/applications/ports/services"
)

type customerService struct {
	repo repository.CustomerRepository
}

func NewCustomerService(repo repository.CustomerRepository) services.CustomerService {
	return &customerService{repo: repo}
}

// Create implements services.CustomerService.
func (c *customerService) Create(req dto.CreateCustomerRequest) error {
	customer := mapper.ToDomainCustomerCreate(req)

	err := c.repo.CreateCustomer(&customer)
	if err != nil {
		return err
	}

	return nil
}

// FindCustomers implements services.CustomerService.
func (c *customerService) FindCustomers() ([]dto.CustomerResponse, error) {
	customers, err := c.repo.FindCustomers()
	if err != nil {
		return nil, err
	}

	return mapper.ToCustomerResponseList(customers), nil
}
