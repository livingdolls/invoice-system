package dto

type CreateCustomerRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Phone   string `json:"phone" binding:"required"`
	Address string `json:"address" binding:"required"`
}

type UpdateCustomerRequest struct {
	ID      uint   `json:"id" binding:"required"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
}

type CustomerResponse struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
}
