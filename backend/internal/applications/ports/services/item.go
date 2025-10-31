package services

import "invoice-system/internal/domain"

type ItemService interface {
	GetAllItems(nameOrType string) ([]domain.Item, error)
}
