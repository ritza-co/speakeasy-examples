// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package operations

import (
	"mockserver/internal/sdk/models/components"
)

type GetOrderOrdersOrderIDGetRequest struct {
	OrderID int64 `pathParam:"style=simple,explode=false,name=order_id"`
}

func (o *GetOrderOrdersOrderIDGetRequest) GetOrderID() int64 {
	if o == nil {
		return 0
	}
	return o.OrderID
}

type GetOrderOrdersOrderIDGetResponse struct {
	HTTPMeta components.HTTPMetadata `json:"-"`
	// Successful Response
	CoffeeOrder *components.CoffeeOrder
}

func (o *GetOrderOrdersOrderIDGetResponse) GetHTTPMeta() components.HTTPMetadata {
	if o == nil {
		return components.HTTPMetadata{}
	}
	return o.HTTPMeta
}

func (o *GetOrderOrdersOrderIDGetResponse) GetCoffeeOrder() *components.CoffeeOrder {
	if o == nil {
		return nil
	}
	return o.CoffeeOrder
}
