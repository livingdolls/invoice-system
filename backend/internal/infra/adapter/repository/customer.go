package repository

import (
	"invoice-system/internal/applications/ports/repository"
	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/mapper"
	"invoice-system/internal/infra/db/models"
	"invoice-system/internal/utils"

	"gorm.io/gorm"
)

type customerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) repository.CustomerRepository {
	return &customerRepository{db: db}
}

// CreateCustomer implements repository.CustomerRepository.
func (c *customerRepository) CreateCustomer(customer *domain.Customer) error {
	m := mapper.ToModelCustomer(*customer)

	if err := c.db.Create(&m).Error; err != nil {
		if utils.IsDuplicateKeyError(err) {
			return utils.ErrCustomerAlreadyExists
		}

		return err
	}

	return nil
}

// FindCustomers implements repository.CustomerRepository.
func (c *customerRepository) FindCustomers() ([]domain.Customer, error) {
	var models []models.Customer

	err := c.db.Preload("Invoices").Find(&models).Error
	if err != nil {
		return nil, err
	}

	var customers []domain.Customer
	for _, m := range models {
		customers = append(customers, mapper.ToDomainCustomer(m))
	}

	return customers, nil
}
