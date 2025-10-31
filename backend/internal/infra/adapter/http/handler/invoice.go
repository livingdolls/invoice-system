package handler

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/applications/ports/services"
	"invoice-system/internal/infra/adapter/http/response"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type InvoiceHandler struct {
	service services.InvoiceService
}

func NewInvoiceHandler(service services.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{service: service}
}

func (h *InvoiceHandler) ListInvoices(c *gin.Context) {
	var req dto.GetInvoiceFilterRequest

	if invoiceID := c.Query("invoice_id"); invoiceID != "" {
		req.InvoiceID = &invoiceID
	}

	if issueDate := c.Query("issue_date"); issueDate != "" {
		if t, err := time.Parse(time.RFC3339, issueDate); err == nil {
			req.IssueDate = &t
		}
	}

	if subject := c.Query("subject"); subject != "" {
		req.Subject = &subject
	}

	req.CustomerName = c.Query("customer_name")

	if dueDate := c.Query("due_date"); dueDate != "" {
		if t, err := time.Parse(time.RFC3339, dueDate); err == nil {
			req.DueDate = &t
		}
	}

	req.Status = c.Query("status")

	if cursor := c.Query("cursor"); cursor != "" {
		if t, err := time.Parse(time.RFC3339, cursor); err == nil {
			req.Cursor = &t
		}
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil {
			req.Limit = limit
		}
	}

	if pageStr := c.Query("page"); pageStr != "" {
		if page, err := strconv.Atoi(pageStr); err == nil {
			req.Page = page
		}
	}

	resp, err := h.service.GetAllInvoices(req)

	if err != nil {
		response.InternalServerErrorResponse(c, err)
		return
	}

	response.OKResponse(c, "successfully get invoices data", resp)
}

func (h *InvoiceHandler) CreateInvoice(c *gin.Context) {
	var req dto.CreateInvoiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationErrorResponse(c, err)
		return
	}

	err := h.service.CreateInvoice(req)
	if err != nil {
		response.InternalServerErrorResponse(c, err)
		return
	}

	response.CreatedResponse(c, "Invoice created successfully", nil)
}

func (h *InvoiceHandler) GetInvoiceDetails(c *gin.Context) {
	invoiceID := c.Param("invoice_id")

	invId, err := strconv.Atoi(invoiceID)
	if err != nil {
		response.ValidationErrorResponse(c, err)
		return
	}

	resp, err := h.service.GetInvoiceByID(uint(invId))
	if err != nil {
		response.InternalServerErrorResponse(c, err)
		return
	}

	response.OKResponse(c, "successfully get invoice details", resp)
}

func (h *InvoiceHandler) UpdateInvoice(c *gin.Context) {
	invoiceID := c.Param("invoice_id")

	id, err := strconv.Atoi(invoiceID)
	if err != nil {
		response.ValidationErrorResponse(c, err)
		return
	}

	var req dto.UpdateInvoiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationErrorResponse(c, err)
		return
	}

	err = h.service.UpdateInvoice(uint(id), req)

	if err != nil {
		response.InternalServerErrorResponse(c, err)
		return
	}

	response.OKResponse(c, "Invoice updated successfully", nil)
}
