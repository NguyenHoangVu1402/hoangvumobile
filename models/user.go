package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Username  string    `gorm:"size:100;uniqueIndex" json:"username"`
	Password  string    `gorm:"size:255" json:"-"`
	Email     string    `gorm:"size:255;uniqueIndex" json:"email"`
	FullName  string    `gorm:"size:255" json:"fullName"`
	
	// Additional fields for a phone selling website
	CustomerID    string    `gorm:"size:100;uniqueIndex" json:"customerId"` // Format: HVM + random string
	PhoneNumber   string    `gorm:"size:20" json:"phoneNumber"`
	Gender        string    `gorm:"size:10" json:"gender"`
	DateOfBirth   time.Time `json:"dateOfBirth"`
	Address       string    `gorm:"size:255" json:"address"`
	Ward          string    `gorm:"size:100" json:"ward"`
	District      string    `gorm:"size:100" json:"district"`
	City          string    `gorm:"size:100" json:"city"`
	Avatar        string    `gorm:"size:255" json:"avatar"`
	Role          string    `gorm:"size:20;default:user" json:"role"` // user, admin, staff
	Status        string    `gorm:"size:20;default:unverified" json:"status"` // unverified, active, blocked
	
	// User preferences and settings
	Notifications bool `gorm:"default:true" json:"notifications"`
	Newsletter    bool `gorm:"default:true" json:"newsletter"`
	
	// Purchase history and statistics
	TotalOrders  int `gorm:"default:0" json:"totalOrders"`
	TotalSpent   int `gorm:"default:0" json:"totalSpent"`
	LoyaltyPoints int `gorm:"default:0" json:"loyaltyPoints"`
	
	// Security and tracking
	LastLoginAt  time.Time `json:"lastLoginAt"`
	LastLoginIP  string    `gorm:"size:100" json:"lastLoginIP"`
	
	// Standard timestamps
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate is called before creating a User
func (u *User) BeforeCreate(tx *gorm.DB) error {
	// Set UUID if not set
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// IsVerified checks if the user is verified
func (u *User) IsVerified() bool {
	return u.Status == "active"
}

// IsActive checks if the user is active
func (u *User) IsActive() bool {
	return u.Status != "blocked"
}

// SetVerified sets the user status to verified
func (u *User) SetVerified() {
	u.Status = "active"
}

// BlockUser blocks the user
func (u *User) BlockUser() {
	u.Status = "blocked"
}

// IsAdmin checks if the user is an admin
func (u *User) IsAdmin() bool {
	return u.Role == "admin"
}

// IsStaff checks if the user is a staff member
func (u *User) IsStaff() bool {
	return u.Role == "staff"
}

func (u *User) IsUser() bool {
	return u.Role == "user"
}

// HasCompletedProfile checks if the user has completed their profile
func (u *User) HasCompletedProfile() bool {
	return u.PhoneNumber != "" && u.Address != "" && u.City != ""
}