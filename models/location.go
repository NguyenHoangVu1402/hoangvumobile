package models

import (
	"gorm.io/gorm"
)

// Province represents a province/city in Vietnam
type Province struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"type:varchar(100);not null" json:"name"`
	Code      string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"code"`
	CreatedAt int64          `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt int64          `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	
	// Relationships
	Districts []District `gorm:"foreignKey:ProvinceID" json:"districts,omitempty"`
}

// District represents a district in a province
type District struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Name       string         `gorm:"type:varchar(100);not null" json:"name"`
	Code       string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"code"`
	ProvinceID uint           `json:"province_id"`
	CreatedAt  int64          `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  int64          `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	
	// Relationships
	Province Province `gorm:"foreignKey:ProvinceID" json:"province,omitempty"`
	Wards    []Ward   `gorm:"foreignKey:DistrictID" json:"wards,omitempty"`
}

// Ward represents a ward/commune in a district
type Ward struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Name       string         `gorm:"type:varchar(100);not null" json:"name"`
	Code       string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"code"`
	DistrictID uint           `json:"district_id"`
	CreatedAt  int64          `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  int64          `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	
	// Relationships
	District District `gorm:"foreignKey:DistrictID" json:"district,omitempty"`
}

// TableName overrides the table name
func (Province) TableName() string {
	return "provinces"
}

// TableName overrides the table name
func (District) TableName() string {
	return "districts"
}

// TableName overrides the table name
func (Ward) TableName() string {
	return "wards"
}