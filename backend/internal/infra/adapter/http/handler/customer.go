package handler

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/applications/ports/services"
	"invoice-system/internal/infra/adapter/http/response"
	"invoice-system/internal/utils"

	"github.com/gin-gonic/gin"
)

type CustomerHandler struct {
	service services.CustomerService
}

func NewCustomerHandler(service services.CustomerService) *CustomerHandler {
	return &CustomerHandler{service: service}
}

func (h *CustomerHandler) CreateCustomer(c *gin.Context) {
	var req dto.CreateCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationErrorResponse(c, err)
		return
	}

	err := h.service.Create(req)
	if err != nil {
		if err == utils.ErrCustomerAlreadyExists {
			response.ConflictResponse(c, "Customer already exists", nil)
			return
		}

		response.InternalServerErrorResponse(c, err)
		return
	}

	response.CreatedResponse(c, "Customer created successfully", nil)
}

// GetAllCustomers retrieves all customers
func (h *CustomerHandler) GetAllCustomers(c *gin.Context) {
	customers, err := h.service.FindCustomers()
	if err != nil {
		response.InternalServerErrorResponse(c, err)
		return
	}

	response.OKResponse(c, "Customers retrieved successfully", customers)
}
