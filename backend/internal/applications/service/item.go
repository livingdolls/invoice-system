package service

import (
	"invoice-system/internal/applications/ports/repository"
	"invoice-system/internal/applications/ports/services"
	"invoice-system/internal/domain"
)

type itemService struct {
	repo repository.ItemRepository
}

func NewItemService(repo repository.ItemRepository) services.ItemService {
	return &itemService{
		repo: repo,
	}
}

// GetAllItems implements services.ItemService.
func (s *itemService) GetAllItems(NameOrType string) ([]domain.Item, error) {
	return s.repo.GetAllItems(NameOrType)
}
