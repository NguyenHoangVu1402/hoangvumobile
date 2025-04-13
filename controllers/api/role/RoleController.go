package role

import (
	"hoangvumobile/database"
	"hoangvumobile/models"
	"hoangvumobile/validate"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"errors"
	"gorm.io/gorm"
	"github.com/go-playground/validator/v10"
)

func CreateRole(c *gin.Context) {
	var input validate.RoleInput

	// Bước 1: Bind dữ liệu
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Dữ liệu gửi lên không hợp lệ",
			"error":   err.Error(),
		})
		return
	}

	// Bước 2: Validate
	if err := validate.Validate.Struct(input); err != nil {
		errs := make(map[string]string)
		for _, err := range err.(validator.ValidationErrors) {
			switch err.Field() {
			case "Name":
				errs["name"] = "Tên phải từ 3 đến 100 ký tự"
			case "Slug":
				errs["slug"] = "Slug chỉ chứa ký tự a-z, 0-9, và dấu gạch ngang (-), từ 3-100 ký tự"
			case "Description":
				errs["description"] = "Mô tả tối đa 255 ký tự"
			case "Status":
				errs["status"] = "Trạng thái phải là 'active' hoặc 'inactive'"
			default:
				errs[err.Field()] = "Trường không hợp lệ"
			}
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Thông tin nhập chưa hợp lệ",
			"errors":  errs,
		})
		return
	}

	// Bước 3: Kiểm tra tên hoặc slug đã tồn tại
	var existingRole models.Role
	if err := database.DB.Where("name = ? OR slug = ?", input.Name, input.Slug).First(&existingRole).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Tên hoặc slug đã tồn tại",
		})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Lỗi khi kiểm tra vai trò",
		})
		return
	}

	// Bước 4: Lưu vào cơ sở dữ liệu
	role := models.Role{
		Name:        input.Name,
		Slug:        input.Slug,
		Description: input.Description,
		Status:      input.Status,
	}
	if role.Status == "" {
		role.Status = "active"
	}
	if err := database.DB.Create(&role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Không thể tạo vai trò",
			"error":   err.Error(),
		})
		return
	}

	// Bước 5: Trả kết quả
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Tạo vai trò thành công",
		"data":    role,
	})
}

func GetAllRole(c *gin.Context) {
	// Lấy tham số phân trang
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	// Lấy danh sách vai trò
	var roles []models.Role
	var total int64

	// Đếm tổng số bản ghi
	if err := database.DB.Model(&models.Role{}).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Không thể lấy tổng số vai trò",
		})
		return
	}

	// Lấy dữ liệu với phân trang và sắp xếp theo CreatedAt giảm dần
	if err := database.DB.Order("created_at DESC").Limit(limit).Offset(offset).Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Không thể lấy danh sách vai trò",
		})
		return
	}

	// Tính tổng số trang
	totalPages := int((total + int64(limit) - 1) / int64(limit))

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"roles":      roles,
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}

func ShowRole(c *gin.Context) {
	id := c.Param("id")
	var role models.Role

	if err := database.DB.Where("id = ?", id).First(&role).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "Không tìm thấy vai trò",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Lỗi khi tìm kiếm vai trò",
			})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   role,
	})
}

func UpdateRole(c *gin.Context) {
	id := c.Param("id")
	var role models.Role

	// Tìm vai trò theo ID
	if err := database.DB.Where("id = ?", id).First(&role).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "Vai trò không tồn tại",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Lỗi truy vấn cơ sở dữ liệu",
			})
		}
		return
	}

	// Lấy dữ liệu gửi lên
	var input validate.RoleInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Dữ liệu gửi lên không hợp lệ",
			"error":   err.Error(),
		})
		return
	}

	// Validate đầu vào
	if err := validate.Validate.Struct(input); err != nil {
		errs := make(map[string]string)
		for _, err := range err.(validator.ValidationErrors) {
			switch err.Field() {
			case "Name":
				errs["name"] = "Tên phải từ 3 đến 100 ký tự"
			case "Slug":
				errs["slug"] = "Slug chỉ chứa ký tự a-z, 0-9, và dấu gạch ngang (-), từ 3-100 ký tự"
			case "Description":
				errs["description"] = "Mô tả tối đa 255 ký tự"
			case "Status":
				errs["status"] = "Trạng thái phải là 'active' hoặc 'inactive'"
			default:
				errs[err.Field()] = "Trường không hợp lệ"
			}
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Thông tin chưa hợp lệ",
			"errors":  errs,
		})
		return
	}

	// Kiểm tra tên hoặc slug đã tồn tại (ngoại trừ vai trò hiện tại)
	var existingRole models.Role
	if err := database.DB.Where("(name = ? OR slug = ?) AND id != ?", input.Name, input.Slug, id).First(&existingRole).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Tên hoặc slug đã tồn tại",
		})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Lỗi khi kiểm tra vai trò",
		})
		return
	}

	// Cập nhật dữ liệu
	role.Name = input.Name
	role.Slug = input.Slug
	role.Description = input.Description
	role.Status = input.Status

	if err := database.DB.Save(&role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Không thể cập nhật vai trò",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Cập nhật vai trò thành công",
		"data":    role,
	})
}

func DeleteRole(c *gin.Context) {
	id := c.Param("id")
	var role models.Role

	// Tìm vai trò theo ID
	if err := database.DB.Where("id = ?", id).First(&role).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "Vai trò không tồn tại",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Lỗi truy vấn cơ sở dữ liệu",
			})
		}
		return
	}

	// Xóa vai trò
	if err := database.DB.Delete(&role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Không thể xóa vai trò",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Xóa vai trò thành công",
	})
}