class MallManagerChat {
    constructor() {
        this.baseUrl = 'http://localhost/IEMM/Back-end/public/api';
        this.currentChat = null;
        this.mallManagerId = 9;
        this.init();        
        // Initialize the chat after getting the mall manager ID
        // this.initializeChat();
    }

    // async initializeChat() {
    //     try {
    //         // Get current user (mall manager) information
    //         const response = await $.ajax({
    //             url: `${this.baseUrl}/auth/user`,
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json'
    //             }
    //         });

    //         if (response && response.id) {
    //             this.mallManagerId = response.id;
    //             console.log('Mall Manager ID loaded:', this.mallManagerId);
                
    //             // Initialize the chat UI after getting the ID
    //             if (document.readyState === 'loading') {
    //                 document.addEventListener('DOMContentLoaded', () => this.init());
    //             } else {
    //                 this.init();
    //             }
    //         } else {
    //             console.error('Failed to get Mall Manager ID');
    //         }
    //     } catch (error) {
    //         console.error('Err or getting Mall Manager ID:', error);
    //     }
    // }

    init() {
        // Get all required DOM elements
        this.chatToggleBtn = document.getElementById('chat-toggle');
        this.chatPanel = document.getElementById('chat-panel');
        this.chatCloseBtn = document.getElementById('chat-close');
        this.contactList = document.getElementById('contact-list');
        this.chatConversation = document.getElementById('chat-conversation');
        this.backToContactsBtn = document.getElementById('back-to-contacts');
        this.conversationTitle = document.getElementById('conversation-title');
        this.conversationStore = document.getElementById('conversation-store');
        this.conversationAvatar = document.getElementById('conversation-avatar');
        this.messagesContainer = document.getElementById('messages-container');
        this.messageForm = document.getElementById('message-form');
        this.messageInput = document.getElementById('message-input');

        // Check if required elements exist
        if (!this.chatToggleBtn || !this.chatPanel) {
            console.error('Required chat elements not found:', {
                chatToggleBtn: !!this.chatToggleBtn,
                chatPanel: !!this.chatPanel
            });
            return;
        }

        console.log('Chat elements found, setting up event listeners');
        this.setupEventListeners();
        this.loadChats();
    }

