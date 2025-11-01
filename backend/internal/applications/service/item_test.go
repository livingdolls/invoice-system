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

// MockItemRepository adalah mock untuk ItemRepository
type MockItemRepository struct {
	mock.Mock
}

func (m *MockItemRepository) GetAllItems(nameOrType string, limit uint) ([]domain.Item, error) {
	args := m.Called(nameOrType, limit)
	return args.Get(0).([]domain.Item), args.Error(1)
}

func (m *MockItemRepository) AddItem(item domain.Item) error {
	args := m.Called(item)
	return args.Error(0)
}

func TestNewItemService(t *testing.T) {
	mockRepo := &MockItemRepository{}

	itemService := NewItemService(mockRepo)

	assert.NotNil(t, itemService)
}

func TestItemService_GetAllItems(t *testing.T) {
	tests := []struct {
		name        string
		nameOrType  string
		limit       uint
		setupMock   func(*MockItemRepository)
		expectError bool
		expectedLen int
	}{
		{
			name:       "successful retrieval of all items",
			nameOrType: "",
			limit:      10,
			setupMock: func(m *MockItemRepository) {
				items := []domain.Item{
					{
						ID:        1,
						Name:      "Laptop",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					{
						ID:        2,
						Name:      "Mouse",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
				}
				m.On("GetAllItems", "", uint(10)).Return(items, nil)
			},
			expectError: false,
			expectedLen: 2,
		},
		{
			name:       "filter by name",
			nameOrType: "Laptop",
			limit:      5,
			setupMock: func(m *MockItemRepository) {
				items := []domain.Item{
					{
						ID:        1,
						Name:      "Laptop",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
				}
				m.On("GetAllItems", "Laptop", uint(5)).Return(items, nil)
			},
			expectError: false,
			expectedLen: 1,
		},
		{
			name:       "filter by type",
			nameOrType: "Electronics",
			limit:      10,
			setupMock: func(m *MockItemRepository) {
				items := []domain.Item{
					{
						ID:        1,
						Name:      "Laptop",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					{
						ID:        2,
						Name:      "Mouse",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					{
						ID:        3,
						Name:      "Keyboard",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
				}
				m.On("GetAllItems", "Electronics", uint(10)).Return(items, nil)
			},
			expectError: false,
			expectedLen: 3,
		},
		{
			name:       "empty result set",
			nameOrType: "NonExistentItem",
			limit:      10,
			setupMock: func(m *MockItemRepository) {
				m.On("GetAllItems", "NonExistentItem", uint(10)).Return([]domain.Item{}, nil)
			},
			expectError: false,
			expectedLen: 0,
		},
		{
			name:       "repository error during retrieval",
			nameOrType: "",
			limit:      10,
			setupMock: func(m *MockItemRepository) {
				m.On("GetAllItems", "", uint(10)).Return([]domain.Item{}, errors.New("database connection error"))
			},
			expectError: true,
			expectedLen: 0,
		},
		{
			name:       "with limit constraint",
			nameOrType: "",
			limit:      1,
			setupMock: func(m *MockItemRepository) {
				items := []domain.Item{
					{
						ID:        1,
						Name:      "Laptop",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
				}
				m.On("GetAllItems", "", uint(1)).Return(items, nil)
			},
			expectError: false,
			expectedLen: 1,
		},
		{
			name:       "inactive items included",
			nameOrType: "",
			limit:      10,
			setupMock: func(m *MockItemRepository) {
				items := []domain.Item{
					{
						ID:        1,
						Name:      "Active Item",
						Type:      "Electronics",
						IsActive:  true,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					{
						ID:        2,
						Name:      "Inactive Item",
						Type:      "Electronics",
						IsActive:  false,
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
				}
				m.On("GetAllItems", "", uint(10)).Return(items, nil)
			},
			expectError: false,
			expectedLen: 2,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &MockItemRepository{}
			tt.setupMock(mockRepo)

			itemService := NewItemService(mockRepo)

			items, err := itemService.GetAllItems(tt.nameOrType, tt.limit)

			if tt.expectError {
				assert.Error(t, err)
				assert.Empty(t, items)
			} else {
				assert.NoError(t, err)
				assert.Len(t, items, tt.expectedLen)

				// Verify items contain expected fields
				for _, item := range items {
					assert.NotZero(t, item.ID)
					assert.NotEmpty(t, item.Name)
					assert.NotEmpty(t, item.Type)
					assert.NotZero(t, item.CreatedAt)
					assert.NotZero(t, item.UpdatedAt)
				}
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestItemService_AddItem(t *testing.T) {
	tests := []struct {
		name        string
		request     dto.DTOAddItemRequest
		setupMock   func(*MockItemRepository)
		expectError bool
		errorMsg    string
	}{
		{
			name: "successful item creation",
			request: dto.DTOAddItemRequest{
				Name: "Gaming Laptop",
				Type: "Electronics",
			},
			setupMock: func(m *MockItemRepository) {
				m.On("AddItem", mock.MatchedBy(func(item domain.Item) bool {
					return item.Name == "Gaming Laptop" &&
						item.Type == "Electronics"
				})).Return(nil)
			},
			expectError: false,
		},
		{
			name: "successful creation with special characters",
			request: dto.DTOAddItemRequest{
				Name: "HP Laptop & Mouse Set",
				Type: "Electronics/Accessories",
			},
			setupMock: func(m *MockItemRepository) {
				m.On("AddItem", mock.MatchedBy(func(item domain.Item) bool {
					return item.Name == "HP Laptop & Mouse Set" &&
						item.Type == "Electronics/Accessories"
				})).Return(nil)
			},
			expectError: false,
		},
		{
			name: "repository error - duplicate name",
			request: dto.DTOAddItemRequest{
				Name: "Duplicate Item",
				Type: "Test",
			},
			setupMock: func(m *MockItemRepository) {
				m.On("AddItem", mock.AnythingOfType("domain.Item")).Return(errors.New("duplicate key value violates unique constraint"))
			},
			expectError: true,
			errorMsg:    "duplicate key",
		},
		{
			name: "repository error - database connection",
			request: dto.DTOAddItemRequest{
				Name: "Connection Error Item",
				Type: "Test",
			},
			setupMock: func(m *MockItemRepository) {
				m.On("AddItem", mock.AnythingOfType("domain.Item")).Return(errors.New("database connection failed"))
			},
			expectError: true,
			errorMsg:    "database connection",
		},
		{
			name: "empty name field",
			request: dto.DTOAddItemRequest{
				Name: "",
				Type: "EmptyName",
			},
			setupMock: func(m *MockItemRepository) {
				m.On("AddItem", mock.MatchedBy(func(item domain.Item) bool {
					return item.Name == "" && item.Type == "EmptyName"
				})).Return(nil)
			},
			expectError: false,
		},
		{
			name: "empty type field",
			request: dto.DTOAddItemRequest{
				Name: "No Type Item",
				Type: "",
			},
			setupMock: func(m *MockItemRepository) {
				m.On("AddItem", mock.MatchedBy(func(item domain.Item) bool {
					return item.Name == "No Type Item" && item.Type == ""
				})).Return(nil)
			},
			expectError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := &MockItemRepository{}
			tt.setupMock(mockRepo)

			itemService := NewItemService(mockRepo)

			err := itemService.AddItem(tt.request)

			if tt.expectError {
				assert.Error(t, err)
				if tt.errorMsg != "" {
					assert.Contains(t, err.Error(), tt.errorMsg)
				}
			} else {
				assert.NoError(t, err)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

// Test untuk verifikasi bahwa domain.Item dibuat dengan benar
func TestItemService_AddItem_DomainMapping(t *testing.T) {
	mockRepo := &MockItemRepository{}

	request := dto.DTOAddItemRequest{
		Name: "Test Item",
		Type: "Test Type",
	}

	// Capture the domain.Item that was passed to repository
	var capturedItem domain.Item
	mockRepo.On("AddItem", mock.AnythingOfType("domain.Item")).Run(func(args mock.Arguments) {
		capturedItem = args.Get(0).(domain.Item)
	}).Return(nil)

	itemService := NewItemService(mockRepo)
	err := itemService.AddItem(request)

	assert.NoError(t, err)
	assert.Equal(t, request.Name, capturedItem.Name)
	assert.Equal(t, request.Type, capturedItem.Type)
	assert.False(t, capturedItem.IsActive) // Default value is false, not set by mapper
	assert.Zero(t, capturedItem.ID)        // ID should be zero for new items
	assert.Zero(t, capturedItem.CreatedAt) // Should be zero since not set in service
	assert.Zero(t, capturedItem.UpdatedAt) // Should be zero since not set in service

	mockRepo.AssertExpectations(t)
}

// Test untuk edge cases
func TestItemService_EdgeCases(t *testing.T) {
	t.Run("GetAllItems with zero limit", func(t *testing.T) {
		mockRepo := &MockItemRepository{}
		mockRepo.On("GetAllItems", "", uint(0)).Return([]domain.Item{}, nil)

		itemService := NewItemService(mockRepo)
		items, err := itemService.GetAllItems("", 0)

		assert.NoError(t, err)
		assert.Empty(t, items)
		mockRepo.AssertExpectations(t)
	})

	t.Run("GetAllItems with very long name filter", func(t *testing.T) {
		longName := "Very Long Item Name That Exceeds Normal Length Limits And Tests Edge Case Handling"
		mockRepo := &MockItemRepository{}
		mockRepo.On("GetAllItems", longName, uint(10)).Return([]domain.Item{}, nil)

		itemService := NewItemService(mockRepo)
		items, err := itemService.GetAllItems(longName, 10)

		assert.NoError(t, err)
		assert.Empty(t, items)
		mockRepo.AssertExpectations(t)
	})
}
