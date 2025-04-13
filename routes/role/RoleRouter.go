package role

import (
	"hoangvumobile/config"
	"hoangvumobile/controllers/api/role"

	"github.com/gin-gonic/gin"
)

func RoleRouter(router *gin.Engine) {
	// Trang quản trị
	router.GET("/admin/role", func(c *gin.Context) {
		config.RenderTemplateAdmin(c, "role", "Trang quản trị vai trò VuMobile", true)
	})

	// API endpoints
	api := router.Group("/admin/api")
	{
		api.GET("/role", role.GetAllRole)
		api.POST("/role", role.CreateRole)
		api.GET("/role/:id", role.ShowRole)
		api.PUT("/role/:id", role.UpdateRole)
		api.DELETE("/role/:id", role.DeleteRole)
	}
}