// بيانات مؤقتة للمحلات وأصحابها - سيتم استبدالها بطلبات API
const storeContacts = [
  {
    id: 1,
    name: "أحمد محمد",
    store: "مطعم الأصالة",
    logoUrl: "https://api.example.com/store-logos/1", // سيتم استبداله برابط API الفعلي
    unreadCount: 2,
    online: true,
    messages: [
      {
        text: "مرحباً، لدي استفسار بخصوص فاتورة الكهرباء الأخيرة",
        time: "10:30",
        sent: false,
        read: false
      },
      {
        text: "أهلاً أحمد، ما هو استفسارك؟",
        time: "10:32",
        sent: true,
        read: true
      },
      {
        text: "هل يمكنني تقسيط المبلغ على دفعتين؟",
        time: "10:35",
        sent: false,
        read: false
      }
    ]
  },
  {
    id: 2,
    name: "سارة خالد",
    store: "بوتيك الأناقة",
    logo: "../assets/images/stores/boutique-logo.png",
    unreadCount: 1,
    online: true,
    messages: [
      {
        text: "متى سيتم الانتهاء من صيانة التكييف؟",
        time: "09:15",
        sent: false,
        read: false
      },
      {
        text: "سيتم الانتهاء غداً إن شاء الله",
        time: "09:20",
        sent: true,
        read: true
      }
    ]
  },
  {
    id: 3,
    name: "محمد علي",
    store: "ماركت الميزان",
    logo: "../assets/images/stores/market-logo.png",
    unreadCount: 0,
    online: false,
    messages: [
      {
        text: "أحتاج إلى تجديد عقد الإيجار",
        time: "أمس",
        sent: false,
        read: true
      }
    ]
  },
  {
    id: 4,
    name: "فاطمة أحمد",
    store: "صيدلية الصحة",
    logo: "../assets/images/stores/pharmacy-logo.png",
    unreadCount: 0,
    online: true,
    messages: []
  },
  {
    id: 5,
    name: "خالد عبدالله",
    store: "مكتبة المعرفة",
    logo: "../assets/images/stores/bookstore-logo.png",
    unreadCount: 0,
    online: false,
    messages: []
  }
];

// إضافة استماع لحدث تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
  initChat();
  applyNightModeFromCookie();
  const nightModeBtn = document.querySelector('.btn-dark');
  if (nightModeBtn) {
    nightModeBtn.onclick = function () {
      document.body.classList.toggle('dark');
      setCookie('nightMode', document.body.classList.contains('dark') ? 'on' : 'off', 365);
    };
  }
});

