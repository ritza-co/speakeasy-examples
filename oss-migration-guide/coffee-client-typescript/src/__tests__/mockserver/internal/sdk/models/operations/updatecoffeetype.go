// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package operations

import (
	"mockserver/internal/sdk/models/components"
)

type UpdateCoffeeTypeRequest struct {
	// The ID of the coffee type to operate on
	TypeID     int64                 `pathParam:"style=simple,explode=false,name=type_id"`
	CoffeeType components.CoffeeType `request:"mediaType=application/json"`
}

func (o *UpdateCoffeeTypeRequest) GetTypeID() int64 {
	if o == nil {
		return 0
	}
	return o.TypeID
}

func (o *UpdateCoffeeTypeRequest) GetCoffeeType() components.CoffeeType {
	if o == nil {
		return components.CoffeeType{}
	}
	return o.CoffeeType
}

type UpdateCoffeeTypeResponse struct {
	HTTPMeta components.HTTPMetadata `json:"-"`
	// Successful Response
	CoffeeType *components.CoffeeType
}

func (o *UpdateCoffeeTypeResponse) GetHTTPMeta() components.HTTPMetadata {
	if o == nil {
		return components.HTTPMetadata{}
	}
	return o.HTTPMeta
}

func (o *UpdateCoffeeTypeResponse) GetCoffeeType() *components.CoffeeType {
	if o == nil {
		return nil
	}
	return o.CoffeeType
}
