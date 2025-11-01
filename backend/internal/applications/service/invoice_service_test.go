package service

import (
	"errors"
	"testing"
	"time"

	"invoice-system/internal/applications/dto"
	"invoice-system/internal/domain"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockInvoiceRepo adalah mock untuk InvoiceRepository
type MockInvoiceRepo struct {
	mock.Mock
}

func (m *MockInvoiceRepo) GetAllInvoices(filters domain.InvoiceFilter) ([]domain.Invoice, domain.Pagination, error) {
	args := m.Called(filters)
	return args.Get(0).([]domain.Invoice), args.Get(1).(domain.Pagination), args.Error(2)
}

func (m *MockInvoiceRepo) CreateInvoice(invoice domain.Invoice) error {
	args := m.Called(invoice)
	return args.Error(0)
}

func (m *MockInvoiceRepo) GetInvoiceByID(id uint) (domain.Invoice, error) {
	args := m.Called(id)
	return args.Get(0).(domain.Invoice), args.Error(1)
}

func (m *MockInvoiceRepo) UpdateInvoice(id uint, invoice domain.Invoice) error {
	args := m.Called(id, invoice)
	return args.Error(0)
}

func TestNewInvoiceService(t *testing.T) {
	mockRepo := &MockInvoiceRepo{}

	invoiceService := NewInvoiceService(mockRepo)

	assert.NotNil(t, invoiceService)
}

func TestInvoiceService_CreateInvoice_Simple(t *testing.T) {
	testTime := time.Now()
	mockRepo := &MockInvoiceRepo{}

	// Simple test tanpa validasi calculation yang kompleks
	mockRepo.On("CreateInvoice", mock.AnythingOfType("domain.Invoice")).Return(nil)

	invoiceService := NewInvoiceService(mockRepo)

	request := dto.CreateInvoiceRequest{
		IssueDate:  testTime,
		DueDate:    testTime.AddDate(0, 0, 30),
		Subject:    "Simple Test",
		CustomerID: 1,
		Status:     "pending",
		Items: []dto.CreateInvoiceItemRequest{
			{
				ItemID:   1,
				Quantity: 1,
				Price:    100.0,
			},
		},
	}

	err := invoiceService.CreateInvoice(request)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestInvoiceService_GetInvoiceByID(t *testing.T) {
	tests := []struct {
		name        string
		id          uint
		setupMock   func(*MockInvoiceRepo)
		expectError bool
		expectedID  uint
	}{
		{
			name: "successful retrieval by ID",
			id:   1,
			setupMock: func(m *MockInvoiceRepo) {
				invoice := domain.Invoice{
					ID:            1,
					InvoiceNumber: "INV-001",
					Subject:       "Test Invoice",
					Status:        "pending",
					CustomerID:    1,
					Subtotal:      100.0,
					Tax:           10.0,
					TotalAmount:   110.0,
				}
				m.On("GetInvoiceByID", uint(1)).Return(invoice, nil)
			},
			expectError: false,
			expectedID:  1,
		},
		{
			name: "invoice not found",
			id:   999,
			setupMock: func(m *MockInvoiceRepo) {
				m.On("GetInvoiceByID", uint(999)).Return(domain.Invoice{}, errors.New("invoice not found"))
			},
			expectError: true,
		},
		{
			name: "repository error during retrieval",
			id:   1,
			setupMock: func(m *MockInvoiceRepo) {
				m.On("GetInvoiceByID", uint(1)).Return(domain.Invoice{}, errors.New("database connection error"))
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &MockInvoiceRepo{}
			tt.setupMock(mockRepo)

			invoiceService := NewInvoiceService(mockRepo)

			result, err := invoiceService.GetInvoiceByID(tt.id)

			if tt.expectError {
				assert.Error(t, err)
				assert.Empty(t, result)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expectedID, result.ID)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestInvoiceService_UpdateInvoice(t *testing.T) {
	testTime := time.Now()

	tests := []struct {
		name        string
		id          uint
		request     dto.UpdateInvoiceRequest
		setupMock   func(*MockInvoiceRepo)
		expectError bool
	}{
		{
			name: "successful invoice update",
			id:   1,
			request: dto.UpdateInvoiceRequest{
				IssueDate:  testTime,
				DueDate:    testTime.AddDate(0, 0, 30),
				Subject:    "Updated Invoice",
				CustomerID: 1,
				Status:     "paid",
				Items: []dto.InvoiceItemInput{
					{
						ItemID:   1,
						Quantity: 3,
						Price:    150.0,
					},
				},
			},
			setupMock: func(m *MockInvoiceRepo) {
				// Expected calculations:
				// Item 1: 3 * 150.0 = 450.0
				// Subtotal: 450.0
				// Tax (10%): 45.0
				// Total: 495.0
				m.On("UpdateInvoice", uint(1), mock.MatchedBy(func(invoice domain.Invoice) bool {
					return invoice.Subject == "Updated Invoice" &&
						invoice.Status == "paid" &&
						invoice.Subtotal == 450.0 &&
						invoice.Tax == 45.0 &&
						invoice.TotalAmount == 495.0
				})).Return(nil)
			},
			expectError: false,
		},
		{
			name: "invoice not found during update",
			id:   999,
			request: dto.UpdateInvoiceRequest{
				IssueDate:  testTime,
				DueDate:    testTime.AddDate(0, 0, 30),
				Subject:    "Non-existent Invoice",
				CustomerID: 1,
				Status:     "pending",
				Items: []dto.InvoiceItemInput{
					{
						ItemID:   1,
						Quantity: 1,
						Price:    100.0,
					},
				},
			},
			setupMock: func(m *MockInvoiceRepo) {
				m.On("UpdateInvoice", uint(999), mock.AnythingOfType("domain.Invoice")).Return(errors.New("invoice not found"))
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &MockInvoiceRepo{}
			tt.setupMock(mockRepo)

			invoiceService := NewInvoiceService(mockRepo)

			err := invoiceService.UpdateInvoice(tt.id, tt.request)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestInvoiceService_GetAllInvoices(t *testing.T) {
	tests := []struct {
		name        string
		filters     dto.GetInvoiceFilterRequest
		setupMock   func(*MockInvoiceRepo)
		expectError bool
		expectedLen int
	}{
		{
			name: "successful retrieval with basic filters",
			filters: dto.GetInvoiceFilterRequest{
				Page:  1,
				Limit: 10,
			},
			setupMock: func(m *MockInvoiceRepo) {
				invoices := []domain.Invoice{
					{
						ID:            1,
						InvoiceNumber: "INV-001",
						Subject:       "Test Invoice 1",
						Status:        "pending",
					},
					{
						ID:            2,
						InvoiceNumber: "INV-002",
						Subject:       "Test Invoice 2",
						Status:        "paid",
					},
				}
				pagination := domain.Pagination{
					TotalItems:  2,
					TotalPages:  1,
					CurrentPage: 1,
					Limit:       10,
				}
				m.On("GetAllInvoices", mock.AnythingOfType("domain.InvoiceFilter")).Return(invoices, pagination, nil)
			},
			expectError: false,
			expectedLen: 2,
		},
		{
			name: "repository error during retrieval",
			filters: dto.GetInvoiceFilterRequest{
				Page:  1,
				Limit: 10,
			},
			setupMock: func(m *MockInvoiceRepo) {
				m.On("GetAllInvoices", mock.AnythingOfType("domain.InvoiceFilter")).Return([]domain.Invoice{}, domain.Pagination{}, errors.New("database connection error"))
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &MockInvoiceRepo{}
			tt.setupMock(mockRepo)

			invoiceService := NewInvoiceService(mockRepo)

			result, err := invoiceService.GetAllInvoices(tt.filters)

			if tt.expectError {
				assert.Error(t, err)
				assert.Empty(t, result.Invoices)
			} else {
				assert.NoError(t, err)
				assert.Len(t, result.Invoices, tt.expectedLen)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
