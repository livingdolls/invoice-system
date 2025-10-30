package mapper

import (
	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/models"
)

func ToDomainCustomer(m models.Customer) domain.Customer {
	return domain.Customer{
		ID:        m.ID,
		Name:      m.Name,
		Email:     m.Email,
		Phone:     m.Phone,
		Address:   m.Address,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

func ToModelCustomer(d domain.Customer) models.Customer {
	return models.Customer{
		ID:        d.ID,
		Name:      d.Name,
		Email:     d.Email,
		Phone:     d.Phone,
		Address:   d.Address,
		CreatedAt: d.CreatedAt,
		UpdatedAt: d.UpdatedAt,
	}
}
