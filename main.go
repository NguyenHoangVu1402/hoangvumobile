package main

import (
    "log"
    "time"
    "hoangvumobile/config"  // Đảm bảo import đúng path
    
    "hoangvumobile/routes/admin"
    "hoangvumobile/routes/user"
    
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"

	"hoangvumobile/routes/authentication"
)

func main() {
    // Khởi tạo server
    if err := initServer(); err != nil {
        log.Fatalf("Lỗi khi khởi động server: %v", err)
    }
}

func initServer() error {
    // Load cấu hình
    cfg, err := config.LoadConfig()
    if err != nil {
        return err
    }

    // Kết nối database
    db, err := gorm.Open(mysql.Open(cfg.DB.DSN), &gorm.Config{})
    if err != nil {
        return err
    }

    // Chạy migrate database
    if err := config.MigrateDB(db); err != nil { // Sử dụng database.Migrate
        return err
    }

    // Khởi tạo router Gin
    router := gin.Default()

    // Cấu hình CORS
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    // Phục vụ file tĩnh
    router.Static("/static", "./static")

    // Định nghĩa routes
	authentication.SetupRoutes(router, db) 
    user.HomeUserRoute(router)  // Truyền db vào route
    admin.HomeAdminRoute(router) // Truyền db vào route


    // Khởi động server
    log.Printf("Server đang chạy tại %s", cfg.Server.Address)
    return router.Run(cfg.Server.Address)
}