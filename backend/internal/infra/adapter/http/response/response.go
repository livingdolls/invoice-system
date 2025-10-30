package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIResponse represents the standard API response structure
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorData  `json:"error,omitempty"`
}

// ErrorData represents error information
type ErrorData struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

// SuccessResponse sends a success response
func SuccessResponse(c *gin.Context, statusCode int, message string, data interface{}) {
	response := APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
	c.JSON(statusCode, response)
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, statusCode int, code string, message string, details ...string) {
	errorData := &ErrorData{
		Code:    code,
		Message: message,
	}

	if len(details) > 0 {
		errorData.Details = details[0]
	}

	response := APIResponse{
		Success: false,
		Message: "Request failed",
		Error:   errorData,
	}
	c.JSON(statusCode, response)
}

// ValidationErrorResponse sends validation error response
func ValidationErrorResponse(c *gin.Context, err error) {
	ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request data", err.Error())
}

// InternalServerErrorResponse sends internal server error response
func InternalServerErrorResponse(c *gin.Context, err error) {
	ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Internal server error", err.Error())
}

// NotFoundResponse sends not found error response
func NotFoundResponse(c *gin.Context, resource string) {
	ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", resource+" not found")
}

// UnauthorizedResponse sends unauthorized error response
func UnauthorizedResponse(c *gin.Context) {
	ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", "Access denied")
}

// ForbiddenResponse sends forbidden error response
func ForbiddenResponse(c *gin.Context) {
	ErrorResponse(c, http.StatusForbidden, "FORBIDDEN", "Insufficient permissions")
}

// CreatedResponse sends created success response
func CreatedResponse(c *gin.Context, message string, data interface{}) {
	SuccessResponse(c, http.StatusCreated, message, data)
}

// OKResponse sends OK success response
func OKResponse(c *gin.Context, message string, data interface{}) {
	SuccessResponse(c, http.StatusOK, message, data)
}

// NoContentResponse sends no content response
func NoContentResponse(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
