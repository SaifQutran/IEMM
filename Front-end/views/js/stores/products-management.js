// دالة معاينة الصور
document
  .getElementById("productImages")
  .addEventListener("change", function (e) {
    const container = document.getElementById("imagePreviewContainer");
    container.innerHTML = "";

    Array.from(e.target.files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.createElement("div");
        preview.className = "image-preview";
        preview.innerHTML = `
          <img src="${e.target.result}" alt="Preview" />
          <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
        `;
        container.appendChild(preview);
      };
      reader.readAsDataURL(file);
    });
  });

// دالة حذف صورة
function removeImage(index) {
  const container = document.getElementById("imagePreviewContainer");
  const previews = container.getElementsByClassName("image-preview");
  if (previews[index]) {
    previews[index].remove();
  }
}

// تهيئة بيانات المنتجات
document.addEventListener("DOMContentLoaded", function () {
  // Fetch products using AJAX
  const shopId = localStorage.getItem('shop_id');
  $.ajax({
    url: `http://localhost/IEMM/Back-end/public/api/shops/${shopId}/products`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    success: function(response) {
      if (response.status === 'success' && Array.isArray(response.data)) {
        window.products = response.data;
        renderProductsTable(response.data);
      }
    },
    error: function(xhr, status, error) {
      console.error('Error fetching products:', error);
    }
  });
});

function renderProductsTable(products) {
  const tbody = document.getElementById("products-table-body");
  tbody.innerHTML = '';
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.barcode}</td>
      <td>${product.manufacturer || ''}</td>
      <td>${product.category || ''}</td>
      <td>${product.price} ريال</td>
      <td>${product.formatted_quantity || '0 (0)'}</td>
      <td>
        <button class="btn-icon" onclick='showProductDetails(${JSON.stringify(product)})' title="عرض"><i class="fas fa-eye"></i></button>
        <button class="btn-icon" onclick='deleteProduct(${JSON.stringify(product)})' title="حذف"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// متغير لتتبع المنتج المراد حذفه
let deleteProductId = null;
let deleteProductName = null;

function deleteProduct(product) {
  deleteProductId = product.id;
  deleteProductName = product.name;
  document.getElementById('delete-modal-title').textContent = 'تأكيد حذف المنتج';
  document.getElementById('delete-confirm-message').innerHTML =
    `هل أنت متأكد من حذف المنتج <strong>${product.name}</strong>؟<br>سيتم حذف جميع بيانات هذا المنتج.`;
  document.getElementById('delete-confirm-modal').style.display = 'block';
}

