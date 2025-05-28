// المتغيرات العالمية
let products = [];
let currentProduct = null;
let productInventory = [];
let productSales = [];
let productReviews = [];

// إضافة مستمع لتحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // نسخ مصفوفة المنتجات من الصفحة الرئيسية
    if (window.products) {
        products = window.products;
    }
});

// إضافة النافذة المنبثقة إلى صفحة HTML
document.addEventListener('DOMContentLoaded', function() {
  // إضافة CSS للنافذة المنبثقة
  if (!document.querySelector('link[href="../views/css/product-modal.css"]')) {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '../views/css/product-modal.css';
    document.head.appendChild(cssLink);
  }
  
  // إضافة هيكل النافذة المنبثقة إلى الصفحة
  const modalHTML = `
    <div id="productModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="product-modal-title">تفاصيل المنتج</h3>
          <button class="btn-close" onclick="closeProductModal()">&times;</button>
        </div>
        <div class="modal-body">
          <!-- معلومات المنتج -->
          <div class="details-section">
            <h4>معلومات المنتج</h4>
            <div class="product-info-grid" id="product-info-container">
              <!-- سيتم ملؤها بواسطة JavaScript -->
            </div>
          </div>
          
          <!-- التعليقات والتقييمات -->
          <div class="details-section">
            <h4>التعليقات والتقييمات</h4>
            <div class="reviews-container">
              <div class="rating-summary">
                <div class="average-rating">
                  <div class="average-rating-value" id="average-rating">0.0</div>
                  <div class="stars" id="average-stars">★★★★★</div>
                  <div id="total-reviews">0 تقييم</div>
                </div>
                <div class="rating-bars" id="rating-bars-container">
                  <!-- سيتم ملؤها بواسطة JavaScript -->
                </div>
              </div>
              <div class="reviews-list" id="reviews-list-container">
                <!-- سيتم ملؤها بواسطة JavaScript -->
              </div>
            </div>
          </div>
          
          <!-- تفاصيل المخزون -->
          <div class="details-section">
            <h4>تفاصيل المخزون</h4>
            <table class="inventory-table">
              <thead>
                <tr>
                  <th>المخزن</th>
                  <th>الكمية</th>
                  <th>الحالة</th>
                  <th>آخر تحديث</th>
                </tr>
              </thead>
              <tbody id="inventory-table-body">
                <!-- سيتم ملؤها بواسطة JavaScript -->
              </tbody>
            </table>
          </div>
          
          <!-- تفاصيل المبيعات -->
          <div class="details-section">
            <h4>تفاصيل المبيعات</h4>
            <div class="sales-stats-container">
              <div class="sales-stats-grid">
                <div class="stat-card">
                  <div class="stat-title">إجمالي المبيعات</div>
                  <div class="stat-value" id="total-sales">0</div>
                </div>
                <div class="stat-card">
                  <div class="stat-title">الإيرادات</div>
                  <div class="stat-value" id="total-revenue">0 ريال</div>
                </div>
                <div class="stat-card">
                  <div class="stat-title">متوسط التقييم</div>
                  <div class="stat-value" id="avg-rating-stat">0.0</div>
                </div>
              </div>
              <div class="sales-charts">
                <div class="chart-container">
                  <h5>المبيعات حسب الفئة العمرية</h5>
                  <canvas id="age-chart"></canvas>
                </div>
                <div class="chart-container">
                  <h5>المبيعات حسب الجنس</h5>
                  <canvas id="gender-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- نافذة تعديل الحقل -->
    <div id="editFieldModal" class="modal">
      <div class="modal-content edit-field-modal">
        <div class="modal-header">
          <h3 id="edit-field-title">تعديل الحقل</h3>
          <button class="btn-close" onclick="closeEditFieldModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label id="edit-field-label">القيمة</label>
            <input type="text" id="edit-field-input" />
          </div>
          <div class="form-actions">
            <button class="btn-green" onclick="saveFieldEdit()">حفظ</button>
            <button class="btn-secondary" onclick="closeEditFieldModal()">إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // إضافة النافذة المنبثقة إلى الصفحة
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  
  // تهيئة الرسوم البيانية
  initCharts();
});

// دالة فتح النافذة المنبثقة لعرض تفاصيل المنتج
// تغيير اسم الدالة لتجنب التعارض
function viewProductDetails(id) {
  // الحصول على بيانات المنتج من الخادم (محاكاة)
  fetchProductDetails(id);
  
  // فتح النافذة المنبثقة
  document.getElementById('productModal').style.display = 'block';
}

// دالة إغلاق النافذة المنبثقة
function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

// دالة فتح نافذة تعديل الحقل
function openEditFieldModal(fieldName, fieldValue, fieldLabel) {
  document.getElementById('edit-field-title').textContent = `تعديل ${fieldLabel}`;
  document.getElementById('edit-field-label').textContent = fieldLabel;
  document.getElementById('edit-field-input').value = fieldValue;
  document.getElementById('edit-field-input').dataset.fieldName = fieldName;
  
  document.getElementById('editFieldModal').style.display = 'block';
}

// دالة إغلاق نافذة تعديل الحقل
function closeEditFieldModal() {
  document.getElementById('editFieldModal').style.display = 'none';
}

// دالة حفظ تعديل الحقل
function saveFieldEdit() {
  const fieldName = document.getElementById('edit-field-input').dataset.fieldName;
  const fieldValue = document.getElementById('edit-field-input').value;
  
  // تحديث قيمة الحقل في واجهة المستخدم
  document.getElementById(`product-${fieldName}-value`).textContent = fieldValue;
  
  // تحديث قيمة الحقل في كائن المنتج الحالي
  currentProduct[fieldName] = fieldValue;
  
  // إرسال التعديل إلى الخادم (محاكاة)
  console.log(`تم تعديل ${fieldName} إلى ${fieldValue}`);
  
  // إغلاق نافذة التعديل
  closeEditFieldModal();
  
  // عرض رسالة نجاح
  alert('تم حفظ التعديل بنجاح');
}

// دالة جلب بيانات المنتج من الخادم (محاكاة)
function fetchProductDetails(id) {
    console.log('جاري جلب بيانات المنتج:', id);
    setTimeout(() => {
        // البحث عن المنتج في مصفوفة المنتجات
        const product = products.find(p => p.id === id);
        
        if (!product) {
            console.error('لم يتم العثور على المنتج');
            return;
        }
        
        // تعيين بيانات المنتج
        currentProduct = {
            id: product.id,
            name: product.name,
            description: 'وصف تفصيلي للمنتج يشرح مميزاته وخصائصه',
            category: 'إلكترونيات',
            price: product.price,
            barcode: product.barcode,
            manufacturer: product.manufacturer,
            country: 'الصين',
            prodDate: product.prodDate,
            expDate: product.expDate,
            status: product.status
        };
        
        // بيانات تجريبية للمخزون
        productInventory = [
            { warehouse: 'المخزن الرئيسي', quantity: product.quantity, status: product.quantity > 20 ? 'normal' : product.quantity > 10 ? 'low' : 'critical', lastUpdate: new Date().toISOString().split('T')[0] }
        ];
        
        // بيانات تجريبية للمبيعات
        productSales = {
            total: Math.floor(Math.random() * 100),
            revenue: product.price * Math.floor(Math.random() * 100),
            byAge: {
                'أقل من 18': Math.floor(Math.random() * 20),
                '18-24': Math.floor(Math.random() * 30),
                '25-34': Math.floor(Math.random() * 40),
                '35-44': Math.floor(Math.random() * 25),
                '45+': Math.floor(Math.random() * 15)
            },
            byGender: {
                'ذكر': Math.floor(Math.random() * 60),
                'أنثى': Math.floor(Math.random() * 40)
            }
        };
        
        // بيانات تجريبية للتقييمات
        productReviews = [
            { name: 'أحمد محمد', rating: 5, date: '2024-03-10', text: 'منتج ممتاز، أنصح به بشدة!' },
            { name: 'سارة علي', rating: 4, date: '2024-03-05', text: 'منتج جيد جدًا ولكن السعر مرتفع قليلاً' },
            { name: 'محمد خالد', rating: 3, date: '2024-02-28', text: 'منتج متوسط، يمكن تحسينه' }
        ];
        
        console.log('تم استلام بيانات المنتج:', currentProduct);
        
        // تحديث واجهة المستخدم
        updateProductInfo();
        updateInventoryTable();
        updateSalesStats();
        updateReviews();
        updateCharts();
    }, 500);
}

// دالة تحديث معلومات المنتج في النافذة المنبثقة
function updateProductInfo() {
    const modalTitle = document.getElementById('product-modal-title');
    const infoContainer = document.getElementById('product-info-container');
    if (!modalTitle || !infoContainer || !currentProduct) {
        console.error('عناصر النافذة المنبثقة غير موجودة');
        return;
    }
    let mainImage = (currentProduct.images && currentProduct.images.length) ? currentProduct.images[0] : null;
    infoContainer.innerHTML = `
        <div class="product-main-visual" style="display: flex; flex-direction: column; align-items: center; margin-bottom: 1.5rem;">
            <div class="product-image-wrapper" style="width: 120px; height: 120px; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.10); background: #f1f5f9; display: flex; align-items: center; justify-content: center;">
                ${mainImage ? `<img src="${mainImage}" alt="صورة المنتج" style="width: 100%; height: 100%; object-fit: cover;">` : `<i class='fas fa-image' style='font-size: 3.5rem; color: #cbd5e1;'></i>`}
            </div>
            <div style="margin-top: 1rem; text-align: center;">
                <div class="product-title-highlight" style="font-size: 1.5rem; font-weight: bold; color: #1e293b; margin-bottom: 0.5rem;">${currentProduct.name}</div>
                <div style="font-size: 1.15rem; color: #22c55e; font-weight: bold; display: inline-block; margin-left: 12px;">${currentProduct.price} ريال</div>
                <span class="status-badge ${currentProduct.status === 'active' ? 'active' : 'inactive'}" style="font-size: 1rem; padding: 4px 12px; border-radius: 8px; background: ${currentProduct.status === 'active' ? '#dcfce7' : '#fee2e2'}; color: ${currentProduct.status === 'active' ? '#16a34a' : '#dc2626'}; margin-right: 8px;">${currentProduct.status === 'active' ? 'متوفر' : 'غير متوفر'}</span>
            </div>
        </div>
        <div class="product-fields-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 1.5rem;">
            ${getEditableFieldHTML('category', 'التصنيف', currentProduct.category || '---')}
            ${getEditableFieldHTML('barcode', 'الباركود', currentProduct.barcode)}
            ${getEditableFieldHTML('manufacturer', 'الشركة المصنعة', currentProduct.manufacturer)}
            ${getEditableFieldHTML('country', 'بلد التصنيع', currentProduct.country || '---')}
            ${getEditableFieldHTML('prodDate', 'تاريخ الإنتاج', currentProduct.prodDate, 'date')}
            ${getEditableFieldHTML('expDate', 'تاريخ انتهاء الصلاحية', currentProduct.expDate || 'غير محدد', 'date')}
        </div>
        <div class="product-description-box" style="background: #f8fafc; border-radius: 10px; padding: 16px; margin-bottom: 1rem; color: #334155; font-size: 1.08rem;">
            <span class="info-label" style="font-weight: bold; color: #1e3a8a;">الوصف:</span><br>
            <span id="product-description-value" class="info-value">${currentProduct.description || '---'}</span>
            <button class="edit-btn" style="margin-right:8px;" onclick="startEditField('description')"><i class="fas fa-edit"></i></button>
        </div>
    `;
    // تفعيل منطق التعديل لكل حقل
    activateEditableFields();
}

// دالة توليد HTML لحقل قابل للتعديل
function getEditableFieldHTML(field, label, value, type = 'text') {
    return `
        <div class="editable-field" data-field="${field}">
            <span class="info-label">${label}:</span>
            <span id="product-${field}-value" class="info-value">${value}</span>
            <button class="edit-btn" onclick="startEditField('${field}', '${type}')"><i class="fas fa-edit"></i></button>
        </div>
    `;
}

// منطق التبديل بين العرض والتعديل
window.startEditField = function(field, type = 'text') {
    const fieldDiv = document.querySelector(`.editable-field[data-field='${field}']`);
    if (!fieldDiv) return;
    const valueSpan = fieldDiv.querySelector('.info-value');
    const oldValue = valueSpan.textContent;
    let inputHTML = '';
    if (type === 'date') {
        inputHTML = `<input type="date" class="edit-input" value="${currentProduct[field] || ''}" style="padding:4px 8px; border-radius:6px; border:1px solid #e2e8f0; font-size:1rem;" />`;
    } else {
        inputHTML = `<input type="text" class="edit-input" value="${currentProduct[field] || ''}" style="padding:4px 8px; border-radius:6px; border:1px solid #e2e8f0; font-size:1rem;" />`;
    }
    fieldDiv.innerHTML = `
        <span class="info-label">${fieldDiv.querySelector('.info-label').textContent}</span>
        ${inputHTML}
        <button class="save-btn" style="margin-right:6px; color:#16a34a; background:none; border:none; font-size:1.1rem; cursor:pointer;" title="حفظ"><i class="fas fa-check"></i></button>
        <button class="cancel-btn" style="color:#dc2626; background:none; border:none; font-size:1.1rem; cursor:pointer;" title="إلغاء"><i class="fas fa-times"></i></button>
    `;
    // زر الحفظ
    fieldDiv.querySelector('.save-btn').onclick = function() {
        const newValue = fieldDiv.querySelector('.edit-input').value;
        currentProduct[field] = newValue;
        updateProductInfo();
    };
    // زر الإلغاء
    fieldDiv.querySelector('.cancel-btn').onclick = function() {
        updateProductInfo();
    };
}
// تفعيل منطق التعديل للوصف
window.startEditFieldDescription = function() {
    const descBox = document.querySelector('.product-description-box');
    const valueSpan = document.getElementById('product-description-value');
    const oldValue = valueSpan.textContent;
    descBox.innerHTML = `
        <span class="info-label" style="font-weight: bold; color: #1e3a8a;">الوصف:</span><br>
        <textarea class="edit-input" style="width:100%; min-height:60px; border-radius:8px; border:1px solid #e2e8f0; font-size:1.08rem; margin-top:6px;">${currentProduct.description || ''}</textarea>
        <div style="margin-top:8px;">
            <button class="save-btn" style="margin-right:6px; color:#16a34a; background:none; border:none; font-size:1.1rem; cursor:pointer;" title="حفظ"><i class="fas fa-check"></i></button>
            <button class="cancel-btn" style="color:#dc2626; background:none; border:none; font-size:1.1rem; cursor:pointer;" title="إلغاء"><i class="fas fa-times"></i></button>
        </div>
    `;
    descBox.querySelector('.save-btn').onclick = function() {
        const newValue = descBox.querySelector('.edit-input').value;
        currentProduct.description = newValue;
        updateProductInfo();
    };
    descBox.querySelector('.cancel-btn').onclick = function() {
        updateProductInfo();
    };
}
// تفعيل منطق التعديل لكل الحقول
function activateEditableFields() {
    // للوصف
    const descEditBtn = document.querySelector('.product-description-box .edit-btn');
    if (descEditBtn) {
        descEditBtn.onclick = function() { window.startEditFieldDescription(); };
    }
}

// دالة تحديث جدول المخزون
function updateInventoryTable() {
  const tbody = document.getElementById('inventory-table-body');
  tbody.innerHTML = '';
  
  productInventory.forEach(item => {
    const row = document.createElement('tr');
    
    // تحديد حالة المخزون
    let statusClass = 'status-normal';
    let statusText = 'طبيعي';
    
    if (item.status === 'low') {
      statusClass = 'status-low';
      statusText = 'منخفض';
    } else if (item.status === 'critical') {
      statusClass = 'status-critical';
      statusText = 'حرج';
    }
    
    row.innerHTML = `
      <td>${item.warehouse}</td>
      <td>${item.quantity}</td>
      <td><span class="inventory-status ${statusClass}">${statusText}</span></td>
      <td>${item.lastUpdate}</td>
    `;
    
    tbody.appendChild(row);
  });
}

// دالة تحديث إحصائيات المبيعات
function updateSalesStats() {
  document.getElementById('total-sales').textContent = productSales.total;
  document.getElementById('total-revenue').textContent = `${productSales.revenue.toLocaleString()} ريال`;
  
  // حساب متوسط التقييم
  const avgRating = calculateAverageRating();
  document.getElementById('avg-rating-stat').textContent = avgRating.toFixed(1);
}

// دالة تحديث التعليقات والتقييمات
function updateReviews() {
  // حساب متوسط التقييم
  const avgRating = calculateAverageRating();
  document.getElementById('average-rating').textContent = avgRating.toFixed(1);
  
  // تحديث النجوم
  const starsContainer = document.getElementById('average-stars');
  starsContainer.innerHTML = getStarsHTML(avgRating);
  
  // تحديث عدد التقييمات
  document.getElementById('total-reviews').textContent = `${productReviews.length} تقييم`;
  
  // تحديث أشرطة التقييم
  updateRatingBars();
  
  // تحديث قائمة التعليقات
  const reviewsContainer = document.getElementById('reviews-list-container');
  reviewsContainer.innerHTML = '';
  
  productReviews.forEach(review => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    
    reviewItem.innerHTML = `
      <div class="review-header">
        <div class="reviewer-name">${review.name}</div>
        <div class="review-date">${review.date}</div>
      </div>
      <div class="review-rating">${getStarsHTML(review.rating)}</div>
      <div class="review-text">${review.text}</div>
    `;
    
    reviewsContainer.appendChild(reviewItem);
  });
}

// دالة تحديث أشرطة التقييم
function updateRatingBars() {
  const container = document.getElementById('rating-bars-container');
  container.innerHTML = '';
  
  // حساب عدد التقييمات لكل نجمة
  const ratingCounts = [0, 0, 0, 0, 0];
  productReviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });
  
  // إنشاء أشرطة التقييم
  for (let i = 5; i >= 1; i--) {
    const count = ratingCounts[i - 1];
    const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
    
    const barItem = document.createElement('div');
    barItem.className = 'rating-bar-item';
    
    barItem.innerHTML = `
      <div>${i} ★</div>
      <div class="bar-container">
        <div class="bar" style="width: ${percentage}%"></div>
      </div>
      <div>${count}</div>
    `;
    
    container.appendChild(barItem);
  }
}

// دالة حساب متوسط التقييم
function calculateAverageRating() {
  if (productReviews.length === 0) return 0;
  
  const sum = productReviews.reduce((total, review) => total + review.rating, 0);
  return sum / productReviews.length;
}

// دالة إنشاء HTML للنجوم
function getStarsHTML(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // النجوم الممتلئة
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // نصف نجمة
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // النجوم الفارغة
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

// دالة تهيئة الرسوم البيانية
function initCharts() {
  // إنشاء رسم بياني للفئات العمرية
  window.ageChart = new Chart(document.getElementById('age-chart'), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'المبيعات',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)'
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
  
  // إنشاء رسم بياني للجنس
  window.genderChart = new Chart(document.getElementById('gender-chart'), {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)'
        ]
      }]
    },
    options: {
      responsive: true
    }
  });
}

// دالة تحديث الرسوم البيانية
function updateCharts() {
  // تحديث رسم بياني الفئات العمرية
  const ageLabels = Object.keys(productSales.byAge);
  const ageData = Object.values(productSales.byAge);
  
  window.ageChart.data.labels = ageLabels;
  window.ageChart.data.datasets[0].data = ageData;
  window.ageChart.update();
  
  // تحديث رسم بياني الجنس
  const genderLabels = Object.keys(productSales.byGender);
  const genderData = Object.values(productSales.byGender);
  
  window.genderChart.data.labels = genderLabels;
  window.genderChart.data.datasets[0].data = genderData;
  window.genderChart.update();
}