// تهيئة الدردشة
function initChat() {
  const chatToggleBtn = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatCloseBtn = document.getElementById('chat-close');
  const contactList = document.getElementById('contact-list');
  const chatConversation = document.getElementById('chat-conversation');
  const backToContactsBtn = document.getElementById('back-to-contacts');
  const conversationTitle = document.getElementById('conversation-title');
  const conversationStore = document.getElementById('conversation-store');
  const conversationAvatar = document.getElementById('conversation-avatar');
  const messagesContainer = document.getElementById('messages-container');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  
  if (!chatToggleBtn || !chatPanel) return;

  // تبديل عرض لوحة الدردشة
  chatToggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    chatPanel.classList.toggle('active');
  });

  // إغلاق لوحة الدردشة
  chatCloseBtn.addEventListener('click', function() {
    chatPanel.classList.remove('active');
  });

  // إغلاق الدردشة عند النقر خارجها
  document.addEventListener('click', function(e) {
    if (chatPanel.classList.contains('active') && 
        !chatPanel.contains(e.target) && 
        e.target !== chatToggleBtn) {
      chatPanel.classList.remove('active');
    }
  });

  // منع إغلاق الدردشة عند النقر داخلها
  chatPanel.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // إنشاء قائمة جهات الاتصال
  renderContacts();

  // العودة إلى قائمة جهات الاتصال
  backToContactsBtn.addEventListener('click', function() {
    document.getElementById('contacts-view').style.display = 'block';
    chatConversation.classList.remove('active');
  });

  // إرسال رسالة جديدة
  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    const activeContactId = parseInt(chatConversation.dataset.contactId);
    const contact = storeContacts.find(c => c.id === activeContactId);
    
    if (contact) {
      // إضافة الرسالة إلى بيانات المستخدم
      contact.messages.push({
        text: message,
        time: getCurrentTime(),
        sent: true
      });
      
      // عرض الرسالة
      renderMessage({
        text: message,
        time: getCurrentTime(),
        sent: true
      });
      
      // مسح حقل الإدخال
      messageInput.value = '';
      
      // تمرير إلى آخر الرسائل
      scrollToBottom();
      
      // محاكاة رد تلقائي بعد ثانيتين
      setTimeout(() => {
        const autoReply = {
          text: "تم استلام رسالتك، وسنتواصل معك قريباً.",
          time: getCurrentTime(),
          sent: false
        };
        
        contact.messages.push(autoReply);
        renderMessage(autoReply);
        scrollToBottom();
      }, 2000);
    }
  });

  // وظائف مساعدة
  
  // وظيفة مساعدة للتعامل مع صور المحلات
  function getStoreLogoElement(contact) {
    if (contact.logoUrl) {
      return `<img src="${contact.logoUrl}" 
                   alt="${contact.store}" 
                   onerror="this.onerror=null; this.innerHTML='${contact.name.charAt(0)}'; this.classList.add('fallback-avatar')">`
    }
    return contact.name.charAt(0);
  }

  // عرض قائمة جهات الاتصال
  function renderContacts() {
    contactList.innerHTML = '';
    
    storeContacts.forEach(contact => {
      const contactEl = document.createElement('div');
      contactEl.className = 'contact-item';
      contactEl.dataset.id = contact.id;
      
      const unreadCountHtml = contact.unreadCount && contact.unreadCount > 0 
        ? `<div class="unread-count">${contact.unreadCount}</div>` 
        : '';
      
      contactEl.innerHTML = `
        <div class="contact-avatar">
          ${getStoreLogoElement(contact)}
        </div>
        <div class="contact-info">
          <h4 class="contact-name">${contact.name}</h4>
          <p class="contact-store">${contact.store}</p>
        </div>
        ${unreadCountHtml}
      `;
      
      contactEl.addEventListener('click', function() {
        openConversation(contact);
      });
      
      contactList.appendChild(contactEl);
    });
  }
  
  // فتح محادثة مع جهة اتصال
  function openConversation(contact) {
    document.getElementById('contacts-view').style.display = 'none';
    chatConversation.classList.add('active');
    chatConversation.dataset.contactId = contact.id;
    
    conversationTitle.textContent = contact.name;
    conversationStore.textContent = contact.store;
    
    conversationAvatar.innerHTML = getStoreLogoElement(contact);
    
    renderMessages(contact.messages);
    markMessagesAsRead(contact);
  }
  
  // عرض رسائل المحادثة
  function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
      renderMessage(message);
    });
    
    scrollToBottom();
  }
  
  // عرض رسالة واحدة
  function renderMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.sent ? 'sent' : 'received'}`;
    
    messageEl.innerHTML = `
      <div class="message-text">${message.text}</div>
      <div class="message-time">${message.time}</div>
    `;
    
    messagesContainer.appendChild(messageEl);
  }
  
  // تمرير إلى آخر الرسائل
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // الحصول على الوقت الحالي بتنسيق HH:MM
  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  function markMessagesAsRead(contact) {
    contact.messages.forEach(message => {
      if (!message.sent) {
        message.read = true;
      }
    });
    contact.unreadCount = 0;
    
    renderContacts();
  }
}

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

function applyNightModeFromCookie() {
  const nightMode = getCookie('nightMode');
  if (nightMode === 'on') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
} 