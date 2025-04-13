package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Role struct {
	ID          string    `gorm:"type:char(36);primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(255);unique;not null" json:"name"`
	Slug        string    `gorm:"type:varchar(255);unique;not null" json:"slug"`
	Description string    `gorm:"type:text" json:"description"`
	Status      string    `gorm:"type:varchar(50);default:'active'" json:"status"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (r *Role) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New().String()
	return
}
