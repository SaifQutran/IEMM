// بيانات مؤقتة للدردشة مع مدير المول - سيتم استبدالها بطلبات API
const mallManagerChat = {
  id: 1,
  name: "مدير المول",
  mallLogo: "https://api.example.com/mall/logo", // سيتم استبداله برابط API الفعلي
  online: true,
  messages: [
    {
      text: "مرحباً بك في نظام إدارة المول، كيف يمكنني مساعدتك؟",
      time: "10:00",
      sent: false,
      read: true
    }
  ]
};

// إضافة استماع لحدث تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
  initStoreChat();
});

// تهيئة الدردشة
function initStoreChat() {
  const chatToggleBtn = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatCloseBtn = document.getElementById('chat-close');
  const messagesContainer = document.getElementById('messages-container');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const mallLogo = document.getElementById('mall-logo');
  
  if (!chatToggleBtn || !chatPanel) return;
  
  // تحميل شعار المول من API
  loadMallLogo();

  // تبديل عرض لوحة الدردشة
  chatToggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    chatPanel.classList.toggle('active');
    if (chatPanel.classList.contains('active')) {
      renderMessages(mallManagerChat.messages);
      scrollToBottom();
    }
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

  // إرسال رسالة جديدة
  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // إضافة الرسالة إلى بيانات المستخدم
    mallManagerChat.messages.push({
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
    
    // محاكاة رد تلقائي بعد ثانيتين (في حالة المحاكاة فقط، سيتم استبداله بالاستجابة الفعلية من الخادم)
    sendTypingIndicator();
    
    setTimeout(() => {
      const autoReply = getAutoReply(message);
      
      mallManagerChat.messages.push(autoReply);
      renderMessage(autoReply);
      hideTypingIndicator();
      scrollToBottom();
    }, 2000);
  });

  // عرض الرسائل الموجودة
  renderMessages(mallManagerChat.messages);
  
  // جعل المحادثة قابلة للتمرير بشكل أوتوماتيكي
  messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    const newHeight = Math.min(this.scrollHeight, 100);
    this.style.height = newHeight + 'px';
  });

  // وظيفة تحميل شعار المول من API
  function loadMallLogo() {
    // في الحالة الواقعية، سيتم استبدال هذه الوظيفة بطلب API لتحميل الشعار
    const mallLogoUrl = mallManagerChat.mallLogo;
    
    if (mallLogo) {
      mallLogo.onerror = function() {
        // في حالة فشل تحميل الصورة، سيتم عرض الحرف الأول من اسم المول
        mallLogo.style.display = "none";
        createFallbackLogo();
      };
      
      mallLogo.src = mallLogoUrl;
    } else {
      createFallbackLogo();
    }
  }
  
  // إنشاء شعار بديل في حالة عدم وجود شعار
  function createFallbackLogo() {
    const logoContainer = document.querySelector('.mall-logo-container');
    
    if (!logoContainer) return;
    
    const fallbackLogo = document.createElement('div');
    fallbackLogo.className = 'mall-logo-fallback';
    fallbackLogo.textContent = "م"; // الحرف الأول من "مول"
    
    // إضافة الشعار البديل قبل العنوان
    const headerTitle = logoContainer.querySelector('h3');
    if (headerTitle) {
      logoContainer.insertBefore(fallbackLogo, headerTitle);
    } else {
      logoContainer.appendChild(fallbackLogo);
    }
  }

  // وظائف مساعدة
  
  // عرض رسائل المحادثة
  function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.forEach(message => {
      renderMessage(message);
    });
  }
  
  // عرض رسالة واحدة
  function renderMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.sent ? 'sent' : 'received'}`;
    
    messageEl.innerHTML = `
      <div class="message-content">${message.text}</div>
      <div class="message-time">${message.time}</div>
    `;
    
    messagesContainer.appendChild(messageEl);
  }
  
  // تمرير إلى أسفل المحادثة
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // الحصول على الوقت الحالي بتنسيق مناسب
  function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // إظهار مؤشر كتابة الرسالة
  function sendTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message received typing-indicator';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = `
      <div class="typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    messagesContainer.appendChild(typingIndicator);
    scrollToBottom();
  }
  
  // إخفاء مؤشر كتابة الرسالة
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // الحصول على رد تلقائي (محاكاة فقط)
  function getAutoReply(message) {
    const replies = [
      "شكراً لتواصلك، سأقوم بمراجعة طلبك والرد عليك في أقرب وقت.",
      "تم استلام رسالتك، وسيتم التعامل معها في أقرب وقت.",
      "مرحباً، سأقوم بالتحقق من هذا الأمر والعودة إليك قريباً.",
      "تم تسجيل طلبك، وسيتم متابعته من قبل الفريق المختص.",
      "شكراً لإبلاغنا بهذا، سنتواصل معك قريباً لمزيد من التفاصيل."
    ];
    
    // اختيار رد عشوائي من القائمة
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    return {
      text: randomReply,
      time: getCurrentTime(),
      sent: false
    };
  }
}

// إضافة CSS لمؤشر الكتابة والشعار البديل
const customStyles = document.createElement('style');
customStyles.textContent = `
  .typing-indicator {
    padding: 12px 16px;
    display: inline-block;
    background: var(--primary-green);
    color: white;
    max-width: 75%;
    border-radius: 18px;
    margin-bottom: 8px;
  }
  
  .typing-dots {
    display: flex;
    align-items: center;
    height: 20px;
  }
  
  .typing-dots .dot {
    background-color: rgba(255, 255, 255, 0.5);
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
    animation: blink 1.4s ease-in-out infinite;
  }
  
  .typing-dots .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-dots .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  .mall-logo-fallback {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #fff;
    color: var(--primary-green);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  @keyframes blink {
    0% { opacity: 0.1; }
    20% { opacity: 1; }
    100% { opacity: 0.1; }
  }
`;
document.head.appendChild(customStyles); 