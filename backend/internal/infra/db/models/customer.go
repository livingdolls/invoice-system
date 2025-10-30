package models

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"type:varchar(255);not null" json:"name"`
	Email     string         `gorm:"type:varchar(255);uniqueIndex" json:"email"`
	Phone     string         `gorm:"type:varchar(50)" json:"phone"`
	Address   string         `gorm:"type:text" json:"address"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Invoices []Invoice `gorm:"foreignKey:CustomerID" json:"invoices,omitempty"`
}
