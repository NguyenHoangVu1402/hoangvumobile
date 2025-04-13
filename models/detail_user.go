package models

import (
	"errors"
	"regexp"
	"strings"
	"time"
	"gorm.io/gorm"
	"github.com/google/uuid"
)

// DetailUser đại diện cho thông tin chi tiết của một người dùng trong hệ thống thương mại điện tử.
type DetailUser struct {
	ID                 uuid.UUID `gorm:"type:char(36);primary_key;not null" json:"id"`          // ID duy nhất của DetailUser
	UserID             uuid.UUID `gorm:"type:char(36);not null;unique" json:"user_id"`          // Khóa ngoại tham chiếu đến User
	FullName           string    `gorm:"size:255" json:"fullName"`                              // Họ và tên đầy đủ của người dùng
	CustomerID         string    `gorm:"size:100;uniqueIndex" json:"customerId"`                // Mã khách hàng duy nhất cho logic kinh doanh
	PhoneNumber        string    `gorm:"size:20" json:"phoneNumber"`                            // Số điện thoại (không bắt buộc)
	Gender             string    `gorm:"size:10" json:"gender"`                                 // Giới tính: "male", "female", "other"
	DateOfBirth        time.Time `gorm:"not null" json:"dateOfBirth"`                           // Ngày sinh (bắt buộc)
	Address            string    `gorm:"size:255" json:"address"`                               // Địa chỉ (không bắt buộc)
	Ward               string    `gorm:"size:100" json:"ward"`                                  // Phường/Xã (không bắt buộc)
	District           string    `gorm:"size:100" json:"district"`                              // Quận/Huyện (không bắt buộc)
	City               string    `gorm:"size:100" json:"city"`                                  // Thành phố (không bắt buộc)
	Avatar             string    `gorm:"size:255" json:"avatar"`                                // URL ảnh đại diện của người dùng (không bắt buộc)
	Notifications      bool      `gorm:"default:true" json:"notifications"`                     // Bật/tắt thông báo
	Newsletter         bool      `gorm:"default:true" json:"newsletter"`                        // Đăng ký nhận bản tin
	TotalOrders        int       `gorm:"default:0" json:"totalOrders"`                          // Tổng số đơn hàng
	TotalSpent         int       `gorm:"default:0" json:"totalSpent"`                           // Tổng số tiền đã chi tiêu (đơn vị tiền tệ)
	LoyaltyPoints      int       `gorm:"default:0" json:"loyaltyPoints"`                        // Điểm thưởng để đổi quà
	ShippingAddress    string    `gorm:"size:255" json:"shippingAddress"`                       // Địa chỉ giao hàng mặc định
	ShippingMethod     string    `gorm:"size:100" json:"shippingMethod"`                        // Phương thức giao hàng ưa thích
	ShippingStatus     string    `gorm:"size:50" json:"shippingStatus"`                         // Trạng thái giao hàng hiện tại
	PaymentMethods     []string  `gorm:"-" json:"paymentMethods"`                               // Danh sách phương thức thanh toán (không lưu vào DB)
	DiscountCodes      []string  `gorm:"-" json:"discountCodes"`                                // Danh sách mã giảm giá (không lưu vào DB)
	ActiveDiscount     string    `gorm:"size:100" json:"activeDiscount"`                        // Mã giảm giá đang hoạt động
	GoogleAccountID    string    `gorm:"size:100" json:"googleAccountID"`                       // ID tài khoản Google cho OAuth
	PreferredLanguage  string    `gorm:"size:20" json:"preferredLanguage"`                      // Ngôn ngữ ưa thích (ví dụ: "en", "vi")
	Unsubscribed       bool      `gorm:"default:false" json:"unsubscribed"`                     // Hủy đăng ký nhận email tiếp thị
	CreatedAt          time.Time `json:"createdAt"`                                             // Thời gian tạo thông tin chi tiết
	UpdatedAt          time.Time `json:"updatedAt"`                                             // Thời gian cập nhật thông tin chi tiết
}

