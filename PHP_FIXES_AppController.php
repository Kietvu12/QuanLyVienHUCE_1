<?php
/**
 * CÁC THAY ĐỔI CẦN THỰC HIỆN TRONG AppController.php
 * 
 * File này chứa các đoạn code cần thêm/sửa trong AppController.php
 * để khắc phục lỗi session không chia sẻ giữa các tab
 */

// ============================================
// THAY ĐỔI 1: Sửa method beforeFilter()
// ============================================
// Tìm method beforeFilter() (dòng 58) và THÊM vào đầu method:

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
    
    // ... phần code còn lại của beforeFilter() ...
    parent::beforeFilter();
    // ... rest of code ...
}

// ============================================
// THAY ĐỔI 2: Sửa method _beforeFilterBackend()
// ============================================
// Tìm method _beforeFilterBackend() (dòng 155) và THÊM vào đầu method:

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
    
    // ... phần code còn lại của _beforeFilterBackend() ...
    $this->Session->delete('lang');
    // ... rest of code ...
}

