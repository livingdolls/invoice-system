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
func (i *itemRepository) GetAllItems(NameOrType string, limit uint) ([]domain.Item, error) {
	var models []models.Item

	db := i.db

	if limit <= 0 {
		limit = 10
	}

	db = db.Limit(int(limit))

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

func (i *itemRepository) AddItem(item domain.Item) error {
	model := mapper.ToModelItem(item)

	return i.db.Create(&model).Error
}
