package models

import (
    "time"

    "github.com/google/uuid"
    "gorm.io/gorm"
)

type OTP struct {
    ID        string         `gorm:"type:varchar(36);primaryKey;" json:"id"`
    UserID    string         `gorm:"type:varchar(36);index;not null" json:"userId"`
    Code      string         `gorm:"size:10;not null" json:"code"`
    Purpose   string         `gorm:"size:50;not null" json:"purpose"`
    Used      bool           `gorm:"default:false" json:"used"`
    ExpiresAt time.Time      `json:"expiresAt"`
    CreatedAt time.Time      `json:"createdAt"`
    UpdatedAt time.Time      `json:"updatedAt"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (o *OTP) BeforeCreate(tx *gorm.DB) error {
    if o.ID == "" {
        o.ID = uuid.New().String()
    }
    return nil
}

func (o *OTP) IsExpired() bool {
    return time.Now().After(o.ExpiresAt)
}

func (o *OTP) IsValid() bool {
    return !o.Used && !o.IsExpired()
}

func (o *OTP) MarkAsUsed(db *gorm.DB) error {
    o.Used = true
    return db.Save(o).Error
}

func (o *OTP) SetExpiryTime(minutes int) {
    o.ExpiresAt = time.Now().Add(time.Duration(minutes) * time.Minute)
}