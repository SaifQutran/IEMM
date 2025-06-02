const API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/1/money-logs';

// Add these functions at the class level, before the MoneyLogsManager class
// function showDeleteModal(message, onConfirm) {
//     // Set the message
//     $('#delete-confirm-message').text(message);
    
//     // Show the modal
//     $('#delete-confirm-modal').css('display', 'block');
    
//     // Handle delete button click
//     $('#delete-confirm-modal .btn-secondary').off('click').on('click', function() {
//         onConfirm();
//         $('#delete-confirm-modal').css('display', 'none');
//     });
    
//     // Handle cancel button click
//     $('#delete-confirm-modal .btn-green').off('click').on('click', function() {
//         $('#delete-confirm-modal').css('display', 'none');
//     });
    
//     // Handle close button click
//     $('#delete-confirm-modal .close-modal').off('click').on('click', function() {
//         $('#delete-confirm-modal').css('display', 'none');
//     });
    
//     // Handle click outside modal
//     $(window).off('click').on('click', function(event) {
//         if ($(event.target).is('#delete-confirm-modal')) {
//             $('#delete-confirm-modal').css('display', 'none');
//         }
//     });
// }

class MoneyLogsManager {
    constructor() {
        this.initializeEventListeners();
        this.loadMoneyLogs();
        this.loadShopsForDropdown();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Handle new bill form submission
        $('#newInvoiceFormContainer').on('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const billData = {
                shop_id: formData.get('shop_id'),
                rent_amount: formData.get('rent_amount'),
                electricity_amount: formData.get('electricity_amount'),
                water_amount: formData.get('water_amount'),
                date: formData.get('date')
            };
            this.createMoneyLog(billData);
        });
        
        // Handle modal close buttons
        $('.modal .btn-secondary').on('click', function() {
            $(this).closest('.modal').hide();
        });
    }


    // Load all money logs
    loadMoneyLogs() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                const billsTable = $('table tbody.bills-table');
                billsTable.empty();
                Object.entries(response.data).forEach(([shopID, months]) => {
                    Object.entries(months).forEach(([month, bill]) => {
                        const row = `
                            <tr>
                                <td>${bill.shop_name || ''}</td>
                                <td>${bill.shop_owner_name || ''}</td>
                                <td>${bill.electricity_total_remaining}</td>
                                <td>${bill.water_total_remaining}</td>
                                <td>${bill.rent_total_remaining}</td>
                                <td>${bill.month || ''}</td>
                                <td>${bill.remaining_total}</td>
                                <td>${bill.total}</td>
                                <td>
                                    <button
                                        class="btn-icon"
                                        title="عرض التفاصيل"
                                        onclick="viewInvoice('${shopID}', '${month}')"
                                    >
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        billsTable.append(row);
                    }); 
                });

            },
            error: (xhr, status, error) => {
                let errorMessage = 'حدث خطأ أثناء تحميل بيانات الفواتير';
                
                if (xhr.status === 401) {
                    errorMessage = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
                    window.location.href = '../login.html';
                } else if (xhr.status === 403) {
                    errorMessage = 'ليس لديك صلاحية للوصول إلى هذه البيانات';
                } else if (xhr.status === 404) {
                    errorMessage = 'لم يتم العثور على البيانات المطلوبة';
                } else if (xhr.status === 500) {
                    errorMessage = 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى لاحقاً';
                }

                alert(errorMessage);
                console.error('XHR Status:', xhr.status);
                console.error('Error Status:', status);
                console.error('Error Message:', error);
            }
        });
    }
    loadShopsForDropdown() {
        $.ajax({
            url: "http://localhost/IEMM/Back-end/public/api/malls/1/shops",
            method: 'GET',
            success: (response) => {
                const shopSelect = $('select[name="shop_id"]');
                shopSelect.empty();
                shopSelect.append('<option value="">اختر المحل </option>');
                response.data.forEach(shop => {
                        shopSelect.append(`<option value="${shop.id}"> ${shop.id} - ${shop.name}</option>`);                    
                });
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحميل بيانات المرافق');
                console.error(error);
            }
        });
    }
    // Create a new money log
    createMoneyLog(billData) {
        $.ajax({
            url: "http://localhost/IEMM/Back-end/public/api/money-logs",
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(billData),
            success: (response) => {
                alert('تم إضافة الفاتورة بنجاح');
                this.loadMoneyLogs();
                this.closeModal('newBillFormContainer');
                $('#newBillFormContainer form')[0].reset();
            },
            error: (xhr, status, error) => {
                let errorMessage = 'حدث خطأ أثناء إضافة الفاتورة';
                
                if (xhr.status === 400) {
                    errorMessage = 'بيانات الفاتورة غير صحيحة';
                } else if (xhr.status === 401) {
                    errorMessage = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
                    window.location.href = '../login.html';
                } else if (xhr.status === 422) {
                    const response = JSON.parse(xhr.responseText);
                    errorMessage = response.message || 'بيانات الفاتورة غير صالحة';
                }

                alert(errorMessage);
                console.error('XHR Status:', xhr.status);
                console.error('Error Status:', status);
                console.error('Error Message:', error);
            }
        });
    }

        // Delete a money log
        // deleteMoneyLog(logId) {
        //     showDeleteModal('هل أنت متأكد من حذف هذه الفاتورة؟', () => {
        //         $.ajax({
    //             url: `${API_URL}/${logId}`,
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': 'Bearer ' + localStorage.getItem('token')
    //             },
    //             success: (response) => {
    //                 alert('تم حذف الفاتورة بنجاح');
    //                 this.loadMoneyLogs();
    //             },
    //             error: (xhr, status, error) => {
    //                 let errorMessage = 'حدث خطأ أثناء حذف الفاتورة';
                    
    //                 if (xhr.status === 401) {
    //                     errorMessage = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
    //                     window.location.href = '../login.html';
    //                 } else if (xhr.status === 404) {
    //                     errorMessage = 'لم يتم العثور على الفاتورة المطلوبة';
    //                 } else if (xhr.status === 403) {
    //                     errorMessage = 'ليس لديك صلاحية لحذف هذه الفاتورة';
    //                 }

    //                 alert(errorMessage);
    //                 console.error('XHR Status:', xhr.status);
    //                 console.error('Error Status:', status);
    //                 console.error('Error Message:', error);
    //             }
    //         });
    //     });
    // }

    // Helper function to close modals
    closeModal(modalId) {
        $(`#${modalId}`).hide();
    }

}

// Initialize money logs manager when document is ready
$(document).ready(() => {
    window.moneyLogsManager = new MoneyLogsManager();
});

// // Add click handlers for delete buttons
// $(document).on('click', '.btn-icon[title="حذف"]', function() {
//     const row = $(this).closest('tr');
//     const id = row.find('td:first').text(); // Get the ID from the first column
//     window.moneyLogsManager.deleteMoneyLog(id);
// });

// Function to view invoice details
function viewInvoice(shopId, month) {
    // Get the invoice data from the API
    fetch(`http://localhost/IEMM/Back-end/public/api/malls/1/money-logs`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const shopData = data.data[shopId][month];
                if (shopData) {
                    updateInvoiceModal(shopData);
                    document.getElementById('invoiceDetailsModal').style.display = 'block';
                } else {
                    alert('No invoice data found for this month');
                }
            } else {
                alert(data.message || 'Failed to load invoice data');
            }
        })
        .catch(error => {
            console.error('Error fetching invoice data:', error);
            alert('Failed to load invoice data');
        });
}

