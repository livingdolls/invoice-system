package mapper

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/domain"
)

// Domain -> DTO
func ToDTOItemResponse(d domain.Item) dto.DTOItemResponse {
	return dto.DTOItemResponse{
		ID:       d.ID,
		Name:     d.Name,
		Type:     d.Type,
		IsActive: d.IsActive,
	}
}

// Domain List -> DTO List
func ToDTOItemResponseList(items []domain.Item) []dto.DTOItemResponse {
	res := make([]dto.DTOItemResponse, len(items))
	for i, item := range items {
		res[i] = ToDTOItemResponse(item)
	}
	return res
}

// DTO -> Domain
func ToDomainAddItemRequest(req dto.DTOAddItemRequest) domain.Item {
	return domain.Item{
		Name: req.Name,
		Type: req.Type,
	}
}
