package db

import (
	"database/sql"
	"fmt"
	"invoice-system/internal/config"
	"invoice-system/internal/infra/db/models"
	"invoice-system/internal/infra/db/seeders"
	"invoice-system/internal/infra/logger"
	"log"
	"time"

	"go.uber.org/zap"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database struct {
	DB *gorm.DB
}

func NewDatabase(cfg config.DatabaseConfig) (*Database, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.Name,
	)

	gormConfig := &gorm.Config{}

	db, err := gorm.Open(mysql.Open(dsn), gormConfig)

	if err != nil {
		return nil, fmt.Errorf("failed to connect DB: %w", err)
	}

	sqlDB, err := db.DB()

	log.Printf("DSN = %s", dsn)
	pingErr := sqlDB.Ping()
	log.Printf("PING ERROR = %v", pingErr)

	if err != nil {
		return nil, fmt.Errorf("failed to connect DB: %w", err)
	}

	// jalankan migrasi otomatis
	if err := db.AutoMigrate(
		&models.Customer{},
		&models.Invoice{},
		&models.InvoiceItem{},
		&models.Item{},
	); err != nil {
		logger.Error("Failed to run auto migration", zap.Error(err))
		return nil, fmt.Errorf("failed to run auto migration: %w", err)
	}

	// database seed all
	seeders.SeedAll(db)

	sqlDB.SetMaxOpenConns(cfg.MaxOpenCons)
	sqlDB.SetMaxIdleConns(cfg.MaxIdleCons)
	sqlDB.SetConnMaxLifetime(time.Duration(cfg.MaxLifeTime) * time.Minute)

	logger.Info("Database connected successfully",
		zap.String("host", cfg.Host),
		zap.String("name", cfg.Name),
	)

	return &Database{DB: db}, nil
}

func (d *Database) Close() error {
	if d.DB != nil {
		return nil
	}

	sqlDB, err := d.DB.DB()

	if err != nil {
		return fmt.Errorf("failed to get sql.DB: %w", err)
	}

	if err := sqlDB.Close(); err != nil && err != sql.ErrConnDone {
		return fmt.Errorf("failed to close DB connection: %w", err)
	}

	logger.Info("Database connection closed")

	return nil
}
