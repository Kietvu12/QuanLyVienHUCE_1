# Hướng dẫn sửa lỗi Session không chia sẻ giữa các tab

## Tóm tắt vấn đề
Khi đăng nhập vào admin, sau đó mở tab khác thì lại yêu cầu đăng nhập lại.

## Nguyên nhân chính
CakePHP mặc định kiểm tra User-Agent (`checkAgent => true`), khiến session không được chia sẻ giữa các tab.

## Các bước sửa lỗi

### Bước 1: Sửa AppController.php

**File:** `AppController.php` (thường ở `app/Controller/AppController.php`)

**1.1. Thêm cấu hình session vào method `beforeFilter()`**

Tìm method `beforeFilter()` (khoảng dòng 58) và **THÊM** vào **đầu method**, trước dòng `parent::beforeFilter();`:

```php
// Cấu hình session để chia sẻ giữa các tab
Configure::write('Session', array(
    'defaults' => 'php',
    'timeout' => 240, // 4 giờ
    'cookieTimeout' => 240,
    'checkAgent' => false, // QUAN TRỌNG: Tắt check agent để chia sẻ giữa tab
    'ini' => array(
        'session.cookie_httponly' => 1,
        'session.use_only_cookies' => 1,
        'session.cookie_samesite' => 'Lax',
        'session.cookie_path' => '/',
        'session.cookie_lifetime' => 0
    )
));
```

**1.2. Thêm logic tự động đăng nhập lại trong method `_beforeFilterBackend()`**

Tìm method `_beforeFilterBackend()` (khoảng dòng 155) và **THÊM** vào **đầu method**, sau dòng `parent::beforeFilter();`:

```php
// Tự động đăng nhập lại từ cookie nếu session hết hạn
if (!$this->Auth->user()) {
    $this->Cookie->name = 'oneweb';
    $this->Cookie->key = 'kjfdljiou39099083kjjklj@#^&!*&*&$^&*&98hkjfhdjk';
    $rememberedUser = $this->Cookie->read('auth_remember');
    
    if (!empty($rememberedUser) && isset($rememberedUser['id'])) {
        // Kiểm tra user có tồn tại không
        $this->loadModel('User');
        $user = $this->User->find('first', array(
            'conditions' => array('User.id' => $rememberedUser['id']),
            'recursive' => -1
        ));
        
        if (!empty($user)) {
            // Đăng nhập lại
            $this->Auth->login($user['User']);
        } else {
            // Xóa cookie nếu user không tồn tại
            $this->Cookie->delete('auth_remember');
        }
    }
}
```

### Bước 2: Sửa UsersController.php

**File:** `UsersController.php` (thường ở `app/Controller/UsersController.php`)

**2.1. Sửa method `admin_login()`**

Tìm method `admin_login()` (khoảng dòng 22) và **THAY THẾ** dòng 25-46 bằng:

```php
if ($this->Auth->login()) {
    $data = $this->request->data['User'];
    $admin = $this->Auth->user();
    
    // Đảm bảo session được lưu trực tiếp
    $this->Session->write('Auth.User', $admin);
    
    // Ghi nhớ tài khoản với cookie
    if (!empty($data['remember'])) {
        // Cấu hình cookie
        $this->Cookie->name = 'oneweb';
        $this->Cookie->time = '30 days';
        $this->Cookie->path = '/';
        $this->Cookie->domain = ''; // Để trống để dùng domain hiện tại
        $this->Cookie->secure = false; // Đặt true nếu sử dụng HTTPS
        $this->Cookie->key = 'kjfdljiou39099083kjjklj@#^&!*&*&$^&*&98hkjfhdjk';
        $this->Cookie->httpOnly = true;

        // Lưu thông tin đăng nhập vào cookie (30 ngày = 2592000 giây)
        $this->Cookie->write('auth_remember', $admin, false, 2592000);
    }

    $url = $this->Auth->redirect();
    $url = ($url == '/') ? array('controller' => 'pages', 'action' => 'index') : $url;
    $this->redirect($url);
}
```

**2.2. Sửa method `admin_logout()`**

Tìm method `admin_logout()` (khoảng dòng 268) và **THAY THẾ** toàn bộ method bằng:

```php
public function admin_logout()
{
    // Xóa cookie remember me
    $this->Cookie->name = 'oneweb';
    $this->Cookie->delete('auth_remember');
    
    $this->_deleteCache();
    $this->redirect($this->Auth->logout());
}
```

## Kiểm tra sau khi sửa

1. Xóa cache của CakePHP (thư mục `app/tmp/cache/`)
2. Đăng nhập vào admin
3. Mở tab mới và truy cập cùng domain
4. Tab mới phải tự động đăng nhập mà không cần đăng nhập lại

## Lưu ý quan trọng

1. **`checkAgent => false`** là thiết lập quan trọng nhất - đây là nguyên nhân chính gây ra lỗi
2. Nếu sử dụng HTTPS, đặt `secure => true` trong cấu hình cookie
3. Đảm bảo cookie key được bảo mật và không công khai
4. Sau khi sửa, nhớ xóa cache để áp dụng thay đổi

## Nếu vẫn còn lỗi

1. Kiểm tra cấu hình session trong `app/Config/core.php` (nếu có)
2. Kiểm tra server có hỗ trợ session không
3. Kiểm tra quyền ghi của thư mục `app/tmp/`
4. Kiểm tra cookie có bị chặn bởi trình duyệt không

