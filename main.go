package main

import (
	"hoangvumobile/database"
	"hoangvumobile/routes/admin"
	"hoangvumobile/routes/authen"
	"hoangvumobile/routes/role"
	"hoangvumobile/routes/user"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Kết nối với cơ sở dữ liệu
	database.ConnectDB()

	// Tự động migrate schema
	database.AutoMigrateTables()

	// Khởi tạo router Gin
	router := gin.Default()

	// Middleware CORS
	router.Use(cors.Default())

	// Phục vụ file tĩnh
	router.Static("/static", "./static")

	// Định nghĩa các routes
	authen.AuthRoute(router)
	user.HomeUserRoute(router)
	admin.HomeAdminRoute(router)
	role.RoleRouter(router)

	// Khởi động server
	router.Run(":8080")
}
