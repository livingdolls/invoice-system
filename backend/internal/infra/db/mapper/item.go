package mapper

import (
	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/models"
)

func ToDomainItem(m models.Item) domain.Item {
	return domain.Item{
		ID:        m.ID,
		Name:      m.Name,
		Type:      m.Type,
		IsActive:  m.IsActive,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

func ToModelItem(d domain.Item) models.Item {
	return models.Item{
		ID:        d.ID,
		Name:      d.Name,
		Type:      d.Type,
		IsActive:  d.IsActive,
		CreatedAt: d.CreatedAt,
		UpdatedAt: d.UpdatedAt,
	}
}