// Function to update the invoice modal with data
function updateInvoiceModal(data) {
    // Update shop information
    document.getElementById('shop-name').textContent = data.shop_name || '';
    document.getElementById('shop-owner-name').textContent = data.shop_owner_name || '';
    
    // Update rent information
    document.getElementById('rent-current').textContent = formatCurrency(data.rent_month || 0);
    document.getElementById('rent-remaining').textContent = formatCurrency(data.rent_total_remaining || 0);
    document.getElementById('rent-total').textContent = formatCurrency((data.rent_month || 0) + (data.rent_total_remaining || 0));
    
    // Update electricity information
    document.getElementById('electricity-current').textContent = formatCurrency(data.electricity_month || 0);
    document.getElementById('electricity-remaining').textContent = formatCurrency(data.electricity_total_remaining || 0);
    document.getElementById('electricity-total').textContent = formatCurrency((data.electricity_month || 0) + (data.electricity_total_remaining || 0));
    
    // Update water information
    document.getElementById('water-current').textContent = formatCurrency(data.water_month || 0);
    document.getElementById('water-remaining').textContent = formatCurrency(data.water_total_remaining || 0);
    document.getElementById('water-total').textContent = formatCurrency((data.water_month || 0) + (data.water_total_remaining || 0));
    
    // Update grand total
    document.getElementById('grand-total').textContent = formatCurrency(data.total || 0);
    
    // Store the current data for editing
    window.currentInvoiceData = data;
}

