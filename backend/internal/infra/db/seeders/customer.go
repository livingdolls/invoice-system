package seeders

import (
	"invoice-system/internal/infra/db/models"
	"time"

	"gorm.io/gorm"
)

func SeedCustomers(db *gorm.DB) error {
	customers := []models.Customer{
		{
			Name:      "PT Arunika Digital",
			Email:     "contact@arunika.id",
			Phone:     "081234567890",
			Address:   "Jl. Merdeka No. 10, Jakarta",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "CV Kreativa Studio",
			Email:     "hello@kreativa.co.id",
			Phone:     "082233445566",
			Address:   "Jl. Melati No. 45, Bandung",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	for _, c := range customers {
		var existing models.Customer
		if err := db.Where("email = ?", c.Email).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&c).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
	}

	return nil
}
