package utils

import (
	"errors"
	"strings"

	"github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

func IsDuplicateKeyError(err error) bool {
	if err == nil {
		return false
	}

	// MySQL duplicate key
	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		return mysqlErr.Number == 1062
	}

	// SQLite duplicate key
	if strings.Contains(err.Error(), "UNIQUE constraint failed") {
		return true
	}

	return false
}

func IsNotFound(err error) bool {
	// GORM: record not found
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return true
	}

	// MySQL error code 1146 = table doesn't exist
	// bisa dianggap "not found" untuk operation tertentu
	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		// optional: cek error lain bila diperlukan
		// tetapi record not found biasanya sudah ketangkap gorm.ErrRecordNotFound
	}

	return false
}