// Function to update invoice data
function updateInvoiceData(section, key, value) {
    if (!window.currentInvoiceData) return;

    const data = window.currentInvoiceData;
    let updateData = {
        shop_id: data.shop_id,
        date: data.month,
        type_id: 1,
        water_amount: data.water_month || 0,
        electricity_amount: data.electricity_month || 0,
        rent_amount: data.rent_month || 0
    };

    // Update all fields at once based on the section
    switch (section) {
        case 'rent':
            updateData.rent_amount = parseFloat(value) || 0;
            data.rent_month = parseFloat(value) || 0;
            break;
        case 'electricity':
            updateData.electricity_amount = parseFloat(value) || 0;
            data.electricity_month = parseFloat(value) || 0;
            break;
        case 'water':
            updateData.water_amount = parseFloat(value) || 0;
            data.water_month = parseFloat(value) || 0;
            break;
    }

    // Send update to server
    $.ajax({
        url: "http://localhost/IEMM/Back-end/public/api/money-logs",
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(updateData),
        success: (response) => {
            if (response.status === 'success') {
                showSuccess('تم تحديث البيانات بنجاح');
                // Reload money logs to get fresh data
                window.moneyLogsManager.loadMoneyLogs();
                // Close the modal after successful update
                closeModal('invoiceDetailsModal');
            } else {
                showError(response.message || 'فشل في تحديث البيانات');
            }
        },
        error: (xhr, status, error) => {
            let errorMessage = 'حدث خطأ أثناء تحديث البيانات';
            
            if (xhr.status === 401) {
                errorMessage = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
                window.location.href = '../login.html';
            } else if (xhr.status === 422) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMessage = response.message || 'بيانات غير صالحة';
                } catch (e) {
                    errorMessage = 'بيانات غير صالحة';
                }
            }

            showError(errorMessage);
            console.error('XHR Status:', xhr.status);
            console.error('Error Status:', status);
            console.error('Error Message:', error);
        }
    });
}

// Function to update totals
function updateTotals(data) {
    // Update section totals
    document.getElementById('rent-total').textContent = formatCurrency(data.rent_month + data.rent_total_remaining);
    document.getElementById('electricity-total').textContent = formatCurrency(data.electricity_month + data.electricity_total_remaining);
    document.getElementById('water-total').textContent = formatCurrency(data.water_month + data.water_total_remaining);
    
    // Update grand total
    const grandTotal = (data.rent_month + data.rent_total_remaining) +
                      (data.electricity_month + data.electricity_total_remaining) +
                      (data.water_month + data.water_total_remaining);
    document.getElementById('grand-total').textContent = formatCurrency(grandTotal);
}

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2
    }).format(amount);
}

