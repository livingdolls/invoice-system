package repository

import "invoice-system/internal/domain"

type ItemRepository interface {
	GetAllItems(NameOrType string, limit uint) ([]domain.Item, error)
	AddItem(item domain.Item) error
}
