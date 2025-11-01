package repository

import (
	"testing"

	"invoice-system/internal/domain"
	"invoice-system/internal/infra/db/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open sqlite in-memory: %v", err)
	}

	if err := db.AutoMigrate(&models.Item{}); err != nil {
		t.Fatalf("failed to migrate models: %v", err)
	}

	return db
}

func TestGetAllItems(t *testing.T) {
	db := setupTestDB(t)

	// Seed
	items := []models.Item{
		{Name: "Laptop", Type: "Electronics"},
		{Name: "Keyboard", Type: "Electronics"},
		{Name: "Table", Type: "Furniture"},
		{Name: "Mouse", Type: "Electronics"},
	}
	for _, m := range items {
		db.Create(&m)
	}

	r := NewItemRepository(db)

	t.Run("limit applied", func(t *testing.T) {
		result, err := r.GetAllItems("", 2)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result) != 2 {
			t.Fatalf("expected 2 items, got %d", len(result))
		}
	})

	t.Run("filter by name", func(t *testing.T) {
		result, err := r.GetAllItems("Lap", 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result) != 1 {
			t.Fatalf("expected 1 result, got %d", len(result))
		}
		if result[0].Name != "Laptop" {
			t.Fatalf("expected Laptop, got %s", result[0].Name)
		}
	})

	t.Run("filter by type", func(t *testing.T) {
		result, err := r.GetAllItems("Furniture", 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result) != 1 || result[0].Type != "Furniture" {
			t.Fatalf("expected Table (Furniture)")
		}
	})

	t.Run("exclude inactive items", func(t *testing.T) {
		result, err := r.GetAllItems("", 10)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		for _, v := range result {
			if v.IsActive != true {
				t.Fatalf("found inactive item")
			}
		}
	})
}

func TestAddItem(t *testing.T) {
	db := setupTestDB(t)
	r := NewItemRepository(db)

	item := domain.Item{
		Name: "Camera",
		Type: "Electronics",
	}

	t.Run("success insert", func(t *testing.T) {
		err := r.AddItem(item)
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}

		var count int64
		db.Model(&models.Item{}).Where("name = ?", item.Name).Count(&count)
		if count != 1 {
			t.Fatalf("item not inserted")
		}
	})
}
