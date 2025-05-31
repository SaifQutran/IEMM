// متغيرات عامة
let currentPage = 1;
let totalPages = 1;

// متغيرات لتتبع عملية التأكيد
let currentReservationId = null;

// بيانات تجريبية للحجوزات
const mockReservations = [
    {
        id: 1,
        customerName: "أحمد محمد",
        productName: "منتج 1",
        quantity: 2,
        reservationDate: "2024-03-20",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 2,
        customerName: "سارة أحمد",
        productName: "منتج 2",
        quantity: 1,
        reservationDate: "2024-03-19",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 3,
        customerName: "محمد علي",
        productName: "منتج 3",
        quantity: 3,
        reservationDate: "2024-03-18",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 4,
        customerName: "فاطمة حسن",
        productName: "منتج 4",
        quantity: 2,
        reservationDate: "2024-03-17",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 5,
        customerName: "علي محمود",
        productName: "منتج 5",
        quantity: 1,
        reservationDate: "2024-03-16",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 6,
        customerName: "نورا أحمد",
        productName: "منتج 6",
        quantity: 4,
        reservationDate: "2024-03-15",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 7,
        customerName: "كريم محمد",
        productName: "منتج 7",
        quantity: 2,
        reservationDate: "2024-03-14",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 8,
        customerName: "ليلى علي",
        productName: "منتج 8",
        quantity: 3,
        reservationDate: "2024-03-13",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 9,
        customerName: "يوسف محمود",
        productName: "منتج 9",
        quantity: 1,
        reservationDate: "2024-03-12",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    },
    {
        id: 10,
        customerName: "منى حسن",
        productName: "منتج 10",
        quantity: 2,
        reservationDate: "2024-03-11",
        pickupDate: null,
        status: "pending",
        notes: "ملاحظات على الحجز"
    }
];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadReservations();
    setupSearchListener();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
  // مستمعي أحداث التنقل بين الصفحات
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadReservations();
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadReservations();
    }
  });
}

// إعداد مستمع البحث
function setupSearchListener() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterReservations);
    }
}

// تحميل الحجوزات
async function loadReservations() {
  try {
        // استخدام البيانات التجريبية بدلاً من الاتصال بالخادم
        const data = {
            success: true,
            reservations: mockReservations
        };

    if (data.success) {
      renderReservations(data.reservations);
    } else {
      showError('حدث خطأ أثناء تحميل الحجوزات');
    }
  } catch (error) {
    console.error('Error loading reservations:', error);
    showError('حدث خطأ في الاتصال بالخادم');
  }
}

