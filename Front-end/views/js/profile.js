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

    newValue = prompt(`تعديل ${field}:`, currentValue);
    
    if (newValue && newValue !== currentValue) {
      this.updateField(field, newValue);
    }
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
}

// Initialize the profile manager when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.profileManager = new ProfileManager();
});

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
