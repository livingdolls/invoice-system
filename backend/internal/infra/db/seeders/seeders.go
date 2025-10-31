package seeders

import (
	"log"

	"gorm.io/gorm"
)

func SeedAll(db *gorm.DB) {
	log.Println("🌱 Starting database seeding...")

	log.Println("📝 Seeding customers...")
	if err := SeedCustomers(db); err != nil {
		log.Fatalf("Failed seeding customers: %v", err)
	}
	log.Println("✅ Customers seeded successfully")

	log.Println("📦 Seeding items...")
	if err := SeedItems(db); err != nil {
		log.Fatalf("Failed seeding items: %v", err)
	}
	log.Println("✅ Items seeded successfully")

	log.Println("🧾 Seeding invoices...")
	if err := SeedInvoices(db); err != nil {
		log.Fatalf("Failed seeding invoices: %v", err)
	}
	log.Println("✅ Invoices seeded successfully")

	log.Println("📋 Seeding invoice items...")
	if err := SeedInvoiceItems(db); err != nil {
		log.Fatalf("Failed seeding invoice items: %v", err)
	}
	log.Println("✅ Invoice items seeded successfully")

	log.Println("🎉 Database seeding completed successfully!")
}