function confirmDeleteProduct() {
  if (deleteProductId !== null) {
    $.ajax({
      url: `http://localhost/IEMM/Back-end/public/api/products/${deleteProductId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      success: function(response) {
        if (response.status === 'success') {
          // Remove product from local array
          window.products = window.products.filter(p => p.id !== deleteProductId);
          // Update table
          renderProductsTable(window.products);
          // Show success message
          document.getElementById('delete-modal-title').textContent = 'تم الحذف بنجاح';
          document.getElementById('delete-confirm-message').innerHTML = 
            `تم حذف المنتج <strong>${deleteProductName}</strong> بنجاح.`;
          setTimeout(() => {
            closeDeleteModal();
          }, 1500);
        } else {
          document.getElementById('delete-modal-title').textContent = 'خطأ في الحذف';
          document.getElementById('delete-confirm-message').innerHTML = 
            'حدث خطأ أثناء حذف المنتج. يرجى المحاولة مرة أخرى.';
        }
      },
      error: function(xhr, status, error) {
        console.error('Error deleting product:', error);
        document.getElementById('delete-modal-title').textContent = 'خطأ في الحذف';
        document.getElementById('delete-confirm-message').innerHTML = 
          'حدث خطأ أثناء حذف المنتج. يرجى المحاولة مرة أخرى.';
      }
    });
  }
}

function closeDeleteModal() {
  document.getElementById('delete-confirm-modal').style.display = 'none';
  deleteProductId = null;
  deleteProductName = null;
}

function closeProductDetails() {
  // Hide the product details modal
  const modal = document.getElementById('product-details-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  // Optionally, re-enable background scrolling if you disabled it
  document.body.style.overflow = '';
}

function showProductDetails(product) {
  // تحديث المعلومات الأساسية
  const elements = {
    name: document.getElementById('modal-product-name'),
    price: document.querySelector('.price-value'),
    description: document.getElementById('modal-product-description'),
    category: document.getElementById('modal-product-category'),
    barcode: document.getElementById('modal-product-barcode'),
    country: document.getElementById('modal-product-country'),
    manufacturer: document.getElementById('modal-product-manufacturer'),
    imagesGrid: document.getElementById('product-images-grid'),
    inventoryTbody: document.getElementById('inventory-table-body'),
    reviewsList: document.getElementById('reviews-list-container'),
    averageRating: document.getElementById('average-rating'),
    totalReviews: document.getElementById('total-reviews'),
    stars: document.getElementById('average-stars'),
    totalSales: document.getElementById('total-sales'),
    totalRevenue: document.getElementById('total-revenue')
  };

  // Check if all required elements exist
  if (!elements.name || !elements.price || !elements.description) {
    console.error('Required modal elements not found');
    return;
  }

  // Update basic information
  elements.name.textContent = product.name;
  elements.price.textContent = product.price;
  elements.description.textContent = product.description;
  
  if (elements.category) elements.category.textContent = product.category;
  if (elements.barcode) elements.barcode.textContent = product.barcode;
  if (elements.country) elements.country.textContent = product.country;
  if (elements.manufacturer) elements.manufacturer.textContent = product.manufacturer;

  // تحديث عرض الصور
  if (elements.imagesGrid) {
    elements.imagesGrid.innerHTML = '';
    editImages = product.image_urls ? [...product.image_urls] : [];

    if (product.image_urls && product.image_urls.length > 0) {
      product.image_urls.forEach((imageUrl, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'product-image-item';
        imageItem.innerHTML = `
          <img src="http://localhost/IEMM/Back-end/storage/app/public/${imageUrl}" alt="صورة المنتج ${index + 1}" onclick="showFullImage('http://localhost/IEMM/Back-end/storage/app/public/${imageUrl}')" />
        `;
        elements.imagesGrid.appendChild(imageItem);
      });
    } else {
      const defaultImage = document.createElement('div');
      defaultImage.className = 'product-image-item';
      defaultImage.innerHTML = `
        <img src="https://via.placeholder.com/400?text=لا+توجد+صور" alt="صورة افتراضية" />
      `;
      elements.imagesGrid.appendChild(defaultImage);
    }
  }

  // تحديث تفاصيل المخزون
  if (elements.inventoryTbody) {
    elements.inventoryTbody.innerHTML = '';
    if (product.stocks && product.stocks.length > 0) {
      product.stocks.forEach(stock => {
        const row = document.createElement('tr');
        // Format the date
        const lastUpdate = stock.updated_at ? new Date(stock.updated_at).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'غير محدد';
        
        row.innerHTML = `
          <td>${stock.warehouse_name || 'غير محدد'}</td>
          <td>${stock.quantity}</td>
          <td>${stock.production_date || 'غير محدد'}</td>
          <td>${stock.expiration_date || 'غير محدد'}</td>
          <td>${lastUpdate}</td>
        `;
        elements.inventoryTbody.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="5">لا توجد بيانات مخزون متاحة</td>`;
      elements.inventoryTbody.appendChild(row);
    }
  }

  // تحديث التعليقات والتقييمات
  if (elements.reviewsList && elements.averageRating && elements.totalReviews && elements.stars) {
    const reviews = product.reviews || [];
    elements.reviewsList.innerHTML = '';
    if (reviews.length > 0) {
      // حساب المتوسط
      const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
      elements.averageRating.textContent = avg;
      elements.totalReviews.textContent = `${reviews.length} تقييم`;
      // عرض النجوم
      const fullStars = Math.floor(avg);
      const halfStar = avg - fullStars >= 0.5;
      let starsHtml = '';
      for (let i = 0; i < fullStars; i++) starsHtml += '★';
      if (halfStar) starsHtml += '☆';
      for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) starsHtml += '☆';
      elements.stars.textContent = starsHtml;
      // عرض التعليقات
      reviews.forEach(r => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-item';
        reviewDiv.innerHTML = `
          <div class="review-header">
            <span class="review-user"><i class="fas fa-user"></i> ${r.user}</span>
            <span class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
          </div>
          <div class="review-comment">${r.comment}</div>
        `;
        elements.reviewsList.appendChild(reviewDiv);
      });
    } else {
      elements.averageRating.textContent = '0.0';
      elements.totalReviews.textContent = 'لا يوجد تقييمات';
      elements.stars.textContent = '☆☆☆☆☆';
      elements.reviewsList.innerHTML = '<div style="color:#64748b; text-align:center;">لا توجد تعليقات بعد.</div>';
    }
  }

  // تحديث إحصائيات المبيعات
  if (elements.totalSales) elements.totalSales.textContent = product.sales_count || '0';
  if (elements.totalRevenue) elements.totalRevenue.textContent = (product.incomes || '0') + ' ريال';

  // تحديث الرسوم البيانية
  updateCharts(product);

  // عرض النافذة
  const modal = document.getElementById('productDetailsModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
  } else {
    console.error('Product details modal not found');
  }
}

