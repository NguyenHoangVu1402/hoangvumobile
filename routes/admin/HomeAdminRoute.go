package admin

import (
	"github.com/gin-gonic/gin"
	"hoangvumobile/config"
)

func HomeAdminRoute(router *gin.Engine) {
	router.GET("/admin/dashboard", func(c *gin.Context){
		config.RenderTemplateAdmin(c, "home", "Trang quản trị hoangvumobile", true)
	})
}