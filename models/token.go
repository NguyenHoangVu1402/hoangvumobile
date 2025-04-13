package models

import (
    "time"

    "github.com/google/uuid"
    "gorm.io/gorm"
)

type Token struct {
    ID         uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    UserID     uuid.UUID      `gorm:"type:uuid;index" json:"userId"`
    TokenValue string         `gorm:"size:500;uniqueIndex" json:"tokenValue"`
    TokenType  string         `gorm:"size:20" json:"tokenType"`
    ClientIP   string         `gorm:"size:100" json:"clientIp"`
    UserAgent  string         `gorm:"size:500" json:"userAgent"`
    Revoked    bool           `gorm:"default:false" json:"revoked"`
    ExpiresAt  time.Time      `json:"expiresAt"`
    CreatedAt  time.Time      `json:"createdAt"`
    UpdatedAt  time.Time      `json:"updatedAt"`
    DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

func (t *Token) BeforeCreate(tx *gorm.DB) error {
    if t.ID == uuid.Nil {
        t.ID = uuid.New()
    }
    return nil
}

func (t *Token) IsExpired() bool {
    return time.Now().After(t.ExpiresAt)
}

func (t *Token) IsValid() bool {
    return !t.Revoked && !t.IsExpired()
}

func (t *Token) Revoke() {
    t.Revoked = true
}