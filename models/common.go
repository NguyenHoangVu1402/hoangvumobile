package models

type APIResponse struct {
	Success bool        `json:"success"`
	Message string `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type ValidateError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}