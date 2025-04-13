package validate

import (
	"github.com/go-playground/validator/v10"
)

var Validate = validator.New()

func init() {
	// Tạo alias alphanumdash nếu bạn muốn cho phép a-zA-Z0-9 và dấu gạch ngang (-)
	Validate.RegisterAlias("alphanumdash", "alphanum|contains=-")
}
