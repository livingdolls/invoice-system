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
			Address:   "Jl. Merdeka No. 10, Jakarta Pusat, DKI Jakarta 10110",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "CV Kreativa Studio",
			Email:     "hello@kreativa.co.id",
			Phone:     "082233445566",
			Address:   "Jl. Melati No. 45, Bandung, Jawa Barat 40123",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "PT Teknologi Maju Bersama",
			Email:     "info@teknomabar.com",
			Phone:     "021-55567890",
			Address:   "Jl. Sudirman Kav. 52-53, Jakarta Selatan, DKI Jakarta 12190",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "CV Solusi Digital Indonesia",
			Email:     "admin@soludigin.id",
			Phone:     "0274-123456",
			Address:   "Jl. Malioboro No. 123, Yogyakarta, DIY 55213",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "PT Inovasi Berkah Teknologi",
			Email:     "contact@inobertek.co.id",
			Phone:     "031-7654321",
			Address:   "Jl. Basuki Rahmat No. 78, Surabaya, Jawa Timur 60271",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "UD Mandiri Sejahtera",
			Email:     "mandiri.sejahtera@gmail.com",
			Phone:     "0361-987654",
			Address:   "Jl. Sunset Road No. 99, Denpasar, Bali 80117",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "PT Digital Nusantara Solutions",
			Email:     "info@diginus.com",
			Phone:     "024-8765432",
			Address:   "Jl. Pemuda No. 150, Semarang, Jawa Tengah 50132",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "CV Media Kreatif Indonesia",
			Email:     "hello@mediakreatif.id",
			Phone:     "0251-333444",
			Address:   "Jl. Pajajaran No. 25, Bogor, Jawa Barat 16143",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "PT Quantum Digital Labs",
			Email:     "labs@quantum.digital",
			Phone:     "022-5555666",
			Address:   "Jl. Dago No. 88, Bandung, Jawa Barat 40135",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:      "Toko Elektronik Jaya Abadi",
			Email:     "jayaabadi@elektronik.com",
			Phone:     "0411-234567",
			Address:   "Jl. Ahmad Yani No. 200, Makassar, Sulawesi Selatan 90231",
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