// Function to download PDF
function downloadPDF() {
    if (!window.currentInvoiceData) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });
    
    // Set RTL support and Arabic font
    doc.setR2L(true);
    doc.setFont('helvetica', 'normal');
    
    // Set colors
    const primaryColor = '#1e40af';
    const secondaryColor = '#64748b';
    const borderColor = '#e2e8f0';
    
    // Add header with logo
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add title
    doc.setFontSize(28);
    doc.setTextColor('#ffffff');
    doc.text('فاتورة', 190, 25, { align: 'right' });
    
    // Add date
    doc.setFontSize(12);
    doc.setTextColor('#ffffff');
    const today = new Date().toLocaleDateString('ar-SA');
    doc.text(`تاريخ الإصدار: ${today}`, 190, 35, { align: 'right' });
    
    // Add store information section
    doc.setFillColor('#f8fafc');
    doc.rect(10, 50, 190, 30, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text('معلومات المحل', 190, 60, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text(`اسم المحل: ${window.currentInvoiceData.shop_name}`, 190, 70, { align: 'right' });
    doc.text(`اسم صاحب المحل: ${window.currentInvoiceData.shop_owner_name}`, 190, 75, { align: 'right' });
    
    // Add bill details
    const startY = 90;
    const sectionHeight = 45;
    
    // Helper function to format currency in Arabic
    const formatCurrencyArabic = (amount) => {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
            minimumFractionDigits: 2
        }).format(amount);
    };
    
    // Electricity section
    addBillSection(doc, 'الكهرباء', {
        current: formatCurrencyArabic(window.currentInvoiceData.electricity_month || 0),
        overdue: formatCurrencyArabic(window.currentInvoiceData.electricity_total_remaining || 0),
        total: formatCurrencyArabic((window.currentInvoiceData.electricity_month || 0) + (window.currentInvoiceData.electricity_total_remaining || 0))
    }, startY, primaryColor, secondaryColor);
    
    // Water section
    addBillSection(doc, 'الماء', {
        current: formatCurrencyArabic(window.currentInvoiceData.water_month || 0),
        overdue: formatCurrencyArabic(window.currentInvoiceData.water_total_remaining || 0),
        total: formatCurrencyArabic((window.currentInvoiceData.water_month || 0) + (window.currentInvoiceData.water_total_remaining || 0))
    }, startY + sectionHeight, primaryColor, secondaryColor);
    
    // Rent section
    addBillSection(doc, 'الإيجار', {
        current: formatCurrencyArabic(window.currentInvoiceData.rent_month || 0),
        overdue: formatCurrencyArabic(window.currentInvoiceData.rent_total_remaining || 0),
        total: formatCurrencyArabic((window.currentInvoiceData.rent_month || 0) + (window.currentInvoiceData.rent_total_remaining || 0))
    }, startY + (sectionHeight * 2), primaryColor, secondaryColor);
    
    // Add grand total
    const grandTotalY = startY + (sectionHeight * 3) + 10;
    doc.setFillColor(primaryColor);
    doc.rect(10, grandTotalY - 10, 190, 25, 'F');
    
    doc.setFontSize(18);
    doc.setTextColor('#ffffff');
    doc.text('الإجمالي الكلي', 190, grandTotalY, { align: 'right' });
    doc.text(formatCurrencyArabic(window.currentInvoiceData.total || 0), 20, grandTotalY, { align: 'left' });
    
    // Add footer
    const footerY = 280;
    doc.setFillColor('#f8fafc');
    doc.rect(0, footerY, 210, 20, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.text('IEMM - نظام إدارة المولات', 190, footerY + 10, { align: 'right' });
    doc.text('هذا المستند تم إنشاؤه تلقائياً', 20, footerY + 10, { align: 'left' });
    
    // Add page number
    doc.setFontSize(8);
    doc.text('صفحة 1 من 1', 105, footerY + 10, { align: 'center' });
    
    // Save the PDF
    doc.save(`فاتورة_${window.currentInvoiceData.shop_name}_${today}.pdf`);
}

// Helper function to add a bill section
function addBillSection(doc, title, data, startY, primaryColor, secondaryColor) {
    // Add section background
    doc.setFillColor('#ffffff');
    doc.rect(10, startY - 5, 190, 40, 'F');
    
    // Add section border
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, startY - 5, 190, 40);
    
    // Add section title
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text(title, 190, startY + 5, { align: 'right' });
    
    // Add section content
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text(`مبلغ الشهر الحالي: ${data.current}`, 190, startY + 15, { align: 'right' });
    doc.text(`المتأخرات: ${data.overdue}`, 190, startY + 25, { align: 'right' });
    
    // Add section total
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text(`الإجمالي: ${data.total}`, 190, startY + 35, { align: 'right' });
}

// Function to show error message
function showError(message) {
    alert(message);
}

// Function to show success message
function showSuccess(message) {
    alert(message);
}