// BeforeCreate là một hook của GORM, chạy trước khi tạo thông tin chi tiết của người dùng.
func (du *DetailUser) BeforeCreate(tx *gorm.DB) (err error) {
	// Tạo UUID nếu chưa có
	if du.ID == uuid.Nil {
		du.ID = uuid.New()
	}

	// Chuẩn hóa dữ liệu
	du.FullName = strings.TrimSpace(du.FullName)
	du.PhoneNumber = strings.TrimSpace(du.PhoneNumber)
	du.Address = strings.TrimSpace(du.Address)

	// Kiểm tra dữ liệu chi tiết của người dùng
	if err := ValidateDetailUser(du); err != nil {
		return err
	}

	return nil
}

// ValidateDetailUser kiểm tra thông tin chi tiết của người dùng trước khi lưu vào cơ sở dữ liệu.
func ValidateDetailUser(du *DetailUser) error {
	// Kiểm tra số điện thoại (nếu có)
	if du.PhoneNumber != "" {
		// Loại bỏ khoảng trắng và ký tự không cần thiết
		phone := strings.ReplaceAll(du.PhoneNumber, " ", "")

		// Danh sách các đầu số hợp lệ của Việt Nam
		validPrefixes := map[string]bool{
			"032": true, "033": true, "034": true, "035": true, "036": true, "037": true, "038": true, "039": true,
			"070": true, "071": true, "072": true, "073": true, "074": true, "075": true, "076": true, "077": true, "078": true, "079": true,
			"081": true, "082": true, "083": true, "084": true, "085": true, "086": true, "087": true, "088": true, "089": true,
			"090": true, "091": true, "092": true, "093": true, "094": true, "095": true, "096": true, "097": true, "098": true, "099": true,
		}

		// Kiểm tra định dạng số điện thoại
		var prefix string
		var phoneBody string

		// Định dạng quốc tế: bắt đầu bằng +84
		if strings.HasPrefix(phone, "+84") {
			if len(phone) != 12 { // +84 + 9 chữ số
				return errors.New("số điện thoại định dạng quốc tế phải có 12 chữ số (bao gồm +84)")
			}
			prefix = phone[3:6]  // Lấy 3 chữ số sau +84 (ví dụ: 912 trong +84912345678)
			phoneBody = phone[3:] // Phần số sau +84 (9 chữ số)
		} else if strings.HasPrefix(phone, "0") { // Định dạng nội địa: bắt đầu bằng 0
			if len(phone) != 10 { // 0 + 9 chữ số
				return errors.New("số điện thoại định dạng nội địa phải có 10 chữ số (bao gồm số 0 đầu tiên)")
			}
			prefix = phone[1:4]  // Lấy 3 chữ số sau số 0 (ví dụ: 912 trong 0912345678)
			phoneBody = phone[1:] // Phần số sau số 0 (9 chữ số)
		} else {
			return errors.New("số điện thoại phải bắt đầu bằng +84 hoặc 0")
		}

		// Kiểm tra đầu số có hợp lệ không
		if !validPrefixes[prefix] {
			return errors.New("đầu số không hợp lệ, chỉ chấp nhận các đầu số của Việt Nam")
		}

		// Kiểm tra phần thân số (9 chữ số sau đầu số) chỉ chứa số
		phoneRegex := `^\d{9}$`
		if match, _ := regexp.MatchString(phoneRegex, phoneBody); !match {
			return errors.New("số điện thoại không hợp lệ, phần sau đầu số phải là 9 chữ số")
		}

		// Chuẩn hóa số điện thoại về định dạng nội địa (bắt đầu bằng 0)
		if strings.HasPrefix(phone, "+84") {
			du.PhoneNumber = "0" + phone[3:]
		}
	}

	// Kiểm tra giới tính (nếu có)
	if du.Gender != "" {
		validGenders := map[string]bool{"male": true, "female": true, "other": true}
		if !validGenders[strings.ToLower(du.Gender)] {
			return errors.New("giới tính không hợp lệ, chỉ chấp nhận: male, female, other")
		}
		du.Gender = strings.ToLower(du.Gender) // Chuẩn hóa giới tính
	}

	// Kiểm tra ngày sinh
	if du.DateOfBirth.IsZero() {
		return errors.New("ngày sinh không được để trống")
	}
	if du.DateOfBirth.After(time.Now()) {
		return errors.New("ngày sinh không được trong tương lai")
	}

	return nil
}