    setupEventListeners() {
        // Toggle chat panel
        this.chatToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Chat toggle clicked');
            this.chatPanel.classList.toggle('active');
            
            // If panel is now active, load chats
            if (this.chatPanel.classList.contains('active')) {
                this.loadChats();
            }
        });

        // Close chat panel
        if (this.chatCloseBtn) {
            this.chatCloseBtn.addEventListener('click', () => {
                console.log('Chat close clicked');
                this.chatPanel.classList.remove('active');
            });
        }

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.chatPanel && 
                this.chatPanel.classList.contains('active') && 
                !this.chatPanel.contains(e.target) && 
                e.target !== this.chatToggleBtn) {
                console.log('Clicking outside chat panel');
                this.chatPanel.classList.remove('active');
            }
        });

        // Prevent chat close when clicking inside
        if (this.chatPanel) {
            this.chatPanel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Back to contacts list
        if (this.backToContactsBtn) {
            this.backToContactsBtn.addEventListener('click', () => {
                const contactsView = document.getElementById('contacts-view');
                if (contactsView) {
                    contactsView.style.display = 'block';
                }
                if (this.chatConversation) {
                    this.chatConversation.classList.remove('active');
                }
            });
        }

        // Send message
        if (this.messageForm) {
            this.messageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
    }

    // Load all chats for the mall
    loadChats() {
        console.log('Loading chats...');
        $.ajax({
            url: `${this.baseUrl}/malls/1/chats`,
            method: 'GET',
            dataType: 'json',
            success: (response) => {
                console.log('Chats loaded:', response);
                this.renderContacts(response.data);
            },
            error: (xhr, status, error) => {
                console.error('Error loading chats:', error);
            }
        });
    }

    // Render contacts list
    renderContacts(contacts) {
        this.contactList.innerHTML = '';
        
        contacts.forEach(contact => {
            const contactEl = document.createElement('div');
            contactEl.className = 'contact-item';
            contactEl.dataset.id = contact.id;
            const unreadCountHtml = contact.unread_count > 0 
                ? `<div class="unread-count">${contact.unread_count}</div>` 
                : '';
            
            contactEl.innerHTML = `
                <div class="contact-avatar">
                    ${this.getStoreLogoElement(contact)}
                </div>
                <div class="contact-info">
                    <h4 class="contact-name">${contact.shop_owner_name}</h4>
                    <p class="contact-store">${contact.shop_name}</p>
                </div>
                ${unreadCountHtml}
            `;
            
            contactEl.addEventListener('click', () => {
                this.openConversation(contact);
            });
            
            this.contactList.appendChild(contactEl);
        });
    }

    // Get store logo or fallback to initial
    getStoreLogoElement(contact) {
        if (contact.shop_image_url) {
            return `<img src="${contact.shop_image_url}" 
                        alt="${contact.shop_name}" 
                        onerror="this.onerror=null; this.innerHTML='${contact.shop_owner_name.charAt(0)}'; this.classList.add('fallback-avatar')">`;
        }
        return contact.shop_owner_name.charAt(0);
    }

    // Open conversation with a shop
    openConversation(contact) {
        console.log(contact);
        document.getElementById('contacts-view').style.display = 'none';
        this.chatConversation.classList.add('active');
        this.chatConversation.dataset.contactId = contact.id;
        
        this.conversationTitle.textContent = contact.shop_owner_name;
        this.conversationStore.textContent = contact.shop_name;
        this.conversationAvatar.innerHTML = this.getStoreLogoElement(contact);
        
        this.loadMessages(contact.id);
        this.markMessagesAsRead(contact.id);
    }

    // Load messages for a conversation
    loadMessages(chatId) {
        $.ajax({
            url: `${this.baseUrl}/chats/${chatId}/messages`,
            method: 'GET',
            dataType: 'json',
            success: (response) => {
                console.log('Messages loaded:', response.data);
                this.renderMessages(response.data);
            },
            error: (xhr, status, error) => {
                console.error('Error loading messages:', error);
            }
        });
    }

    // Render messages in the conversation
    renderMessages(messages) {
        this.messagesContainer.innerHTML = '';
        
        messages.forEach(message => {
            this.renderMessage(message);
        });
        
        this.scrollToBottom();
    }

    // Render a single message
    renderMessage(message) {
        const messageEl = document.createElement('div');
        const isMallManager = message.sender_type === true;
        messageEl.className = `message ${isMallManager ? 'sent' : 'received'}`;
        messageEl.dataset.messageId = message.id;
        
        // Format the date to be more readable
        const messageDate = new Date(message.created_at);
        const formattedTime = messageDate.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // // Add message actions for mall manager's messages
        // const messageActions = isMallManager ? `
        //     <div class="message-actions">
        //         <button class="edit-message" title="تعديل">
        //             <i class="fas fa-edit"></i>
        //         </button>
        //         <button class="delete-message" title="حذف">
        //             <i class="fas fa-trash"></i>
        //         </button>
        //     </div>
        // ` : '';
        
        messageEl.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.content}</div>
                <div class="message-time">${formattedTime}</div>
            </div>
        `;
        
        // Add event listeners for edit and delete buttons
        // if (isMallManager) {
        //     const editBtn = messageEl.querySelector('.edit-message');
        //     const deleteBtn = messageEl.querySelector('.delete-message');
            
        //     editBtn.addEventListener('click', () => this.editMessage(message));
        //     deleteBtn.addEventListener('click', () => this.deleteMessage(message.id));
        // }
        
        this.messagesContainer.appendChild(messageEl);
    }

    // Edit a message
    editMessage(message) {
        const newContent = prompt('تعديل الرسالة:', message.content);
        if (newContent && newContent.trim() && newContent !== message.content) {
            $.ajax({
                url: `${this.baseUrl}/chats/${message.chat_id}/messages/${message.id}`,
                method: 'PUT',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: JSON.stringify({
                    content: newContent.trim()
                }),
                contentType: 'application/json',
                success: (response) => {
                    // Update the message in the UI
                    const messageEl = this.messagesContainer.querySelector(`[data-message-id="${message.id}"]`);
                    if (messageEl) {
                        const messageText = messageEl.querySelector('.message-text');
                        messageText.textContent = newContent.trim();
                    }
                },
                error: (xhr, status, error) => {
                    console.error('Error updating message:', error);
                    alert('حدث خطأ أثناء تحديث الرسالة');
                }
            });
        }
    }

    // Delete a message
    deleteMessage(messageId) {
        if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
            const chatId = this.chatConversation.dataset.contactId;
            $.ajax({
                url: `${this.baseUrl}/chats/${chatId}/messages/${messageId}`,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: () => {
                    // Remove the message from the UI
                    const messageEl = this.messagesContainer.querySelector(`[data-message-id="${messageId}"]`);
                    if (messageEl) {
                        messageEl.remove();
                    }
                },
                error: (xhr, status, error) => {
                    console.error('Error deleting message:', error);
                    alert('حدث خطأ أثناء حذف الرسالة');
                }
            });
        }
    }

    // Send a new message
    sendMessage() {
        if (!this.mallManagerId) {
            console.error('Mall Manager ID not available');
            return;
        }

        const message = this.messageInput.value.trim();
        if (!message) return;
        
        const chatId = this.chatConversation.dataset.contactId;
        
        $.ajax({
            url: `${this.baseUrl}/messages`,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify({ 
                sender_id: this.mallManagerId,
                chat_id: chatId,
                content: message,
                sender_type: true // true for MallManager
            }),
            contentType: 'application/json',
            success: (response) => {
                this.messageInput.value = '';
                this.renderMessage(response.data);
                this.scrollToBottom();
            },
            error: (xhr, status, error) => {
                console.error('Error sending message:', error);
            }
        });
    }

    // Mark messages as read
    markMessagesAsRead(chatId) {
        $.ajax({
            url: `${this.baseUrl}/chats/${chatId}/read`,
            method: 'PUT',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: () => {
                this.loadChats(); // Refresh contacts list to update unread count
            },
            error: (xhr, status, error) => {
                console.error('Error marking messages as read:', error);
            }
        });
    }

    // Scroll to bottom of messages
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // Initialize real-time updates
    initializeRealTimeUpdates(chatId) {
        setInterval(() => {
            this.loadMessages(chatId);
        }, 5000); // Poll every 5 seconds
    }

    // Add new method to send message to all shop owners
    sendMessageToAll(message) {
        if (!this.mallManagerId) {
            console.error('Mall Manager ID not available');
            alert('خطأ: لم يتم العثور على معرف مدير المول');
            return;
        }

        if (!message || message.trim() === '') {
            console.error('Message cannot be empty');
            alert('الرجاء إدخال نص الرسالة');
            return;
        }

        // Show loading state
        const submitButton = document.querySelector('#bulkMessageForm .btn-green');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        }

        // First get all chats
        $.ajax({
            url: `${this.baseUrl}/malls/1/chats`,
            method: 'GET',
            dataType: 'json',
            success: (response) => {
                const contacts = response.data;
                if (!contacts || contacts.length === 0) {
                    alert('لا يوجد محلات متاحة لإرسال الرسالة');
                    this.resetBulkMessageButton(submitButton);
                    return;
                }

                let successCount = 0;
                let failCount = 0;
                let completedCount = 0;

                // Send message to each contact
                contacts.forEach(contact => {
                    $.ajax({
                        url: `${this.baseUrl}/messages`,
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        data: JSON.stringify({ 
                            sender_id: this.mallManagerId,
                            chat_id: contact.id,
                            content: message,
                            sender_type: true // true for MallManager
                        }),
                        contentType: 'application/json',
                        success: () => {
                            successCount++;
                            completedCount++;
                            this.updateBulkMessageProgress(submitButton, completedCount, contacts.length);
                            
                            if (completedCount === contacts.length) {
                                this.showBulkMessageResult(successCount, failCount);
                                this.resetBulkMessageButton(submitButton);
                            }
                        },
                        error: (xhr, status, error) => {
                            console.error('Error sending message to contact:', error);
                            failCount++;
                            completedCount++;
                            this.updateBulkMessageProgress(submitButton, completedCount, contacts.length);
                            
                            if (completedCount === contacts.length) {
                                this.showBulkMessageResult(successCount, failCount);
                                this.resetBulkMessageButton(submitButton);
                            }
                        }
                    });
                });
            },
            error: (xhr, status, error) => {
                console.error('Error loading chats:', error);
                alert('حدث خطأ أثناء تحميل قائمة المحلات');
                this.resetBulkMessageButton(submitButton);
            }
        });
    }

    // Helper method to show bulk message result
    showBulkMessageResult(successCount, failCount) {
        const total = successCount + failCount;
        let message = '';
        
        if (successCount === total) {
            message = `تم إرسال الرسالة بنجاح إلى جميع المحلات (${total})`;
        } else if (failCount === total) {
            message = 'فشل إرسال الرسالة إلى جميع المحلات';
        } else {
            message = `تم إرسال الرسالة إلى ${successCount} من أصل ${total} محلات`;
        }
        
        alert(message);
    }

    // Helper method to update progress in the submit button
    updateBulkMessageProgress(button, completed, total) {
        if (button) {
            const percentage = Math.round((completed / total) * 100);
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري الإرسال... ${percentage}%`;
        }
    }

    // Helper method to reset the submit button
    resetBulkMessageButton(button) {
        if (button) {
            button.disabled = false;
            button.innerHTML = 'إرسال';
        }
    }
}

// Initialize chat when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing MallManagerChat');
    window.mallManagerChat = new MallManagerChat();
});
 