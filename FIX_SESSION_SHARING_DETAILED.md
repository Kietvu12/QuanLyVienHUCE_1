# Hướng dẫn chi tiết sửa lỗi Session không chia sẻ giữa các tab

## Vấn đề
Khi đăng nhập vào admin, sau đó mở tab khác thì lại yêu cầu đăng nhập lại. Đây là vấn đề về session cookie không được chia sẻ giữa các tab trong CakePHP.

## Nguyên nhân
1. CakePHP mặc định kiểm tra User-Agent (`checkAgent => true`), khiến session không được chia sẻ giữa các tab
2. Session cookie có thể không được cấu hình đúng cách
3. Thiếu logic tự động đăng nhập lại từ cookie khi session hết hạn

## Giải pháp

### Bước 1: Sửa AppController.php

Thêm cấu hình session vào method `beforeFilter()`:

**Tìm dòng 58-99 trong AppController.php và thêm vào đầu method `beforeFilter()`:**

```php
public function beforeFilter()
{
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
            'session.cookie_lifetime' => 0 // Session cookie tồn tại đến khi đóng trình duyệt
        )
    ));
    
    parent::beforeFilter();
    // ... phần code còn lại
}
```

### Bước 2: Thêm logic tự động đăng nhập lại từ cookie trong AppController.php

**Tìm method `_beforeFilterBackend()` (dòng 155) và thêm logic sau vào đầu method:**

```php
public function _beforeFilterBackend()
{
    parent::beforeFilter();
    
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
    
    $this->Session->delete('lang');
    // ... phần code còn lại
}
```

### Bước 3: Sửa UsersController.php

**Tìm method `admin_login()` (dòng 22) và đảm bảo session được lưu đúng cách:**

```php
public function admin_login()
{
    if ($this->request->is('post')) {
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
        } else {
            $this->Session->setFlash(__('Thông tin truy cập không đúng'));
        }
    }
}
```

### Bước 4: Sửa admin_logout() để xóa cookie

**Tìm method `admin_logout()` (dòng 268) và thêm xóa cookie:**

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

## Điểm quan trọng

1. **`checkAgent => false`**: Đây là thiết lập quan trọng nhất. Khi bật, CakePHP sẽ kiểm tra User-Agent và không chia sẻ session giữa các tab nếu User-Agent khác nhau.

2. **Session cookie path**: Đảm bảo cookie path là `/` để có thể truy cập từ mọi đường dẫn.

3. **SameSite attribute**: 
   - `Lax`: Chia sẻ session giữa các tab cùng domain
   - `None`: Cho phép cross-site (cần `Secure => true` nếu dùng HTTPS)

4. **Cookie domain**: Để trống (`''`) để tự động dùng domain hiện tại.

5. **Tự động đăng nhập lại**: Logic trong `_beforeFilterBackend()` sẽ tự động đăng nhập lại từ cookie nếu session hết hạn.

## Kiểm tra

Sau khi sửa, kiểm tra:
1. Đăng nhập vào admin
2. Mở tab mới và truy cập cùng domain
3. Tab mới phải tự động đăng nhập mà không cần đăng nhập lại

## Lưu ý bảo mật

- Nếu sử dụng HTTPS, đặt `secure => true` trong cấu hình cookie
- `httpOnly => true` để tránh XSS attacks
- `SameSite => Lax` hoặc `Strict` để tránh CSRF attacks
- Đảm bảo cookie key được bảo mật và không công khai