// Function to open modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to toggle edit mode for different sections
function toggleEditMode(section) {
    const sections = {
        'store-info': {
            name: 'shop-name',
            owner: 'shop-owner-name'
        },
        'rent': {
            current: 'rent-current',
            remaining: 'rent-remaining'
        },
        'electricity': {
            current: 'electricity-current',
            remaining: 'electricity-remaining'
        },
        'water': {
            current: 'water-current',
            remaining: 'water-remaining'
        }
    };

    const sectionData = sections[section];
    if (!sectionData) return;

    // Toggle visibility of inputs and values
    Object.entries(sectionData).forEach(([key, id]) => {
        const valueElement = document.getElementById(id);
        const inputElement = document.getElementById(`${id}-input`);
        const editButton = document.getElementById(`${id}-edit`);
        const saveButton = document.getElementById(`${id}-save`);
        const cancelButton = document.getElementById(`${id}-cancel`);
        
        if (valueElement && inputElement) {
            const isEditing = valueElement.style.display === 'none';
            
            if (isEditing) {
                // Save changes
                const newValue = inputElement.value;
                if (newValue === '' || isNaN(newValue)) {
                    showError('الرجاء إدخال قيمة صحيحة');
                    return;
                }
                valueElement.textContent = formatCurrency(newValue);
                valueElement.style.display = 'inline';
                inputElement.style.display = 'none';
                
                // Show edit button, hide save and cancel buttons
                if (editButton) editButton.style.display = 'inline';
                if (saveButton) saveButton.style.display = 'none';
                if (cancelButton) cancelButton.style.display = 'none';
                
                // Update the data
                updateInvoiceData(section, key, newValue);
            } else {
                // Start editing
                const currentValue = parseFloat(valueElement.textContent.replace(/[^0-9.-]+/g, '')) || 0;
                inputElement.value = currentValue;
                valueElement.style.display = 'none';
                inputElement.style.display = 'inline';
                
                // Hide edit button, show save and cancel buttons
                if (editButton) editButton.style.display = 'none';
                if (saveButton) saveButton.style.display = 'inline';
                if (cancelButton) cancelButton.style.display = 'inline';
            }
        }
    });
}

// Function to cancel edit
function cancelEdit(section) {
    const sections = {
        'store-info': {
            name: 'shop-name',
            owner: 'shop-owner-name'
        },
        'rent': {
            current: 'rent-current',
            remaining: 'rent-remaining'
        },
        'electricity': {
            current: 'electricity-current',
            remaining: 'electricity-remaining'
        },
        'water': {
            current: 'water-current',
            remaining: 'water-remaining'
        }
    };

    const sectionData = sections[section];
    if (!sectionData) return;

    Object.entries(sectionData).forEach(([key, id]) => {
        const valueElement = document.getElementById(id);
        const inputElement = document.getElementById(`${id}-input`);
        const editButton = document.getElementById(`${id}-edit`);
        const saveButton = document.getElementById(`${id}-save`);
        const cancelButton = document.getElementById(`${id}-cancel`);
        
        if (valueElement && inputElement) {
            // Restore original value
            valueElement.style.display = 'inline';
            inputElement.style.display = 'none';
            
            // Show edit button, hide save and cancel buttons
            if (editButton) editButton.style.display = 'inline';
            if (saveButton) saveButton.style.display = 'none';
            if (cancelButton) cancelButton.style.display = 'none';
        }
    });
}

// Function to save edit
function saveEdit(section) {
    const sections = {
        'store-info': {
            name: 'shop-name',
            owner: 'shop-owner-name'
        },
        'rent': {
            current: 'rent-current',
            remaining: 'rent-remaining'
        },
        'electricity': {
            current: 'electricity-current',
            remaining: 'electricity-remaining'
        },
        'water': {
            current: 'water-current',
            remaining: 'water-remaining'
        }
    };

    const sectionData = sections[section];
    if (!sectionData) return;

    // Collect all values for the section
    let values = {};
    Object.entries(sectionData).forEach(([key, id]) => {
        const inputElement = document.getElementById(`${id}-input`);
        if (inputElement) {
            values[key] = parseFloat(inputElement.value) || 0;
        }
    });

    // Update all values at once
    Object.entries(values).forEach(([key, value]) => {
        const valueElement = document.getElementById(sectionData[key]);
        if (valueElement) {
            valueElement.textContent = formatCurrency(value);
            valueElement.style.display = 'inline';
            document.getElementById(`${sectionData[key]}-input`).style.display = 'none';
        }
    });

    // Update the data with all values
    updateInvoiceData(section, 'all', values);
}
