package repository

import (
	"invoice-system/internal/applications/ports/repository"
	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/mapper"
	"invoice-system/internal/infra/db/models"

	"gorm.io/gorm"
)

type itemRepository struct {
	db *gorm.DB
}

func NewItemRepository(db *gorm.DB) repository.ItemRepository {
	return &itemRepository{
		db: db,
	}
}

// GetAllItems implements repository.ItemRepository.
func (i *itemRepository) GetAllItems(NameOrType string) ([]domain.Item, error) {
	var models []models.Item

	db := i.db

	if NameOrType != "" {
		db = db.Where("name LIKE ? OR type LIKE ?", "%"+NameOrType+"%", "%"+NameOrType+"%")
	}

	err := db.Where("is_active = ?", 1).Find(&models).Error
	if err != nil {
		return nil, err
	}

	items := make([]domain.Item, 0, len(models))
	for _, m := range models {
		items = append(items, mapper.ToDomainItem(m))
	}

	return items, nil
}
