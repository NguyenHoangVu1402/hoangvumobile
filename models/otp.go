package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OTP represents a one-time password for account verification or password reset
type OTP struct {
	ID        string         `gorm:"type:varchar(36);primaryKey;" json:"id"`
	UserID    string         `gorm:"type:varchar(36);index;not null" json:"userId"`
	Code      string         `gorm:"size:10;not null" json:"code"`
	Purpose   string         `gorm:"size:50;not null" json:"purpose"` // account_verification, password_reset
	Used      bool           `gorm:"default:false" json:"used"`
	ExpiresAt time.Time      `json:"expiresAt"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"` // Soft delete support
}

// TableName overrides the default table name
func (OTP) TableName() string {
	return "otps"
}

// BeforeCreate is called before creating an OTP
func (o *OTP) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.New().String() // Tạo UUID dạng string cho MySQL
	}
	return nil
}

// IsExpired checks if the OTP is expired
func (o *OTP) IsExpired() bool {
	return time.Now().After(o.ExpiresAt)
}

// IsValid checks if the OTP is valid (not used and not expired)
func (o *OTP) IsValid() bool {
	return !o.Used && !o.IsExpired()
}

// MarkAsUsed marks the OTP as used and saves to DB
func (o *OTP) MarkAsUsed(db *gorm.DB) error {
	o.Used = true
	return db.Save(o).Error
}

// GetTimeLeft returns the time left before the OTP expires
func (o *OTP) GetTimeLeft() time.Duration {
	if o.IsExpired() {
		return 0
	}
	return time.Until(o.ExpiresAt)
}

// GetTimeLeftInSeconds returns the time left in seconds
func (o *OTP) GetTimeLeftInSeconds() int {
	return int(time.Until(o.ExpiresAt).Seconds())
}

// SetExpiryTime sets the expiry time for the OTP
func (o *OTP) SetExpiryTime(minutes int) {
	o.ExpiresAt = time.Now().Add(time.Duration(minutes) * time.Minute)
}
