package handler

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/applications/mapper"
	"invoice-system/internal/applications/ports/services"
	"invoice-system/internal/infra/adapter/http/response"
	"invoice-system/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ItemHandler struct {
	service services.ItemService
}

func NewItemHandler(service services.ItemService) *ItemHandler {
	return &ItemHandler{service: service}
}

func (h *ItemHandler) GetItems(c *gin.Context) {

	var req dto.DTOItemRequest

	if nameOrType := c.Query("name_or_type"); nameOrType != "" {
		req.NameOrType = nameOrType
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if limit, err := strconv.ParseUint(limitStr, 10, 32); err == nil {
			req.Limit = uint(limit)
		}
	}

	items, err := h.service.GetAllItems(req.NameOrType, req.Limit)

	if err != nil {
		response.InternalServerErrorResponse(nil, err)
		return
	}

	response.OKResponse(c, "success getting items", mapper.ToDTOItemResponseList(items))
}

func (h *ItemHandler) CreateItem(c *gin.Context) {
	var req dto.DTOAddItemRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationErrorResponse(c, err)
		return
	}

	err := h.service.AddItem(req)

	if err != nil {
		if err == utils.ErrItemAlreadyExists {
			response.ConflictResponse(c, "item with the same name already exists", err)
			return
		}

		response.InternalServerErrorResponse(c, err)
		return
	}

	response.CreatedResponse(c, "item created successfully", nil)
}
