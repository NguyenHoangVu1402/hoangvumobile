package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Token represents an authentication token
type Token struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	UserID     uuid.UUID `gorm:"type:uuid;index" json:"userId"`
	TokenValue string    `gorm:"size:500;uniqueIndex" json:"tokenValue"`
	TokenType  string    `gorm:"size:20" json:"tokenType"` // access, refresh
	ClientIP   string    `gorm:"size:100" json:"clientIp"`
	UserAgent  string    `gorm:"size:500" json:"userAgent"`
	Revoked    bool      `gorm:"default:false" json:"revoked"`
	ExpiresAt  time.Time `json:"expiresAt"`
	
	// Standard timestamps
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate is called before creating a Token
func (t *Token) BeforeCreate(tx *gorm.DB) error {
	// Set UUID if not set
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}

// IsExpired checks if the token is expired
func (t *Token) IsExpired() bool {
	return time.Now().After(t.ExpiresAt)
}

// IsValid checks if the token is valid (not revoked and not expired)
func (t *Token) IsValid() bool {
	return !t.Revoked && !t.IsExpired()
}

// Revoke revokes the token
func (t *Token) Revoke() {
	t.Revoked = true
}

// GetTimeLeft returns the time left before the token expires
// GetTimeLeft returns the time left before the token expires
func (t *Token) GetTimeLeft() time.Duration {
	if t.IsExpired() {
		return 0
	}
	return time.Until(t.ExpiresAt) // ✅ Sử dụng time.Until()
}

// GetTimeLeftInSeconds returns the time left in seconds
func (t *Token) GetTimeLeftInSeconds() int {
	return int(time.Until(t.ExpiresAt).Seconds()) // ✅ Dùng time.Until()
}
