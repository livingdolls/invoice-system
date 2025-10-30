package mapper

import (
	"invoice-system/internal/applications/dto"
	"invoice-system/internal/domain"
)

func ToDomainCustomerCreate(req dto.CreateCustomerRequest) domain.Customer {
	return domain.Customer{
		Name:    req.Name,
		Email:   req.Email,
		Phone:   req.Phone,
		Address: req.Address,
	}
}

func ToDomainCustomerUpdate(req dto.UpdateCustomerRequest) domain.Customer {
	return domain.Customer{
		ID:      req.ID,
		Name:    req.Name,
		Email:   req.Email,
		Phone:   req.Phone,
		Address: req.Address,
	}
}

func ToCustomerResponse(d domain.Customer) dto.CustomerResponse {
	return dto.CustomerResponse{
		ID:      d.ID,
		Name:    d.Name,
		Email:   d.Email,
		Phone:   d.Phone,
		Address: d.Address,
	}
}

func ToCustomerResponseList(customer []domain.Customer) []dto.CustomerResponse {
	res := make([]dto.CustomerResponse, len(customer))
	for i, c := range customer {
		res[i] = ToCustomerResponse(c)
	}
	return res
}
