package database

import (
	"log"
	"sync"

	"hoangvumobile/config"
	"hoangvumobile/models"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	db     *gorm.DB
	dbOnce sync.Once
)

// Init initializes the database connection
func Init() {
	dbOnce.Do(func() {
		var err error
		cfg := config.GetConfig()

		// Configure logger
		loggerConfig := logger.Default
		if cfg.AppEnv == "development" {
			loggerConfig = logger.Default.LogMode(logger.Info)
		}

		// Connect to database based on driver
		switch cfg.DBDriver {
		case "mysql":
			db, err = gorm.Open(mysql.Open(cfg.DBDSN), &gorm.Config{
				Logger: loggerConfig,
			})
		case "postgres":
			db, err = gorm.Open(postgres.Open(cfg.DBDSN), &gorm.Config{
				Logger: loggerConfig,
			})
		default:
			log.Fatalf("Unsupported database driver: %s", cfg.DBDriver)
		}

		if err != nil {
			log.Fatalf("Không thể kết nối đến cơ sở dữ liệu: %v", err)
		}

		// Configure connection pool
		sqlDB, err := db.DB()
		if err != nil {
			log.Fatalf("Không thể cấu hình kết nối cơ sở dữ liệu: %v", err)
		}

		// Set connection pool settings
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(100)

		// Auto migrate models
		err = AutoMigrate()
		if err != nil {
			log.Fatalf("Không thể tạo các bảng trong cơ sở dữ liệu: %v", err)
		}

		log.Println("Kết nối cơ sở dữ liệu thành công")
	})
}

// GetDB returns the database connection
func GetDB() *gorm.DB {
	if db == nil {
		Init()
	}
	return db
}

// AutoMigrate automatically migrates the database schema
func AutoMigrate() error {
	// Enable UUID extension for PostgreSQL
	if config.GetConfig().DBDriver == "postgres" {
		if err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";").Error; err != nil {
			return err
		}
	}

	// Auto migrate models
	err := db.AutoMigrate(
		&models.User{},
		&models.OTP{},
		&models.Token{},
	)

	return err
}

// Close closes the database connection
func Close() {
	if db != nil {
		sqlDB, err := db.DB()
		if err != nil {
			log.Printf("Lỗi khi lấy đối tượng DB: %v", err)
			return
		}
		if err := sqlDB.Close(); err != nil {
			log.Printf("Lỗi khi đóng kết nối cơ sở dữ liệu: %v", err)
		}
	}
}