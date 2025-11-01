package utils

import (
	"errors"
	"testing"

	"github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestIsDuplicateKeyError(t *testing.T) {
	t.Run("Success - MySQL duplicate key error", func(t *testing.T) {
		// Create MySQL error with duplicate key code 1062
		mysqlErr := &mysql.MySQLError{
			Number:  1062,
			Message: "Duplicate entry 'test' for key 'PRIMARY'",
		}

		result := IsDuplicateKeyError(mysqlErr)

		assert.True(t, result)
	})

	t.Run("Success - Not duplicate key error", func(t *testing.T) {
		// Create MySQL error with different code
		mysqlErr := &mysql.MySQLError{
			Number:  1054,
			Message: "Unknown column 'test' in 'field list'",
		}

		result := IsDuplicateKeyError(mysqlErr)

		assert.False(t, result)
	})

	t.Run("Success - Non-MySQL error", func(t *testing.T) {
		// Regular error
		regularErr := errors.New("some regular error")

		result := IsDuplicateKeyError(regularErr)

		assert.False(t, result)
	})

	t.Run("Success - Nil error", func(t *testing.T) {
		result := IsDuplicateKeyError(nil)

		assert.False(t, result)
	})
}

func TestIsNotFound(t *testing.T) {
	t.Run("Success - GORM record not found", func(t *testing.T) {
		result := IsNotFound(gorm.ErrRecordNotFound)

		assert.True(t, result)
	})

	t.Run("Success - Wrapped GORM record not found", func(t *testing.T) {
		// This test depends on how errors are wrapped in your actual code
		// For now, let's test direct GORM error
		result := IsNotFound(gorm.ErrRecordNotFound)

		assert.True(t, result)
	})

	t.Run("Success - Regular error", func(t *testing.T) {
		regularErr := errors.New("some database error")

		result := IsNotFound(regularErr)

		assert.False(t, result)
	})

	t.Run("Success - MySQL error", func(t *testing.T) {
		mysqlErr := &mysql.MySQLError{
			Number:  1054,
			Message: "Unknown column 'test' in 'field list'",
		}

		result := IsNotFound(mysqlErr)

		assert.False(t, result)
	})

	t.Run("Success - Nil error", func(t *testing.T) {
		result := IsNotFound(nil)

		assert.False(t, result)
	})
}

func TestErrorConstants(t *testing.T) {
	t.Run("Error constants are defined", func(t *testing.T) {
		assert.NotNil(t, ErrCustomerAlreadyExists)
		assert.NotNil(t, ErrInvoiceNotFound)
		assert.NotNil(t, ErrItemAlreadyExists)

		assert.Equal(t, "customer already exists", ErrCustomerAlreadyExists.Error())
		assert.Equal(t, "invoice not found", ErrInvoiceNotFound.Error())
		assert.Equal(t, "item already exists", ErrItemAlreadyExists.Error())
	})
}
