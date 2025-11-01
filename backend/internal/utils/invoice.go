package utils

import (
	"fmt"
	"strconv"
)

func GenerateNextInvoiceCode(last string) string {
	if last == "" {
		return "001"
	}

	// Convert ke integer
	num, _ := strconv.Atoi(last)
	num++

	// Format kembali menjadi 3 digit
	return fmt.Sprintf("%03d", num)
}
