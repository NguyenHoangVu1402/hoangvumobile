package config

import (
  "github.com/gin-gonic/gin"
  "html/template"
  "log"
  "net/http"
  "os"
)

func getTemplateUserPath(tmpl string) string {
  userPath := "templates/pages/user/" + tmpl + ".html"

  // Kiểm tra nếu file tồn tại
  if _, err := os.Stat(userPath); err == nil {
    return userPath
  }

  // Nếu không tìm thấy, trả về file mặc định hoặc rỗng
  return ""
}

func getTemplateAdminPath(tmpl string) string {
  userPath := "templates/pages/admin/" + tmpl + ".html"

  // Kiểm tra nếu file tồn tại
  if _, err := os.Stat(userPath); err == nil {
    return userPath
  }

  // Nếu không tìm thấy, trả về file mặc định hoặc rỗng
  return ""
}

func RenderTemplateUser1(c *gin.Context, tmpl string, title string, showHeader bool, showFooter bool) {

  tmplPath := getTemplateUserPath(tmpl)
  if tmplPath == "" {
    log.Println("Lỗi: Template không tồn tại:", tmpl)
    c.String(http.StatusNotFound, "Trang không tồn tại")
    return
  }
  // Nạp toàn bộ template trong thư mục templates/
  templates, err := template.ParseGlob("templates/**/*.html")
  if err != nil {
    log.Println("Lỗi nạp template:", err)
    c.String(http.StatusInternalServerError, "Lỗi server")
    return
  }

  // Parse layout và trang nội dung
  templates, err = templates.ParseFiles("templates/layouts/layout_user_1.html", tmplPath)
  if err != nil {
    log.Println("Lỗi render layout:", err)
    c.String(http.StatusInternalServerError, "Lỗi server")
    return
  }

  data := struct {
    Title      string
    ShowHeader bool
    ShowFooter bool

  }{
    Title:      title,
    ShowHeader: showHeader,
    ShowFooter: showFooter,

  }

  // Render template
  err = templates.ExecuteTemplate(c.Writer, "layout_user_1.html", data)
  if err != nil {
    log.Println("Lỗi thực thi layout:", err)
    c.String(http.StatusInternalServerError, "Lỗi server")
  }
}

func RenderTemplateAdmin(c *gin.Context, tmpl string, title string, showSiderbarMenu bool) {

  tmplPath := getTemplateAdminPath(tmpl)
  if tmplPath == "" {
    log.Println("Lỗi: Template không tồn tại:", tmpl)
    c.String(http.StatusNotFound, "Trang không tồn tại")
    return
  }
  // Nạp toàn bộ template trong thư mục templates/
  templates, err := template.ParseGlob("templates/**/*.html")
  if err != nil {
    log.Println("Lỗi nạp template:", err)
    c.String(http.StatusInternalServerError, "Lỗi server")
    return
  }

  // Parse layout và trang nội dung
  templates, err = templates.ParseFiles("templates/layouts/layout_admin.html", tmplPath)
  if err != nil {
    log.Println("Lỗi render layout:", err)
    c.String(http.StatusInternalServerError, "Lỗi server")
    return
  }

  data := struct {
    Title      string
    ShowSiderbarMenu bool

  }{
    Title:      title,
    ShowSiderbarMenu: showSiderbarMenu,

  }

  // Render template
  err = templates.ExecuteTemplate(c.Writer, "layout_admin.html", data)
  if err != nil {
    log.Println("Lỗi thực thi layout:", err)
    c.String(http.StatusInternalServerError, "Lỗi server")
  }
}
