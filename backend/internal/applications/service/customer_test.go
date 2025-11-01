package service

import (
	"errors"
	"testing"

	"invoice-system/internal/applications/dto"
	"invoice-system/internal/domain"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockCustomerRepository adalah mock untuk CustomerRepository
type MockCustomerRepository struct {
	mock.Mock
}

func (m *MockCustomerRepository) CreateCustomer(customer *domain.Customer) error {
	args := m.Called(customer)
	return args.Error(0)
}

func (m *MockCustomerRepository) FindCustomers() ([]domain.Customer, error) {
	args := m.Called()
	return args.Get(0).([]domain.Customer), args.Error(1)
}

func TestNewCustomerService(t *testing.T) {
	mockRepo := &MockCustomerRepository{}

	customerService := NewCustomerService(mockRepo)

	assert.NotNil(t, customerService)
}

func TestCustomerService_Create(t *testing.T) {
	tests := []struct {
		name        string
		request     dto.CreateCustomerRequest
		setupMock   func(*MockCustomerRepository)
		expectError bool
	}{
		{
			name: "successful customer creation",
			request: dto.CreateCustomerRequest{
				Name:    "John Doe",
				Email:   "john@example.com",
				Phone:   "123456789",
				Address: "123 Main St",
			},
			setupMock: func(m *MockCustomerRepository) {
				m.On("CreateCustomer", mock.AnythingOfType("*domain.Customer")).Return(nil)
			},
			expectError: false,
		},
		{
			name: "repository error during creation",
			request: dto.CreateCustomerRequest{
				Name:    "Jane Smith",
				Email:   "jane@example.com",
				Phone:   "987654321",
				Address: "456 Oak Ave",
			},
			setupMock: func(m *MockCustomerRepository) {
				m.On("CreateCustomer", mock.AnythingOfType("*domain.Customer")).Return(errors.New("email already exists"))
			},
			expectError: true,
		},
		{
			name: "empty name field",
			request: dto.CreateCustomerRequest{
				Name:    "",
				Email:   "empty@example.com",
				Phone:   "111111111",
				Address: "Empty Street",
			},
			setupMock: func(m *MockCustomerRepository) {
				m.On("CreateCustomer", mock.AnythingOfType("*domain.Customer")).Return(nil)
			},
			expectError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &MockCustomerRepository{}
			tt.setupMock(mockRepo)

			customerService := NewCustomerService(mockRepo)

			err := customerService.Create(tt.request)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestCustomerService_FindCustomers(t *testing.T) {
	tests := []struct {
		name        string
		setupMock   func(*MockCustomerRepository)
		expectError bool
		expectedLen int
	}{
		{
			name: "successful retrieval of all customers",
			setupMock: func(m *MockCustomerRepository) {
				customers := []domain.Customer{
					{ID: 1, Name: "John Doe", Email: "john@example.com", Phone: "123456789", Address: "123 Main St"},
					{ID: 2, Name: "Jane Smith", Email: "jane@example.com", Phone: "987654321", Address: "456 Oak Ave"},
				}
				m.On("FindCustomers").Return(customers, nil)
			},
			expectError: false,
			expectedLen: 2,
		},
		{
			name: "empty result set",
			setupMock: func(m *MockCustomerRepository) {
				m.On("FindCustomers").Return([]domain.Customer{}, nil)
			},
			expectError: false,
			expectedLen: 0,
		},
		{
			name: "repository error during retrieval",
			setupMock: func(m *MockCustomerRepository) {
				m.On("FindCustomers").Return([]domain.Customer{}, errors.New("database connection error"))
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &MockCustomerRepository{}
			tt.setupMock(mockRepo)

			customerService := NewCustomerService(mockRepo)

			customers, err := customerService.FindCustomers()

			if tt.expectError {
				assert.Error(t, err)
				assert.Nil(t, customers)
			} else {
				assert.NoError(t, err)
				assert.Len(t, customers, tt.expectedLen)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
