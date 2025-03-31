package config

import (
  "fmt"
  "log"
  "os"
  "strconv"
  "sync"
  "time"

  "github.com/joho/godotenv"
)

type Config struct {
        Environment string
        Server ServerConfig
        Database DatabaseConfig
        JWT JWTConfig
        OTP OTPConfig
        Email EmailConfig
        Templates TemplateConfig
        Static StaticConfig
}

type ServerConfig struct {
        Port string
        Host string
        ReadTimeout time.Duration
        WriteTimeout time.Duration
        ShutdownTimeout time.Duration
}

type DatabaseConfig struct {
        DSN string
        MaxOpenConns int
        MaxIdleConns int
        MaxLifetime time.Duration
}

type JWTConfig struct {
        Secret string
        ExpiryMinutes int
        RefreshDays int
        Issuer string
        CookieDomain string
        CookieSecure bool
        CookieHTTPOnly bool
        CookieSameSite string
        RefreshCookieName string
        AccessCookieName string
}

type OTPConfig struct {
        Length int
        ExpiryMinutes int
}

type EmailConfig struct {
        From string
        Host string
        Port int
        Username string
        Password string
}

type TemplateConfig struct {
        Dir string
}

type StaticConfig struct {
        Dir string
}

var (
        config *Config
        once sync.Once
)

func LoadConfig() (*Config, error) {
        var err error

        once.Do(func() {
                //Load .env file
                godotenv.Load()

                // Create default config
                config = &Config{
                        Environment: getEnvString("APP_ENV", "development"),
                        Server: ServerConfig{
                                Port: getEnvString("SERVER_PORT", "5000"),
                                Host: getEnvString("SERVER_HOST", "0.0.0.0"),
                                ReadTimeout: time.Duration(getEnvInt("SERVER_READ_TIMEOUT", 10)) * time.Second,
                                WriteTimeout: time.Duration(getEnvInt("SERVER_WRITE_TIMEOUT", 10)) * time.Second,
                                ShutdownTimeout: time.Duration(getEnvInt("SERVER_SHUTDOWN_TIMEOUT", 10)) * time.Second,
                        },

                        Database: DatabaseConfig{
                                DSN: getEnvString("DATABASE_URL", ""),
                                MaxOpenConns: getEnvInt("DB_MAX_OPEN_CONNS", 25),
                                MaxIdleConns: getEnvInt("DB_MAX_IDLE_CONNS", 25),
        MaxLifetime:  time.Duration(getEnvInt("DB_MAX_LIFETIME", 300)) * time.Second,
                        },

                        JWT: JWTConfig{
        Secret:           getEnvString("JWT_SECRET", "your-secret-key"),
        ExpiryMinutes:    getEnvInt("JWT_EXPIRY_MINUTES", 15),
        RefreshDays:      getEnvInt("JWT_REFRESH_DAYS", 7),
        Issuer:           getEnvString("JWT_ISSUER", "hoangvumobile"),
        CookieDomain:     getEnvString("COOKIE_DOMAIN", ""),
        CookieSecure:     getEnvBool("COOKIE_SECURE", false),
        CookieHTTPOnly:   getEnvBool("COOKIE_HTTP_ONLY", true),
        CookieSameSite:   getEnvString("COOKIE_SAME_SITE", "lax"),
        RefreshCookieName: getEnvString("REFRESH_COOKIE_NAME", "refresh_token"),
        AccessCookieName:  getEnvString("ACCESS_COOKIE_NAME", "access_token"),
      },

                        OTP: OTPConfig{
        Length:        getEnvInt("OTP_LENGTH", 6),
        ExpiryMinutes: getEnvInt("OTP_EXPIRY_MINUTES", 15),
      },

                        Email: EmailConfig{
        From:     getEnvString("EMAIL_FROM", "no-reply@hoangvumobile.com"),
        Host:     getEnvString("EMAIL_HOST", "smtp.mailtrap.io"),
        Port:     getEnvInt("EMAIL_PORT", 587),
        Username: getEnvString("EMAIL_USERNAME", ""),
        Password: getEnvString("EMAIL_PASSWORD", ""),
      },

                        Templates: TemplateConfig{
        Dir: getEnvString("TEMPLATES_DIR", "templates"),
      },
      Static: StaticConfig{
        Dir: getEnvString("STATIC_DIR", "public"),
      },
                }

                // Kiểm tra cấu hình cần thiết
                if config.Database.DSN == "" {
      log.Println("WARNING: No DATABASE_URL provided, using default SQLite database")
      config.Database.DSN = "file:hoangvumobile.db"
    }

    if config.JWT.Secret == "your-secret-key" && config.Environment != "development" {
      err = fmt.Errorf("JWT_SECRET is required in non-development environments")
    }
        })

        return config, err
}

func GetConfig() *Config {
  if config == nil {
    _, err := LoadConfig()
    if err != nil {
      log.Fatalf("Failed to load config: %v", err)
    }
  }
  return config
}

func getEnvString(key, defaultValue string) string {
        value := os.Getenv(key)
        if value == "" {
                return defaultValue
        }
        return value
}

func getEnvInt(key string, defaultValue int) int {
        value := os.Getenv(key)
        if value == "" {
                return defaultValue
        }
        intValue, err := strconv.Atoi(value)
        if err != nil {
                log.Printf("CẢNH BÁO: Giá trị không hợp lệ cho %s: %s. Sử dụng mặc định: %d", key, value, defaultValue)
                return defaultValue
        }
        return intValue
}

func getEnvBool(key string, defaultValue bool) bool {
        value := os.Getenv(key)
        if value == "" {
                return defaultValue
        }
        boolValue, err := strconv.ParseBool(value)
        if err != nil {
                log.Printf("CẢNH BÁO: Giá trị không hợp lệ cho %s: %s. Sử dụng mặc định: %t", key, value, defaultValue)
                return defaultValue
        }
        return boolValue
}