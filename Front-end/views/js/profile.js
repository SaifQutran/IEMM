class ProfileManager {
  constructor() {
    this.modal = document.getElementById('profile-modal');
    this.toggleBtn = document.getElementById('profile-toggle');
    this.closeBtn = document.getElementById('profile-close');
    this.notification = document.getElementById('profile-notification');
    this.editButtons = document.querySelectorAll('.edit-btn');
    
    this.profileData = {
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966 50 123 4567',
      address: 'الرياض، المملكة العربية السعودية',
      image: '../assets/default-profile.png'
    };

    this.missingFields = this.checkMissingFields();
    this.initializeEventListeners();
    this.updateNotificationDot();
  }

  initializeEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.toggleModal());
    this.closeBtn.addEventListener('click', () => this.closeModal());
    window.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    this.editButtons.forEach(btn => {
      btn.addEventListener('click', () => this.handleEdit(btn.dataset.field));
    });
  }

  toggleModal() {
    this.modal.style.display = this.modal.style.display === 'none' ? 'block' : 'none';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  handleOutsideClick(event) {
    if (event.target === this.modal) {
      this.closeModal();
    }
  }

  handleEdit(field) {
    if (field === 'phone') {
      const currentValue = this.profileData.phone;
      const newValue = prompt('أدخل رقم الهاتف الجديد:', currentValue);
      if (newValue && newValue !== currentValue) {
        this.updateField('phone', newValue);
      }
      return;
    }
    if (field === 'password') {
      this.openPasswordModal();
      return;
    }
    const currentValue = this.profileData[field];
    let newValue;

    if (field === 'image') {
      // Simulate file upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // Here you would typically upload the file to a server
          // For now, we'll just update the image preview
          const reader = new FileReader();
          reader.onload = (e) => {
            document.getElementById('profile-image').src = e.target.result;
            this.profileData.image = e.target.result;
            this.updateField(field, e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    // إذا كان الحقل هو كلمة السر، لا تستخدم prompt بل اعتمد على نافذة التغيير المخصصة
    // if (field === 'password') {
    //   if (typeof openPasswordModal === 'function') {
    //     openPasswordModal();
    //   }
    //   return;
    // }

    // إذا كان الحقل هو رقم الهاتف، فعّل التعديل المباشر في نفس الحقل
    if (field === 'phone') {
      const phoneSpan = document.getElementById('profile-phone');
      const editBtn = Array.from(this.editButtons).find(btn => btn.dataset.field === 'phone');
      if (!phoneSpan || !editBtn) return;
      // أنشئ input جديد بنفس القيمة
      const input = document.createElement('input');
      input.type = 'tel';
      input.value = currentValue;
      input.style.fontSize = '1rem';
      input.style.width = '140px';
      input.style.direction = 'ltr';
      input.style.marginLeft = '8px';
      // غيّر الأيقونة إلى حفظ
      const icon = editBtn.querySelector('i');
      icon.classList.remove('fa-edit');
      icon.classList.add('fa-save');
      // عند الضغط على زر الحفظ
      function save() {
        const newVal = input.value.trim();
        if (newVal && newVal !== currentValue) {
          phoneSpan.textContent = newVal;
          window.profileManager.profileData.phone = newVal;
          window.profileManager.updateNotificationDot();
        } else {
          phoneSpan.textContent = currentValue;
        }
        // إعادة الأيقونة لوضع التعديل
        icon.classList.remove('fa-save');
        icon.classList.add('fa-edit');
        // إعادة تفعيل زر التعديل
        editBtn.onclick = null;
        editBtn.addEventListener('click', () => window.profileManager.handleEdit('phone'));
      }
      // عند فقدان التركيز أو الضغط Enter يتم الحفظ
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          save();
        }
      });
      // عند الضغط على زر الحفظ
      editBtn.onclick = function(e) {
        e.preventDefault();
        save();
      };
      // استبدل العنصر النصي بالinput
      phoneSpan.textContent = '';
      phoneSpan.appendChild(input);
      input.focus();
      return;
    }

    // باقي الحقول تستخدم prompt
    // newValue = prompt(`تعديل ${field}:`, currentValue);
    // if (newValue && newValue !== currentValue) {
    //   this.updateField(field, newValue);
    // }
  }

  updateField(field, value) {
    this.profileData[field] = value;
    const element = document.getElementById(`profile-${field}`);
    if (element) {
      element.textContent = value;
    }

    this.missingFields = this.checkMissingFields();
    this.updateNotificationDot();

    // Here you would typically send the update to a server
    console.log(`Updated ${field} to:`, value);
  }

  checkMissingFields() {
    return Object.entries(this.profileData)
      .filter(([key, value]) => !value || value === '../assets/default-profile.png')
      .map(([key]) => key);
  }

  updateNotificationDot() {
    if (this.missingFields.length > 0) {
      this.notification.style.display = 'block';
      this.toggleBtn.title = `معلومات ناقصة: ${this.missingFields.join(', ')}`;
    } else {
      this.notification.style.display = 'none';
      this.toggleBtn.title = 'الملف الشخصي';
    }
  }

  openPasswordModal() {
    let modal = document.getElementById('password-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'password-modal';
      modal.className = 'profile-modal';
      modal.innerHTML = `
        <div class="profile-content">
          <div class="profile-header">
            <h3>تغيير كلمة السر</h3>
            <button class="profile-close-btn" id="password-close"><i class="fas fa-times"></i></button>
          </div>
          <div class="profile-body">
            <form id="password-form">
              <div class="form-group">
                <label>كلمة السر الحالية</label>
                <input type="password" id="current-password" required />
              </div>
              <div class="form-group">
                <label>كلمة السر الجديدة</label>
                <input type="password" id="new-password" minlength="8" required />
              </div>
              <div class="form-group">
                <label>تأكيد كلمة السر الجديدة</label>
                <input type="password" id="confirm-password" minlength="8" required />
              </div>
              <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button type="button" class="btn-secondary" id="cancel-password">إلغاء</button>
                <button type="submit" class="btn-green">تغيير كلمة السر</button>
              </div>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      modal.style.display = 'block';
    }
    // إغلاق النافذة
    document.getElementById('password-close').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('cancel-password').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('password-form').onsubmit = (e) => {
      e.preventDefault();
      const current = document.getElementById('current-password').value;
      const newPass = document.getElementById('new-password').value;
      const confirm = document.getElementById('confirm-password').value;
      if (newPass.length < 8) {
        alert('كلمة السر يجب أن تكون 8 أحرف على الأقل.');
        return;
      }
      if (newPass !== confirm) {
        alert('تأكيد كلمة السر غير متطابق.');
        return;
      }
      // هنا من المفترض إرسال الطلب للسيرفر للتحقق والتغيير
      this.updateField('password', '********');
      alert('تم تغيير كلمة السر بنجاح!');
      modal.style.display = 'none';
    };
  }
}

// Initialize the profile manager when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.profileManager = new ProfileManager();
});