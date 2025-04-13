package utils

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword mã hóa mật khẩu
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("lỗi mã hóa mật khẩu: %w", err)
	}
	return string(hashedPassword), nil
}

// ComparePassword kiểm tra mật khẩu nhập vào có khớp với mật khẩu đã hash không
func ComparePassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
