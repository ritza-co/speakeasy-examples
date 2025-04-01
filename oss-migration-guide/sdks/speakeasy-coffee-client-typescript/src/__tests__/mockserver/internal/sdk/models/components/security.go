// Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.

package components

type Security struct {
	APIKeyAuth string `security:"scheme,type=apiKey,subtype=header,name=X-API-Key"`
}

func (o *Security) GetAPIKeyAuth() string {
	if o == nil {
		return ""
	}
	return o.APIKeyAuth
}
