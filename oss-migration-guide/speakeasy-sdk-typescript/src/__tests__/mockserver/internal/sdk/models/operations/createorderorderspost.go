// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package operations

import (
	"mockserver/internal/sdk/models/components"
)

type CreateOrderOrdersPostResponse struct {
	HTTPMeta components.HTTPMetadata `json:"-"`
	// Successful Response
	CoffeeOrder *components.CoffeeOrder
}

func (o *CreateOrderOrdersPostResponse) GetHTTPMeta() components.HTTPMetadata {
	if o == nil {
		return components.HTTPMetadata{}
	}
	return o.HTTPMeta
}

func (o *CreateOrderOrdersPostResponse) GetCoffeeOrder() *components.CoffeeOrder {
	if o == nil {
		return nil
	}
	return o.CoffeeOrder
}