// عرض الحجوزات في الجدول
function renderReservations(reservations) {
  const tbody = document.getElementById('reservations-table-body');
    if (!tbody) {
        console.error('Element #reservations-table-body not found');
        return;
    }
    
  tbody.innerHTML = '';

    if (!reservations || reservations.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="text-center">لا توجد حجوزات</td>';
        tbody.appendChild(tr);
        return;
    }

    // عرض جميع الحجوزات مع التمرير
  reservations.forEach(reservation => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${reservation.customerName}</td>
      <td>${reservation.productName}</td>
            <td>${formatDate(reservation.reservationDate)}</td>
            <td>${reservation.pickupDate ? formatDate(reservation.pickupDate) : '-'}</td>
      <td>${reservation.quantity}</td>
      <td><span class="status-badge ${getStatusClass(reservation.status)}">${getStatusText(reservation.status)}</span></td>
      <td>
        ${getActionButtons(reservation)}
      </td>
    `;
    tbody.appendChild(tr);
  });

    // إضافة مستمع للتمرير
    setupScrollListener();
}

// إعداد مستمع التمرير
function setupScrollListener() {
    const tableScroll = document.querySelector('.table-scroll');
    if (!tableScroll) return;

    // تعيين ارتفاع الصفوف الخمسة الأولى
    const rows = tableScroll.querySelectorAll('tbody tr');
    if (rows.length > 0) {
        const firstRowHeight = rows[0].offsetHeight;
        const headerHeight = tableScroll.querySelector('thead').offsetHeight;
        const searchHeight = document.querySelector('.table-header').offsetHeight;
        
        // تعيين ارتفاع منطقة التمرير ليعرض 5 صفوف
        tableScroll.style.height = `${(firstRowHeight * 5) + headerHeight + searchHeight}px`;
    }
}

// عرض تفاصيل الحجز
async function viewReservationDetails(reservationId) {
  try {
        // استخدام البيانات التجريبية
        const reservation = mockReservations.find(r => r.id === reservationId);

        if (!reservation) {
            showError('الحجز غير موجود');
            return;
        }

        const modal = document.getElementById('reservation-modal');
        if (!modal) {
            console.error('Element #reservation-modal not found');
            return;
        }

        // تحديث محتوى النافذة المنبثقة
      document.getElementById('modal-reservation-id').textContent = reservation.id;
      document.getElementById('modal-customer-name').textContent = reservation.customerName;
      document.getElementById('modal-product-name').textContent = reservation.productName;
      document.getElementById('modal-quantity').textContent = reservation.quantity;
      document.getElementById('modal-reservation-date').textContent = formatDate(reservation.reservationDate);
      document.getElementById('modal-status').textContent = getStatusText(reservation.status);
      document.getElementById('modal-notes').value = reservation.notes || '';

        // تحديث حالة الأزرار
      updateModalButtons(reservation.status);

      // عرض النافذة المنبثقة
        modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading reservation details:', error);
        showError('حدث خطأ في عرض تفاصيل الحجز');
  }
}

// إغلاق نافذة تفاصيل الحجز
function closeReservationModal() {
  document.getElementById('reservation-modal').style.display = 'none';
}

// تحديد الأزرار المناسبة حسب حالة الحجز
function getActionButtons(reservation) {
    let buttons = '';
    
    if (reservation.status === 'pending') {
        buttons += `
            <button class="btn-icon btn-green" onclick="acceptReservation(${reservation.id})" title="قبول الحجز">
                <i class="fas fa-check"></i>
            </button>
            <button class="btn-icon btn-red" onclick="rejectReservation(${reservation.id})" title="رفض الحجز">
                <i class="fas fa-times"></i>
            </button>
        `;
    } else if (reservation.status === 'accepted') {
        buttons += `
            <button class="btn-icon btn-primary" onclick="markAsCompleted(${reservation.id})" title="تم الاستلام">
                <i class="fas fa-handshake"></i>
            </button>
        `;
    }
    
    return buttons;
}

// قبول الحجز
async function acceptReservation(reservationId) {
    currentReservationId = reservationId;
    const reservation = mockReservations.find(r => r.id === reservationId);
    if (reservation) {
        document.getElementById('accept-confirm-message').innerHTML = 
            `هل أنت متأكد من قبول حجز العميل <strong>${reservation.customerName}</strong>؟<br>
             سيتم تحديث حالة الحجز إلى "تم القبول".`;
        document.getElementById('accept-confirm-modal').style.display = 'block';
    }
}

// تأكيد قبول الحجز
async function confirmAccept() {
    try {
        const reservation = mockReservations.find(r => r.id === currentReservationId);
        if (reservation && reservation.status === 'pending') {
            reservation.status = 'accepted';
            loadReservations();
        }
    } catch (error) {
        console.error('Error accepting reservation:', error);
    }
    closeAcceptModal();
}

// إغلاق نافذة تأكيد القبول
function closeAcceptModal() {
    document.getElementById('accept-confirm-modal').style.display = 'none';
    currentReservationId = null;
}

// رفض الحجز
async function rejectReservation(reservationId) {
    currentReservationId = reservationId;
    const reservation = mockReservations.find(r => r.id === reservationId);
    if (reservation) {
        document.getElementById('reject-confirm-message').innerHTML = 
            `هل أنت متأكد من رفض حجز العميل <strong>${reservation.customerName}</strong>؟<br>
             سيتم تحديث حالة الحجز إلى "مرفوض".`;
        document.getElementById('reject-confirm-modal').style.display = 'block';
    }
}

// تأكيد رفض الحجز
async function confirmReject() {
    try {
        const reservation = mockReservations.find(r => r.id === currentReservationId);
        if (reservation && reservation.status === 'pending') {
            reservation.status = 'rejected';
            loadReservations();
        }
    } catch (error) {
        console.error('Error rejecting reservation:', error);
    }
    closeRejectModal();
}

// إغلاق نافذة تأكيد الرفض
function closeRejectModal() {
    document.getElementById('reject-confirm-modal').style.display = 'none';
    currentReservationId = null;
}

// تحديث حالة الحجز إلى "تم الاستلام"
async function markAsCompleted(reservationId) {
    currentReservationId = reservationId;
    const reservation = mockReservations.find(r => r.id === reservationId);
    if (reservation) {
        document.getElementById('complete-confirm-message').innerHTML = 
            `هل أنت متأكد من تحديث حالة حجز العميل <strong>${reservation.customerName}</strong> إلى "تم الاستلام"؟<br>
             سيتم تسجيل تاريخ الاستلام اليوم.`;
        document.getElementById('complete-confirm-modal').style.display = 'block';
    }
}

// تأكيد تحديث حالة الحجز
async function confirmComplete() {
    try {
        const reservation = mockReservations.find(r => r.id === currentReservationId);
        if (reservation && reservation.status === 'accepted') {
            reservation.status = 'completed';
            reservation.pickupDate = new Date().toISOString().split('T')[0];
            loadReservations();
        }
    } catch (error) {
        console.error('Error completing reservation:', error);
    }
    closeCompleteModal();
}

// إغلاق نافذة تأكيد الاستلام
function closeCompleteModal() {
    document.getElementById('complete-confirm-modal').style.display = 'none';
    currentReservationId = null;
}

// إغلاق النوافذ المنبثقة عند النقر خارجها
window.onclick = function(event) {
    const modals = [
        document.getElementById('accept-confirm-modal'),
        document.getElementById('reject-confirm-modal'),
        document.getElementById('complete-confirm-modal')
    ];
    
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            currentReservationId = null;
        }
    });
}

// وظائف مساعدة
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function getStatusClass(status) {
  const classes = {
    pending: 'status-pending',
    accepted: 'status-accepted',
    rejected: 'status-rejected',
    completed: 'status-completed'
  };
  return classes[status] || 'status-pending';
}

function getStatusText(status) {
  const texts = {
        pending: 'في انتظار الموافقة',
    accepted: 'تم القبول',
    rejected: 'مرفوض',
    completed: 'تم الاستلام'
  };
    return texts[status] || 'في انتظار الموافقة';
}

function updateModalButtons(status) {
  const acceptButton = document.querySelector('.modal-actions .btn-green');
  const rejectButton = document.querySelector('.modal-actions .btn-red');

  if (status === 'pending') {
    acceptButton.style.display = 'inline-block';
    rejectButton.style.display = 'inline-block';
  } else {
    acceptButton.style.display = 'none';
    rejectButton.style.display = 'none';
  }
}

// تصفية الحجوزات حسب البحث والفلاتر
function filterReservations() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const reservationDate = document.getElementById('reservation-date-filter').value;
    const pickupDate = document.getElementById('pickup-date-filter').value;
    const status = document.getElementById('status-filter').value;

    const filteredReservations = mockReservations.filter(reservation => {
        // فلتر البحث النصي
        const matchesSearch = 
            reservation.customerName.toLowerCase().includes(searchTerm) ||
            reservation.productName.toLowerCase().includes(searchTerm);

        // فلتر تاريخ الحجز
        const matchesReservationDate = !reservationDate || 
            reservation.reservationDate === reservationDate;

        // فلتر تاريخ الاستلام
        const matchesPickupDate = !pickupDate || 
            (reservation.pickupDate && reservation.pickupDate === pickupDate);

        // فلتر الحالة
        const matchesStatus = !status || 
            reservation.status === status;

        return matchesSearch && matchesReservationDate && matchesPickupDate && matchesStatus;
    });

    renderReservations(filteredReservations);
} 