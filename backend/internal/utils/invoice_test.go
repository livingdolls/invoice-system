package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGenerateNextInvoiceCode(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "empty string should return 001",
			input:    "",
			expected: "001",
		},
		{
			name:     "single digit number",
			input:    "5",
			expected: "006",
		},
		{
			name:     "double digit number",
			input:    "25",
			expected: "026",
		},
		{
			name:     "triple digit number",
			input:    "100",
			expected: "101",
		},
		{
			name:     "zero input",
			input:    "0",
			expected: "001",
		},
		{
			name:     "sequential from 001",
			input:    "001",
			expected: "002",
		},
		{
			name:     "sequential from 009",
			input:    "009",
			expected: "010",
		},
		{
			name:     "sequential from 099",
			input:    "099",
			expected: "100",
		},
		{
			name:     "sequential from 999",
			input:    "999",
			expected: "1000",
		},
		{
			name:     "leading zeros should be handled",
			input:    "007",
			expected: "008",
		},
		{
			name:     "large number",
			input:    "12345",
			expected: "12346",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenerateNextInvoiceCode(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestGenerateNextInvoiceCodeWithInvalidInput(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "non-numeric string should default to 001",
			input:    "abc",
			expected: "001",
		},
		{
			name:     "alphanumeric string should default to 001",
			input:    "abc123",
			expected: "001",
		},
		{
			name:     "special characters should default to 001",
			input:    "!@#$%",
			expected: "001",
		},
		{
			name:     "mixed invalid input should default to 001",
			input:    "12abc34",
			expected: "001",
		},
		{
			name:     "whitespace should default to 001",
			input:    "   ",
			expected: "001",
		},
		{
			name:     "negative number string will be processed as is",
			input:    "-5",
			expected: "-04", // strconv.Atoi("-5") = -5, -5 + 1 = -4, fmt.Sprintf("%03d", -4) = "-04"
		},
		{
			name:     "decimal number string should default to 001",
			input:    "12.5",
			expected: "001",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenerateNextInvoiceCode(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestGenerateNextInvoiceCodeFormatting(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		description string
	}{
		{
			name:        "single digit result should be zero-padded to 3 digits",
			input:       "4",
			description: "005 should have leading zeros",
		},
		{
			name:        "double digit result should be zero-padded to 3 digits",
			input:       "23",
			description: "024 should have leading zero",
		},
		{
			name:        "triple digit result should maintain 3 digits",
			input:       "123",
			description: "124 should remain 3 digits",
		},
		{
			name:        "4+ digit result should not be truncated",
			input:       "9999",
			description: "10000 should not be truncated to 3 digits",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenerateNextInvoiceCode(tt.input)

			// Verify the result is properly formatted
			switch tt.input {
			case "4":
				assert.Equal(t, "005", result)
				assert.Len(t, result, 3)
			case "23":
				assert.Equal(t, "024", result)
				assert.Len(t, result, 3)
			case "123":
				assert.Equal(t, "124", result)
				assert.Len(t, result, 3)
			case "9999":
				assert.Equal(t, "10000", result)
				assert.Len(t, result, 5)
			}
		})
	}
}

func TestGenerateNextInvoiceCodeSequential(t *testing.T) {
	// Test sequential generation
	var current string

	// Start from empty (should get 001)
	current = GenerateNextInvoiceCode("")
	assert.Equal(t, "001", current)

	// Generate next 10 codes sequentially
	expectedSequence := []string{"002", "003", "004", "005", "006", "007", "008", "009", "010", "011"}

	for i, expected := range expectedSequence {
		current = GenerateNextInvoiceCode(current)
		assert.Equal(t, expected, current, "Iteration %d failed", i+1)
	}
}

func TestGenerateNextInvoiceCodeBoundaryValues(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		expected    string
		description string
	}{
		{
			name:        "boundary at 9",
			input:       "9",
			expected:    "010",
			description: "single digit 9 should increment to 010",
		},
		{
			name:        "boundary at 99",
			input:       "99",
			expected:    "100",
			description: "double digit 99 should increment to 100",
		},
		{
			name:        "boundary at 999",
			input:       "999",
			expected:    "1000",
			description: "triple digit 999 should increment to 1000",
		},
		{
			name:        "very large number",
			input:       "999999",
			expected:    "1000000",
			description: "large numbers should increment normally",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenerateNextInvoiceCode(tt.input)
			assert.Equal(t, tt.expected, result, tt.description)
		})
	}
}

func TestGenerateNextInvoiceCodeEdgeCases(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "input with leading zeros",
			input:    "000",
			expected: "001",
		},
		{
			name:     "input with multiple leading zeros",
			input:    "0000",
			expected: "001",
		},
		{
			name:     "input with leading zeros and number",
			input:    "0042",
			expected: "043",
		},
		{
			name:     "maximum safe integer boundary (near)",
			input:    "2147483646", // Max int32 - 1
			expected: "2147483647",
		},
		{
			name:     "negative number increments from negative value",
			input:    "-10",
			expected: "-09", // -10 + 1 = -9, fmt.Sprintf("%03d", -9) = "-09"
		},
		{
			name:     "negative zero",
			input:    "-0",
			expected: "001", // -0 + 1 = 1, fmt.Sprintf("%03d", 1) = "001"
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenerateNextInvoiceCode(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

// Benchmark tests to ensure performance is acceptable
func BenchmarkGenerateNextInvoiceCode(b *testing.B) {
	for i := 0; i < b.N; i++ {
		GenerateNextInvoiceCode("123")
	}
}

func BenchmarkGenerateNextInvoiceCodeEmpty(b *testing.B) {
	for i := 0; i < b.N; i++ {
		GenerateNextInvoiceCode("")
	}
}

func BenchmarkGenerateNextInvoiceCodeLargeNumber(b *testing.B) {
	for i := 0; i < b.N; i++ {
		GenerateNextInvoiceCode("999999999")
	}
}

func BenchmarkGenerateNextInvoiceCodeInvalid(b *testing.B) {
	for i := 0; i < b.N; i++ {
		GenerateNextInvoiceCode("invalid_input")
	}
}
