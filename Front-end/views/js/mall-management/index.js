    // تهيئة الرسوم البيانية
    document.addEventListener('DOMContentLoaded', function() {
      // رسم بياني لتوزيع المحلات حسب النشاط
      const storeTypesChart = new Chart(document.getElementById('storeTypesChart'), {
        type: 'pie',
        data: {
          labels: ['مطاعم', 'ملابس', 'إلكترونيات', 'مجوهرات', 'أخرى'],
          datasets: [{
            data: [30, 25, 20, 15, 10],
            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#64748b']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
          
        }
      });

      // رسم بياني لمعدل تحصيل الإيجارات
      const rentCollectionChart = new Chart(document.getElementById('rentCollectionChart'), {
        type: 'line',
        data: {
          labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
          datasets: [{
            label: 'نسبة التحصيل',
            data: [95, 92, 96, 94, 95, 93],
            borderColor: '#22c55e',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { min: 80, max: 100 }
          }
        }
      });

      // رسم بياني لمقارنة نسب الإشغال
      const occupancyChart = new Chart(document.getElementById('occupancyChart'), {
        type: 'bar',
        data: {
          labels: ['الدور الأرضي', 'الدور الأول', 'الدور الثاني'],
          datasets: [{
            label: 'نسبة الإشغال',
            data: [95, 85, 75],
            backgroundColor: '#3b82f6'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { min: 0, max: 100 }
          }
        }
      });
    });

    // Modal Functions
    function openModal(modalId) {
      document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
    }

    function openNewInvoiceForm() {
      openModal('newInvoiceModal');
    }

    function openBulkMessageModal() {
      openModal('bulkMessageModal');
    }

    function viewInvoice(id) {
      openModal('invoiceDetailsModal');
      // Here you would typically load the invoice details
    }

    function downloadPDF(id) {
      // Implement PDF generation and download
      console.log('Downloading PDF for invoice:', id);
    }

    function sendMessage(id) {
      // الحصول على بيانات الفاتورة
      const row = document.querySelector(`tr[data-invoice-id="${id}"]`);
      const storeName = row.cells[0].textContent;
      const ownerName = row.cells[1].textContent;
      
      // تعبئة عنوان الرسالة تلقائياً
      document.getElementById('message-subject').value = `تنبيه بخصوص فاتورة ${storeName}`;
      
      // تعبئة محتوى الرسالة تلقائياً
      const messageContent = `السلام عليكم ${ownerName}،\n\nهذا تنبيه بخصوص فاتورة ${storeName}.\n\n`;
      document.getElementById('message-content').value = messageContent;
      
      // عرض النافذة المنبثقة
      openModal('sendMessageModal');
    }

    // Table Sorting
    function sortTable(column) {
      // Implement table sorting logic
      console.log('Sorting by:', column);
    }

    // تحديث دالة تطبيق الفلترة
    function applyFilters() {
      const type = document.getElementById('invoice-type-filter').value;
      const status = document.getElementById('status-filter').value;
      const searchText = document.getElementById('search-input').value.toLowerCase();
      
      const rows = document.querySelectorAll('table tbody tr');
      
      rows.forEach(row => {
        let showRow = true;
        
        // فلترة حسب نوع الفاتورة
        if (type !== 'all') {
          const invoiceType = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
          if (!invoiceType.includes(type)) {
            showRow = false;
          }
        }
        
        // فلترة حسب الحالة
        if (status !== 'all') {
          const invoiceStatus = row.querySelector('td:nth-child(7)').textContent.toLowerCase();
          if (status === 'paid' && invoiceStatus !== '0 ريال') {
            showRow = false;
          } else if (status === 'unpaid' && invoiceStatus === '0 ريال') {
            showRow = false;
          } else if (status === 'overdue' && !invoiceStatus.includes('ريال')) {
            showRow = false;
          }
        }

        // البحث في اسم المحل واسم صاحب المحل
        if (searchText) {
          const storeName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
          const ownerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
          
          if (!storeName.includes(searchText) && !ownerName.includes(searchText)) {
            showRow = false;
          }
        }
        
        row.style.display = showRow ? '' : 'none';
      });
    }

    // Shops Data
    const shops = [
      { id: 1, name: 'محل A101', status: 'open', area: 120, floor: 0, x: 1, y: 1, width: 2, height: 2 },
      { id: 2, name: 'محل A102', status: 'closed', area: 85, floor: 0, x: 3, y: 1, width: 2, height: 1 },
      { id: 3, name: 'محل A103', status: 'empty', area: 100, floor: 0, x: 5, y: 1, width: 2, height: 2 },
      // ... More shops data
    ];

    const GRID_UNIT = 80;

    // Floor Navigation Functions
    function incrementFloor() {
      if (currentFloor < 2) {
        currentFloor++;
        updateFloorDisplay();
        renderFloorMap(currentFloor);
      }
    }

    function decrementFloor() {
      if (currentFloor > 0) {
        currentFloor--;
        updateFloorDisplay();
        renderFloorMap(currentFloor);
      }
    }

    function updateFloorDisplay() {
      document.getElementById('currentFloor').textContent = `الدور: ${currentFloor}`;
    }

    // Map Rendering Function
    function renderFloorMap(floor) {
      const mapContainer = document.getElementById('mall-map');
      mapContainer.innerHTML = '';

      shops.filter(shop => shop.floor === floor).forEach(shop => {
        const shopDiv = document.createElement('div');
        shopDiv.className = `shop ${shop.status}`;
        shopDiv.style.width = `${shop.width * GRID_UNIT}px`;
        shopDiv.style.height = `${shop.height * GRID_UNIT}px`;
        shopDiv.style.left = `${shop.x * GRID_UNIT}px`;
        shopDiv.style.top = `${shop.y * GRID_UNIT}px`;
        
        shopDiv.innerHTML = `
          <div class="shop-content">
            <strong>${shop.name}</strong>
            <span>${shop.area} م²</span>
          </div>
          <div class="shop-actions" style="display: none;">
            <button class="btn-icon" title="عرض التفاصيل" onclick="viewStoreDetails(${shop.id})">🔍</button>
          </div>
        `;
        
        shopDiv.title = `اسم: ${shop.name}\nحالة: ${shop.status}\nمساحة: ${shop.area} م²`;
        
        // Add click event to show/hide action buttons
        shopDiv.addEventListener('click', function(e) {
          e.stopPropagation();
          const actions = this.querySelector('.shop-actions');
          actions.style.display = actions.style.display === 'none' ? 'flex' : 'none';
        });

        mapContainer.appendChild(shopDiv);
      });

      // Add click event to map container to hide all action buttons
      mapContainer.addEventListener('click', function(e) {
        if (e.target === this) {
          document.querySelectorAll('.shop-actions').forEach(actions => {
            actions.style.display = 'none';
          });
        }
      });
    }

    // تحديث دالة viewStoreDetails لتستقبل جميع البيانات المطلوبة
    function viewStoreDetails(storeId) {
      // جلب بيانات المحل والمرفق من مصدر البيانات (مثال توضيحي)
      const shop = shops.find(s => s.id === storeId);
      if (!shop) return;
      // بيانات المرفق
      const facility = {
        rent: shop.rent || '-',
        waterMeter: shop.waterMeter || '-',
        electricityMeter: shop.electricityMeter || '-',
        width: shop.width || '-',
        height: shop.height || '-'
      };
      // بيانات المالك
      const owner = shop.owner || {
        name: '-',
        phone: '-',
        email: '-',
        gender: '-',
        birthdate: '-'
      };
      // بيانات المحل
      const store = {
        storeName: shop.name || '-',
        activity: shop.activity || '-',
        contractStart: shop.contractStart || '-',
        workingHours: shop.workingHours || '-'
      };
      // تعبئة نافذة العرض الجديدة
      fillStoreDetailsModal(facility, owner, store);
      openModal('storeDetailsModal');
    }

    // Modal Functions
    function openNewStoreForm() {
      const formContainer = document.getElementById('newStoreFormContainer');
      formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    }

    function openNewTenantForm() {
      const formContainer = document.getElementById('newTenantFormContainer');
      formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
      renderFloorMap(0);
    });

    window.onclick = function(event) {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    };

    // // Navigation
    // document.querySelectorAll('header a').forEach(link => {
    //   link.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     document.querySelector('header a.active').classList.remove('active');
    //     link.classList.add('active');
        
    //     const sections = document.querySelectorAll('.section');
    //     sections.forEach(section => section.classList.remove('active'));
    //     document.querySelector('#' + link.id.replace('-link', '-section')).classList.add('active');
    //   });
    // });

    // إضافة في نهاية قسم السكريبت
    // تعريف المتغير العام
    let currentFloor = 0;

    // Charts Initialization
    // إضافة في نهاية قسم Charts Initialization
    new Chart(document.getElementById('occupancyStatusChart').getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['مؤجرة', 'متاحة', 'تحت الصيانة'],
        datasets: [{
          data: [85, 10, 5],
          backgroundColor: ['#22c55e', '#64748b', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });

    new Chart(document.getElementById('monthlyRevenueChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
          label: 'الإيرادات (ريال)',
          data: [420000, 380000, 450000, 420000, 430000, 460000],
          backgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(document.getElementById('interactionChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
          label: 'طلبات الصيانة',
          data: [12, 8, 15, 10, 7, 9],
          borderColor: '#f59e0b',
          tension: 0.4
        }, {
          label: 'الشكاوى',
          data: [5, 3, 6, 4, 2, 3],
          borderColor: '#ef4444',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Bills Functions
    function openNewBillForm() {
      document.getElementById('newBillForm').style.display = 'block';
    }

    function filterBills(status) {
      // تنفيذ فلترة الفواتير حسب الحالة
      document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
    }

    function downloadBillPDF(billId) {
      // تنفيذ تحميل PDF
      console.log(`Downloading PDF for bill ${billId}`);
    }

    function printBill(billId) {
      // تنفيذ طباعة الفاتورة
      console.log(`Printing bill ${billId}`);
    }

    new Chart(document.getElementById('storeTypesChart').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['مطاعم', 'ملابس', 'إلكترونيات', 'مستحضرات تجميل', 'خدمات', 'أخرى'],
        datasets: [{
          data: [30, 25, 15, 10, 10, 10],
          backgroundColor: [
            '#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
    
    new Chart(document.getElementById('rentCollectionChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
          label: '2023',
          data: [85, 88, 90, 92, 95, 93],
          borderColor: '#22c55e',
          tension: 0.4
        }, {
          label: '2022',
          data: [75, 78, 77, 80, 82, 83],
          borderColor: '#94a3b8',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    new Chart(document.getElementById('occupancyChart').getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['مؤجرة', 'متاحة', 'تحت الصيانة'],
        datasets: [{
          data: [85, 10, 5],
          backgroundColor: ['#22c55e', '#64748b', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });

    // تحديث دالة تعديل المحل
    function editStore(storeId) {
      // Here you would typically load the store and tenant data from the server
      const storeData = {
        number: 'A101',
        area: 120,
        activity: 'restaurant',
        floor: 0,
        x: 1,
        y: 1,
        width: 2,
        height: 2,
        tenant: {
          name: 'أحمد محمد',
          phone: '0501234567',
          email: 'ahmed@example.com',
          id: '1234567890',
          contractStart: '2024-01-01',
          contractEnd: '2024-12-31'
        }
      };

      // Update the edit form with store data
      document.getElementById('edit-store-number').value = storeData.number;
      document.getElementById('edit-store-area').value = storeData.area;
      document.getElementById('edit-store-activity').value = storeData.activity;
      document.getElementById('edit-store-floor').value = storeData.floor;
      document.getElementById('edit-store-x').value = storeData.x;
      document.getElementById('edit-store-y').value = storeData.y;
      document.getElementById('edit-store-width').value = storeData.width;
      document.getElementById('edit-store-height').value = storeData.height;

      // Update the edit form with tenant data
      document.getElementById('edit-tenant-name').value = storeData.tenant.name;
      document.getElementById('edit-tenant-phone').value = storeData.tenant.phone;
      document.getElementById('edit-tenant-email').value = storeData.tenant.email;
      document.getElementById('edit-tenant-id').value = storeData.tenant.id;
      document.getElementById('edit-tenant-contract-start').value = storeData.tenant.contractStart;
      document.getElementById('edit-tenant-contract-end').value = storeData.tenant.contractEnd;

      // Show the modal
      openModal('editStoreModal');
    }

    // تحديث دالة تعديل صاحب المحل
    function editTenant(tenantId) {
      // هنا يمكنك إضافة كود لجلب بيانات صاحب المحل من الخادم
      const tenant = {
        name: 'أحمد محمد',
        phone: '0501234567',
        email: 'ahmed@example.com',
        store: 'A101'
      };

      // تعبئة النموذج بالبيانات الحالية
      document.getElementById('edit-tenant-name').value = tenant.name;
      document.getElementById('edit-tenant-phone').value = tenant.phone;
      document.getElementById('edit-tenant-email').value = tenant.email;
      document.getElementById('edit-tenant-store').value = tenant.store;

      // عرض النافذة المنبثقة
      openModal('editTenantModal');
    }

    // إضافة مستمع الأحداث لنموذج التعديل
    document.getElementById('editInvoiceForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // جمع البيانات من النموذج
      const formData = {
        storeName: document.getElementById('edit-store-name').value,
        ownerName: document.getElementById('edit-owner-name').value,
        electricity: document.getElementById('edit-electricity').value,
        water: document.getElementById('edit-water').value,
        rent: document.getElementById('edit-rent').value,
        month: document.getElementById('edit-month').value,
        overdue: document.getElementById('edit-overdue').value,
        total: document.getElementById('edit-total').value
      };

      // هنا يمكنك إضافة كود لحفظ التغييرات في الخادم
      console.log('تم حفظ تعديلات الفاتورة:', formData);
      
      // إغلاق النافذة المنبثقة
      closeModal('editInvoiceModal');
      
      // تحديث الصف في الجدول
      const row = document.querySelector(`tr[data-invoice-id="${currentInvoiceId}"]`);
      if (row) {
        row.cells[0].textContent = formData.storeName;
        row.cells[1].textContent = formData.ownerName;
        row.cells[2].textContent = formData.electricity + ' ريال';
        row.cells[3].textContent = formData.water + ' ريال';
        row.cells[4].textContent = formData.rent + ' ريال';
        row.cells[5].textContent = formData.month;
        row.cells[6].textContent = formData.overdue + ' ريال';
        row.cells[7].textContent = formData.total + ' ريال';
      }
    });

    // Add this new function for view toggling
    function toggleView(view) {
      const tablesView = document.getElementById('tables-view');
      const mapView = document.getElementById('map-view');
      const tableBtn = document.getElementById('table-view-btn');
      const mapBtn = document.getElementById('map-view-btn');

      if (view === 'table') {
        tablesView.style.display = 'block';
        mapView.style.display = 'none';
        tableBtn.classList.add('active');
        mapBtn.classList.remove('active');
      } else {
        tablesView.style.display = 'none';
        mapView.style.display = 'block';
        mapBtn.classList.add('active');
        tableBtn.classList.remove('active');
        // Trigger map render when switching to map view
        renderFloorMap(currentFloor);
      }
    }

    // تحديث دالة تعديل الفاتورة
    function editInvoice(id) {
      // الحصول على الصف المحدد
      const row = document.querySelector(`tr[data-invoice-id="${id}"]`);
      
      // استخراج البيانات من الصف
      const invoiceData = {
        storeName: row.cells[0].textContent,
        ownerName: row.cells[1].textContent,
        electricity: parseInt(row.cells[2].textContent),
        water: parseInt(row.cells[3].textContent),
        rent: parseInt(row.cells[4].textContent),
        month: row.cells[5].textContent,
        overdue: parseInt(row.cells[6].textContent),
        total: parseInt(row.cells[7].textContent)
      };

      // تعبئة النموذج بالبيانات
      document.getElementById('edit-store-name').value = invoiceData.storeName;
      document.getElementById('edit-owner-name').value = invoiceData.ownerName;
      document.getElementById('edit-electricity').value = invoiceData.electricity;
      document.getElementById('edit-water').value = invoiceData.water;
      document.getElementById('edit-rent').value = invoiceData.rent;
      document.getElementById('edit-month').value = invoiceData.month;
      document.getElementById('edit-overdue').value = invoiceData.overdue;
      document.getElementById('edit-total').value = invoiceData.total;

      // تخزين معرف الفاتورة الحالية
      window.currentInvoiceId = id;

      // عرض النافذة المنبثقة
      openModal('editInvoiceModal');
    }

    // دالة تعبئة نافذة تفاصيل المحل والمرفق
    function fillStoreDetailsModal(facility, owner, store) {
      document.getElementById('view-facility-rent').textContent = facility.rent;
      document.getElementById('view-facility-water-meter').textContent = facility.waterMeter;
      document.getElementById('view-facility-electricity-meter').textContent = facility.electricityMeter;
      document.getElementById('view-facility-width').textContent = facility.width;
      document.getElementById('view-facility-height').textContent = facility.height;

      document.getElementById('view-owner-name').textContent = owner.name;
      document.getElementById('view-owner-phone').textContent = owner.phone;
      document.getElementById('view-owner-email').textContent = owner.email;
      document.getElementById('view-owner-gender').textContent = owner.gender;
      document.getElementById('view-owner-birthdate').textContent = owner.birthdate;

      document.getElementById('view-store-name').textContent = store.storeName;
      document.getElementById('view-store-activity').textContent = store.activity;
      document.getElementById('view-store-contract-start').textContent = store.contractStart;
      document.getElementById('view-store-working-hours').textContent = store.workingHours;
    }