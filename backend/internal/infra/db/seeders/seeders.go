package seeders

import (
	"log"

	"gorm.io/gorm"
)

func SeedAll(db *gorm.DB) {
	log.Println("🌱 Starting database seeding...")

	if err := SeedCustomers(db); err != nil {
		log.Fatalf("Failed seeding customers: %v", err)
	}
	if err := SeedItems(db); err != nil {
		log.Fatalf("Failed seeding items: %v", err)
	}
	if err := SeedInvoices(db); err != nil {
		log.Fatalf("Failed seeding invoices: %v", err)
	}
	if err := SeedInvoiceItems(db); err != nil {
		log.Fatalf("Failed seeding invoice items: %v", err)
	}

	log.Println("Database seeding completed successfully.")
}
