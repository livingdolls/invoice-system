package router

import (
	"invoice-system/internal/infra/adapter/http/handler"
	"invoice-system/internal/infra/adapter/http/response"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, customerHandler *handler.CustomerHandler, invoiceHandler *handler.InvoiceHandler) {
	api := r.Group("/api/v1")

	// Health check endpoint
	api.GET("/health", func(c *gin.Context) {
		response.OKResponse(c, "Service is healthy", gin.H{
			"status":  "OK",
			"service": "invoice-system",
		})
	})

	// Customer routes
	customers := api.Group("/customers")
	{
		customers.POST("", customerHandler.CreateCustomer)
		customers.GET("", customerHandler.GetAllCustomers)
	}

	// invoice routes
	invoices := api.Group("/invoices")
	{
		invoices.GET("", invoiceHandler.ListInvoices)
		invoices.POST("", invoiceHandler.CreateInvoice)
		invoices.GET("/:invoice_id", invoiceHandler.GetInvoiceDetails)
		invoices.PUT("/:invoice_id", invoiceHandler.UpdateInvoice)
	}
}
