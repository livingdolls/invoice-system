package dto

type DTOItemResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Type     string `json:"type"`
	IsActive bool   `json:"is_active"`
}

type DTOItemRequest struct {
	NameOrType string `form:"name_or_type"`
}
