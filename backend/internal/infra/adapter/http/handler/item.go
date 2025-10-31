package handler

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/applications/mapper"
	"invoice-system/internal/applications/ports/services"
	"invoice-system/internal/infra/adapter/http/response"

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

	items, err := h.service.GetAllItems(req.NameOrType)

	if err != nil {
		response.InternalServerErrorResponse(nil, err)
		return
	}

	response.OKResponse(c, "success getting items", mapper.ToDTOItemResponseList(items))
}
