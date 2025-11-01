package dto

type DTOItemResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Type     string `json:"type"`
	IsActive bool   `json:"is_active"`
}

type DTOItemRequest struct {
	NameOrType string `form:"name_or_type"`
	Limit      uint   `form:"limit"`
}

type DTOAddItemRequest struct {
	Name string `json:"name" binding:"required"`
	Type string `json:"type" binding:"required"`
}
