package seeders

import (
	"invoice-system/internal/infra/db/models"
	"time"

	"gorm.io/gorm"
)

func SeedItems(db *gorm.DB) error {
	items := []models.Item{
		{
			Name:      "Logo Design",
			Type:      "Service",
			IsActive:  true,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "Development",
			Type:      "Service",
			IsActive:  true,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "Meetings",
			Type:      "Service",
			IsActive:  true,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "Printer",
			Type:      "Hardware",
			IsActive:  true,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "Monitor",
			Type:      "Hardware",
			IsActive:  true,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	for _, item := range items {
		var existing models.Item
		// Cek apakah item sudah ada (berdasarkan nama)
		if err := db.Where("name = ?", item.Name).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&item).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
	}

	return nil
}
