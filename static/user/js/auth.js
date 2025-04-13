document.getElementById('hoangvumobile-register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = {};

    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Đăng ký thành công!');
            window.location.href = '/login';
        } else {
            alert('Đăng ký không thành công: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Lỗi đăng ký:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
    });
});