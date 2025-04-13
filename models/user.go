package models

import (
	"errors"
	"regexp"
	"strings"
	"time"

	"hoangvumobile/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User đại diện cho thông tin cơ bản của một người dùng trong hệ thống thương mại điện tử.
type User struct {
	ID                 uuid.UUID      `gorm:"type:char(36);primary_key;not null" json:"id"`                 // ID duy nhất của người dùng
	Username           string         `gorm:"size:100;uniqueIndex;not null" json:"username"`                // Tên đăng nhập duy nhất
	Password           string         `gorm:"size:255;not null" json:"-"`                                   // Mật khẩu đã được mã hóa
	Email              string         `gorm:"size:255;uniqueIndex;not null" json:"email"`                   // Email duy nhất để đăng nhập
	RoleID             string         `gorm:"type:char(36);not null;foreignKey:ID;references:roles" json:"role_id"` // Khóa ngoại tham chiếu đến bảng roles
	Status             string         `gorm:"size:20;default:unverified" json:"status"`                     // Trạng thái: "unverified", "verified", "banned"
	TwoFactorEnabled   bool           `gorm:"default:false" json:"twoFactorEnabled"`                        // Bật xác thực hai yếu tố (2FA)
	LastLoginAt        *time.Time     `json:"lastLoginAt"`                                                  // Thời gian đăng nhập cuối cùng
	LastLoginIP        string         `gorm:"size:100" json:"lastLoginIP"`                                  // Địa chỉ IP đăng nhập cuối cùng
	LastPasswordChange *time.Time     `json:"lastPasswordChange"`                                           // Thời gian thay đổi mật khẩu cuối cùng
	RecoveryCode       string         `gorm:"size:100" json:"recoveryCode"`                                 // Mã khôi phục tài khoản
	CreatedAt          time.Time      `json:"createdAt"`                                                    // Thời gian tạo tài khoản
	UpdatedAt          time.Time      `json:"updatedAt"`                                                    // Thời gian cập nhật tài khoản
	DeletedAt          gorm.DeletedAt `gorm:"index" json:"-"`                                               // Thời gian xóa mềm
	DetailUser         DetailUser     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"detailUser"` // Quan hệ 1-1 với DetailUser
	//Orders             []Order        `gorm:"foreignKey:UserID" json:"orders"`                              // Danh sách đơn hàng của người dùng
	//CartItems          []CartItem     `gorm:"foreignKey:UserID" json:"cartItems"`                           // Danh sách sản phẩm trong giỏ hàng
}

// BeforeCreate là một hook của GORM, chạy trước khi tạo một người dùng mới.
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// Tạo UUID nếu chưa có
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}

	// Chuẩn hóa dữ liệu
	u.Email = strings.ToLower(strings.TrimSpace(u.Email))
	u.Username = strings.TrimSpace(u.Username)

	// Kiểm tra dữ liệu người dùng
	if err := ValidateUser(u); err != nil {
		return err
	}

	// Mã hóa mật khẩu
	hashedPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return err
	}
	u.Password = hashedPassword

	return nil
}

// ValidateUser kiểm tra dữ liệu cơ bản của người dùng trước khi lưu vào cơ sở dữ liệu.
func ValidateUser(u *User) error {
	// Kiểm tra các trường bắt buộc
	if u.Username == "" || u.Email == "" {
		return errors.New("username và email không được để trống")
	}

	// Kiểm tra định dạng email
	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	if match, _ := regexp.MatchString(emailRegex, u.Email); !match {
		return errors.New("email không hợp lệ")
	}

	// Kiểm tra mật khẩu
	if u.Password == "" {
		return errors.New("mật khẩu không được để trống")
	}
	if len(u.Password) < 8 {
		return errors.New("mật khẩu phải có ít nhất 8 ký tự")
	}

	// Kiểm tra trạng thái (nếu có)
	if u.Status != "" {
		validStatuses := map[string]bool{"unverified": true, "verified": true, "banned": true}
		if !validStatuses[u.Status] {
			return errors.New("trạng thái không hợp lệ, chỉ chấp nhận: unverified, verified, banned")
		}
	}

	// Kiểm tra role_id (định dạng UUID)
	roleIDRegex := `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`
	if match, _ := regexp.MatchString(roleIDRegex, u.RoleID); !match {
		return errors.New("role_id không hợp lệ, phải là UUID")
	}

	return nil
}