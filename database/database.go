package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"hoangvumobile/models"
)

var DB *gorm.DB

// ConnectDB - Kết nối với MySQL
func ConnectDB() {
	// Load biến môi trường từ .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Lỗi khi load file .env:", err)
	}

	// Lấy thông tin từ biến môi trường
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")

	// Chuỗi kết nối MySQL (Data Source Name - DSN)
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbName,
	)

	// Mở kết nối với MySQL
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Không thể kết nối MySQL:", err)
	}

	DB = db
	fmt.Println("✅ Kết nối MySQL thành công!")
}

// GetDB - Trả về kết nối database
func GetDB() *gorm.DB {
	return DB
}

func AutoMigrateTables() {
	db := GetDB()

	tables := []interface{}{
		&models.User{},
		&models.Role{},
		&models.DetailUser{}, 
	}

	for _, table := range tables {
		if err := db.AutoMigrate(table); err != nil {
			fmt.Printf("❌ Lỗi khi migrate bảng %T: %v\n", table, err)
		} else {
			fmt.Printf("✅ Đã migrate bảng %T thành công!\n", table)
		}
	}
}