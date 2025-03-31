package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ResetToken represents a token for password reset
type ResetToken struct {
	ID        string    `gorm:"type:varchar(36);primary_key" json:"id"`
	UserID    string    `gorm:"type:varchar(36);not null" json:"userId"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
	Token     string    `gorm:"type:varchar(100);not null;unique_index" json:"token"`
	ExpiresAt time.Time `gorm:"not null" json:"expiresAt"`
	IsUsed    bool      `gorm:"default:false" json:"isUsed"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (r *ResetToken) BeforeCreate(_ *gorm.DB) error {
	r.ID = uuid.New().String()
	return nil
}

// IsExpired checks if the reset token has expired
func (r *ResetToken) IsExpired() bool {
	return time.Now().After(r.ExpiresAt)
}

// IsValid checks if the reset token is valid (not used and not expired)
func (r *ResetToken) IsValid() bool {
	return !r.IsUsed && !r.IsExpired()
}

// MarkAsUsed marks the reset token as used
func (r *ResetToken) MarkAsUsed(db *gorm.DB) error {
	r.IsUsed = true
	return db.Save(r).Error
}

// CreateResetToken creates a new reset token record
func CreateResetToken(db *gorm.DB, userID string, token string, expiresIn time.Duration) (*ResetToken, error) {
	resetToken := &ResetToken{
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(expiresIn),
		IsUsed:    false,
	}

	if err := db.Create(resetToken).Error; err != nil {
		return nil, err
	}

	return resetToken, nil
}