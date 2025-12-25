<?php
/**
 * CÁC THAY ĐỔI CẦN THỰC HIỆN TRONG UsersController.php
 * 
 * File này chứa các đoạn code cần thêm/sửa trong UsersController.php
 * để khắc phục lỗi session không chia sẻ giữa các tab
 */

// ============================================
// THAY ĐỔI 1: Sửa method admin_login()
// ============================================
// Tìm method admin_login() (dòng 22) và THAY THẾ toàn bộ method:

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

// ============================================
// THAY ĐỔI 2: Sửa method admin_logout()
// ============================================
// Tìm method admin_logout() (dòng 268) và THAY THẾ toàn bộ method:

public function admin_logout()
{
    // Xóa cookie remember me
    $this->Cookie->name = 'oneweb';
    $this->Cookie->delete('auth_remember');
    
    $this->_deleteCache();
    $this->redirect($this->Auth->logout());
}

