package validate

type RoleInput struct {
	Name        string `form:"name" validate:"required,min=3,max=100"`
	Slug        string `form:"slug" validate:"required,alphanumdash,min=3,max=100"`
	Description string `form:"description" validate:"max=255"`
	Status      string `form:"status" validate:"omitempty,oneof=active inactive"`
}
