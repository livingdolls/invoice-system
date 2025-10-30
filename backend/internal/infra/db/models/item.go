package models

import (
	"time"

	"gorm.io/gorm"
)

type Item struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"type:varchar(255);not null" json:"name"`
	Type      string         `gorm:"type:varchar(255)" json:"type"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	InvoiceItems []InvoiceItem `gorm:"foreignKey:ItemID" json:"invoice_items,omitempty"`
}
