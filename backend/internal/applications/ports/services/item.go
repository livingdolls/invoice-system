package services

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/domain"
)

type ItemService interface {
	GetAllItems(nameOrType string, limit uint) ([]domain.Item, error)
	AddItem(item dto.DTOAddItemRequest) error
}
