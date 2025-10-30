package dto

type InvoiceItemRequest struct {
	ItemID   uint    `json:"item_id" binding:"required"`
	Quantity int     `json:"quantity" binding:"required"`
	Price    float64 `json:"price" binding:"required"`
}

type InvoiceItemResponse struct {
	ID         uint    `json:"id"`
	ItemID     uint    `json:"item_id"`
	ItemName   string  `json:"item_name"`
	Type       string  `json:"type"`
	Quantity   int     `json:"quantity"`
	Price      float64 `json:"price"`
	TotalPrice float64 `json:"total_price"`
	CreatedAt  string  `json:"created_at"`
}