function updateCharts(product) {
  // تحديث الرسم البياني للمبيعات حسب الفئة العمرية
  const ageCtx = document.getElementById('age-chart');
  if (ageCtx) {
    if (window.ageChart) {
      window.ageChart.destroy();
    }
    window.ageChart = new Chart(ageCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['أقل من 18', '18-24', '25-34', '35-44', '45+'],
        datasets: [{
          label: 'المبيعات',
          data: product.salesByAge || [0, 0, 0, 0, 0],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          barThickness: 20,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // تحديث الرسم البياني للمبيعات حسب الجنس
  const genderCtx = document.getElementById('gender-chart');
  if (genderCtx) {
    if (window.genderChart) {
      window.genderChart.destroy();
    }
    window.genderChart = new Chart(genderCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['ذكور', 'إناث'],
        datasets: [{
          data: product.salesByGender || [0, 0],
          backgroundColor: ['#3b82f6', '#f472b6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: '70%'
      }
    });
  }
}

function filterProductsTable() {
  const searchValue = document.getElementById('global-search').value.trim().toLowerCase();
  const rows = document.querySelectorAll('#products-table-body tr');
  
  rows.forEach(row => {
    let show = false;
    // Search in all cells except the last one (actions column)
    for (let i = 0; i < row.cells.length - 1; i++) {
      const cellText = row.cells[i].textContent.toLowerCase();
      if (cellText.includes(searchValue)) {
        show = true;
        break;
      }
    }
    row.style.display = show ? '' : 'none';
  });
}

// دالة تبديل وضع التعديل
function toggleEditMode() {
  try {
    // First check if we're in the correct modal
    const modal = document.getElementById('productDetailsModal');
    if (!modal || modal.style.display !== 'block') {
      console.error('Product details modal is not open');
      return;
    }

    // Get all required elements
    const elements = {
      editBtn: document.getElementById('editProductBtn'),
      closeEditBtn: document.getElementById('closeEditBtn'),
      editActions: document.querySelector('.edit-actions'),
      nameTitle: document.getElementById('modal-product-name'),
      nameInput: document.getElementById('edit-product-name'),
      priceValue: document.querySelector('.price-value'),
      description: document.getElementById('modal-product-description'),
      category: document.getElementById('modal-product-category'),
      barcode: document.getElementById('modal-product-barcode'),
      country: document.getElementById('modal-product-country'),
      manufacturer: document.getElementById('modal-product-manufacturer'),
      prodDate: document.getElementById('modal-product-prodDate'),
      expDate: document.getElementById('modal-product-expDate'),
      editImagesControls: document.getElementById('edit-images-controls')
    };

    // Check if all required elements exist
    const missingElements = Object.entries(elements)
      .filter(([key, element]) => !element)
      .map(([key]) => key);

    if (missingElements.length > 0) {
      console.error('Missing required elements:', missingElements);
      return;
    }

    const displayElements = document.querySelectorAll('.editable-field span, .editable-field div:not(.edit-input)');
    const editInputs = document.querySelectorAll('.edit-input');

    if (elements.editBtn.innerHTML.includes('تعديل')) {
      // حفظ البيانات الأصلية
      originalProductData = {
        name: elements.nameTitle.textContent || '',
        price: elements.priceValue.textContent || '',
        description: elements.description.textContent || '',
        category: elements.category.textContent || '',
        barcode: elements.barcode.textContent || '',
        country: elements.country.textContent || '',
        manufacturer: elements.manufacturer.textContent || '',
        prodDate: elements.prodDate.textContent || '',
        expDate: elements.expDate.textContent || ''
      };

      // تبديل الأزرار
      elements.editBtn.style.display = 'none';
      elements.closeEditBtn.style.display = 'flex';
      elements.editActions.style.display = 'flex';

      // إظهار input الاسم فقط وإخفاء العنوان
      elements.nameTitle.style.display = 'none';
      elements.nameInput.style.display = 'block';
      elements.nameInput.value = originalProductData.name;
      elements.nameInput.focus();

      // باقي الحقول
      displayElements.forEach(el => {
        if (el !== elements.nameTitle) el.style.display = 'none';
      });

      editInputs.forEach(input => {
        if (input !== elements.nameInput) {
          input.style.display = 'block';
          // تعبئة البيانات في حقول التعديل
          switch(input.id) {
            case 'edit-product-price':
              input.value = parseFloat(originalProductData.price) || 0;
              break;
            case 'edit-product-description':
              input.value = originalProductData.description;
              break;
            case 'edit-product-category':
              const categoryOptions = input.options;
              for (let i = 0; i < categoryOptions.length; i++) {
                if (categoryOptions[i].text === originalProductData.category) {
                  input.value = categoryOptions[i].value;
                  break;
                }
              }
              break;
            case 'edit-product-barcode':
              input.value = originalProductData.barcode;
              break;
            case 'edit-product-country':
              input.value = originalProductData.country;
              break;
            case 'edit-product-manufacturer':
              input.value = originalProductData.manufacturer;
              break;
            case 'edit-product-prodDate':
              input.value = originalProductData.prodDate;
              break;
            case 'edit-product-expDate':
              input.value = originalProductData.expDate;
              break;
          }
        }
      });

      // عند فتح وضع التعديل، توليد قائمة الدول بدون تكرار
      const countries = Array.from(new Set((window.products || []).map(p => p.country).filter(Boolean)));
      const countrySelect = document.getElementById('edit-product-country');
      if (countrySelect) {
        countrySelect.innerHTML = countries.map(c => `<option value="${c}">${c}</option>`).join('');
        countrySelect.value = originalProductData.country;

        countrySelect.oninput = function() {
          const val = this.value;
          for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].value === val) {
              this.selectedIndex = i;
              break;
            }
          }
        };
        countrySelect.onkeydown = function(e) {
          if (e.key === 'Enter' || e.key === 'Tab') {
            const found = Array.from(this.options).some(opt => opt.value === this.value);
            if (!found) {
              e.preventDefault();
              this.value = '';
            }
          }
        };
      }
    }

    if (elements.editImagesControls) {
      elements.editImagesControls.style.display = 'block';
    }
    renderEditImages();
  } catch (error) {
    console.error('Error in toggleEditMode:', error);
  }
}

// دالة إلغاء التعديل
function cancelEdit() {
  const editBtn = document.getElementById('editProductBtn');
  const closeEditBtn = document.getElementById('closeEditBtn');
  const editActions = document.querySelector('.edit-actions');
  const nameTitle = document.getElementById('modal-product-name');
  const nameInput = document.getElementById('edit-product-name');
  const displayElements = document.querySelectorAll('.editable-field span, .editable-field div:not(.edit-input)');
  const editInputs = document.querySelectorAll('.edit-input');

  // إعادة البيانات الأصلية
  if (originalProductData) {
    nameTitle.textContent = originalProductData.name;
    document.querySelector('.price-value').textContent = originalProductData.price;
    document.getElementById('modal-product-description').textContent = originalProductData.description;
    document.getElementById('modal-product-category').textContent = originalProductData.category;
    document.getElementById('modal-product-barcode').textContent = originalProductData.barcode;
    document.getElementById('modal-product-country').textContent = originalProductData.country;
    document.getElementById('modal-product-manufacturer').textContent = originalProductData.manufacturer;
    document.getElementById('modal-product-prodDate').textContent = originalProductData.prodDate;
    document.getElementById('modal-product-expDate').textContent = originalProductData.expDate;
  }

  // إعادة الأزرار
  editBtn.style.display = 'flex';
  closeEditBtn.style.display = 'none';
  editActions.style.display = 'none';

  // إظهار العنوان وإخفاء input الاسم
  nameTitle.style.display = 'block';
  nameInput.style.display = 'none';

  // إعادة عرض العناصر
  displayElements.forEach(el => el.style.display = 'block');
  editInputs.forEach(input => {
    if (input !== nameInput) input.style.display = 'none';
  });

  originalProductData = null;
  document.getElementById('edit-images-controls').style.display = 'none';
  renderEditImages(false);
}

// دالة حفظ التغييرات
function saveProductChanges() {
  const updatedData = {
    name: document.getElementById('edit-product-name').value,
    price: document.getElementById('edit-product-price').querySelector('input').value,
    description: document.getElementById('edit-product-description').value,
    category: document.getElementById('edit-product-category').options[document.getElementById('edit-product-category').selectedIndex].text,
    barcode: document.getElementById('edit-product-barcode').value,
    country: document.getElementById('edit-product-country').value,
    manufacturer: document.getElementById('edit-product-manufacturer').value,
    prodDate: document.getElementById('edit-product-prodDate').value,
    expDate: document.getElementById('edit-product-expDate').value
  };

  // Send update request using AJAX
  $.ajax({
    url: `http://localhost/IEMM/Back-end/public/api/products/${currentProductId}`,
    method: 'PUT',
    data: updatedData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    success: function(response) {
      if (response.status === 'success') {
        // Update local data
        const index = window.products.findIndex(p => p.id === currentProductId);
        if (index !== -1) {
          window.products[index] = { ...window.products[index], ...updatedData };
          renderProductsTable(window.products);
        }

        // Update display
        document.getElementById('modal-product-name').textContent = updatedData.name;
        document.querySelector('.price-value').textContent = updatedData.price;
        document.getElementById('modal-product-description').textContent = updatedData.description;
        document.getElementById('modal-product-category').textContent = updatedData.category;
        document.getElementById('modal-product-barcode').textContent = updatedData.barcode;
        document.getElementById('modal-product-country').textContent = updatedData.country;
        document.getElementById('modal-product-manufacturer').textContent = updatedData.manufacturer;
        document.getElementById('modal-product-prodDate').textContent = updatedData.prodDate;
        document.getElementById('modal-product-expDate').textContent = updatedData.expDate || 'غير محدد';

        alert('تم حفظ التغييرات بنجاح');
        cancelEdit();
      } else {
        alert('حدث خطأ أثناء حفظ التغييرات');
      }
    },
    error: function(xhr, status, error) {
      console.error('Error updating product:', error);
      alert('حدث خطأ أثناء حفظ التغييرات');
    }
  });
}

// دالة إضافة منتج جديد
function addNewProduct(formData) {
  $.ajax({
    url: 'http://localhost/IEMM/Back-end/public/api/products',
    method: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    success: function(response) {
      if (response.status === 'success') {
        // Add new product to local array
        window.products.push(response.data);
        // Update table
        renderProductsTable(window.products);
        // Close form
        document.getElementById('newProductFormContainer').style.display = 'none';
        alert('تم إضافة المنتج بنجاح');
      } else {
        alert('حدث خطأ أثناء إضافة المنتج');
      }
    },
    error: function(xhr, status, error) {
      console.error('Error adding product:', error);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  });
}

// دالة إضافة مخزن جديد
function addStoreInput() {
  const storesContainer = document.getElementById('stores-container');
  const newStoreIndex = storesContainer.children.length + 1;
  
  const storeDiv = document.createElement('div');
  storeDiv.className = 'store-input-group additional-store';
  storeDiv.innerHTML = `
    <div class="store-header">
      <h5><i class="fas fa-store"></i> المخزن ${newStoreIndex}</h5>
      <button type="button" class="remove-store" onclick="removeStoreInput(this)">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="store-inputs-grid">
      <div class="form-group">
        <label>المخزن</label>
        <select required>
          <option value="">اختر المخزن</option>
          <option value="1">المخزن الرئيسي</option>
          <option value="2">مخزن الفرع الأول</option>
          <option value="3">مخزن الفرع الثاني</option>
        </select>
      </div>
      <div class="form-group">
        <label>الكمية</label>
        <input type="number" required placeholder="0" />
      </div>
      <div class="form-group">
        <label>الحد الأدنى للكمية</label>
        <input type="number" required placeholder="0" />
      </div>
      <div class="form-group">
        <label>تاريخ الإنتاج</label>
        <input type="date" required />
      </div>
      <div class="form-group">
        <label>تاريخ انتهاء الصلاحية</label>
        <input type="date" />
      </div>
    </div>
  `;
  
  storesContainer.appendChild(storeDiv);
}

// دالة حذف مخزن
function removeStoreInput(button) {
  const storeDiv = button.closest('.store-input-group');
  storeDiv.remove();
}

// دالة عرض الصورة كاملة
function showFullImage(imageUrl) {
  const modal = document.createElement('div');
  modal.className = 'modal full-image-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="btn-close" onclick="this.closest('.modal').remove()">
        <i class="fas fa-times"></i>
      </button>
      <img src="${imageUrl}" alt="صورة المنتج" />
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// دالة تحديث عرض الصور في وضع التعديل
function renderEditImages(isEditMode = true) {
  const imagesGrid = document.getElementById('product-images-grid');
  if (!imagesGrid) return;

  if (isEditMode && editImages) {
    imagesGrid.innerHTML = '';
    editImages.forEach((imageUrl, index) => {
      const imageItem = document.createElement('div');
      imageItem.className = 'product-image-item';
      imageItem.innerHTML = `
        <img src="http://localhost/IEMM/Back-end/storage/app/public/${imageUrl}" alt="صورة المنتج ${index + 1}" onclick="showFullImage('http://localhost/IEMM/Back-end/storage/app/public/${imageUrl}')" />
        <button type="button" class="remove-image" onclick="removeEditImage(${index})">
          <i class="fas fa-times"></i>
        </button>
      `;
      imagesGrid.appendChild(imageItem);
    });
  }
}

// دالة حذف صورة في وضع التعديل
function removeEditImage(index) {
  if (editImages && editImages[index]) {
    editImages.splice(index, 1);
    renderEditImages(true);
  }
}

// دالة معالجة إضافة صور جديدة في وضع التعديل
function handleAddEditImages(event) {
  const files = event.target.files;
  if (!files) return;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      // هنا يمكنك إضافة الصورة إلى editImages
      // وتحديث العرض
      renderEditImages(true);
    };
    reader.readAsDataURL(file);
  });
}

// تهيئة المتغيرات العامة
let originalProductData = null;
let editImages = [];
let currentProductId = null;

