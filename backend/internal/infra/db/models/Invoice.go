package models

import (
	"time"

	"gorm.io/gorm"
)

type Invoice struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	InvoiceNumber string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"invoice_number"`
	IssueDate     time.Time      `json:"issue_date"`
	DueDate       time.Time      `json:"due_date"`
	Subject       string         `gorm:"type:varchar(255)" json:"subject"`
	CustomerID    uint           `json:"customer_id"`
	TotalItems    int            `json:"total_items"`
	Subtotal      float64        `gorm:"type:decimal(12,2)" json:"subtotal"`
	Tax           float64        `gorm:"type:decimal(12,2)" json:"tax"`
	TotalAmount   float64        `gorm:"type:decimal(12,2)" json:"total_amount"`
	Status        string         `gorm:"type:enum('paid','unpaid');default:'unpaid'" json:"status"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	Customer *Customer     `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	Items    []InvoiceItem `gorm:"foreignKey:InvoiceID;constraint:OnDelete:CASCADE;" json:"items,omitempty"`
}

type InvoiceItem struct {
	ID         uint           `gorm:"primaryKey;autoIncrement"`
	InvoiceID  uint           `json:"invoice_id"`
	ItemID     uint           `json:"item_id"`
	Quantity   int            `json:"quantity"`
	Price      float64        `gorm:"type:decimal(12,2)" json:"price"`
	TotalPrice float64        `gorm:"type:decimal(12,2)" json:"total_price"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	Item    *Item    `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	Invoice *Invoice `gorm:"foreignKey:InvoiceID" json:"invoice,omitempty"`
}
