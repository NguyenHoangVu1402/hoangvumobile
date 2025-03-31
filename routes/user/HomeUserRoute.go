package user

import (
	"github.com/gin-gonic/gin"
	"hoangvumobile/config"
)

func HomeUserRoute(router *gin.Engine) {
	router.GET("/", func(c *gin.Context){
		config.RenderTemplateUser1(c, "home", "Trang chủ hoangvumobile", true, true)
	})
}
