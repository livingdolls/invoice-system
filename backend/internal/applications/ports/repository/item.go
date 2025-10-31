package repository

import "invoice-system/internal/domain"

type ItemRepository interface {
	GetAllItems(NameOrType string) ([]domain.Item, error)
}
