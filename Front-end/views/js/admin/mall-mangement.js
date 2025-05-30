// Toggle form visibility
function toggleForm() {
    $('#mall-form').toggle();
}

// Fetch and display mall data
function fetchMalls() {
    // Show loading state
    $('#loading').show();
    $('#error').hide();
    $('table tbody').hide();

    $.ajax({
        url: 'http://localhost/IEMM/Back-end/public/api/malls',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayMalls(data);
            $('#loading').hide();
            $('table tbody').show();
        },
        error: function(xhr, status, error) {
            console.error('Error fetching mall data:', error);
            $('#loading').hide();
            $('#error').show();
        }
    });
}

// Display mall data in the table
async function displayMalls(malls) {
    const tbody = $('table tbody');
    tbody.empty(); // Clear existing data

    try {
        for (const m of malls.data) {
            const row = document.createElement("tr");

            // Create data cells
            const nameCell = document.createElement("td");
            nameCell.textContent = m.name || '-';

            const ownerCell = document.createElement("td");
            ownerCell.textContent = m.owner_name || '-';

            const locationCell = document.createElement("td");
            locationCell.innerHTML = `
                <div class="location-info">
                  <div class="location-main">
                    <span class="city-name">${m.city_name || '-'}</span>
                    <span class="location-sep">-</span>
                    <span class="location-address">${m.location || '-'}</span>
                  </div>
                  <a class="map-link" href="https://www.google.com/maps?q=${m.Y_Coordinates},${m.X_Coordinates}" target="_blank" title="عرض على الخريطة">
                    <i class="fa-solid fa-location-dot"></i> <span>عرض على الخريطة</span>
                  </a>
                </div>
            `;

            const floorsCell = document.createElement("td");
            floorsCell.className = "floors-col";
            floorsCell.textContent = m.floors_count || '0';

            const cityCell = document.createElement("td");
            cityCell.textContent = m.city_name || '-';

            // Add cells to row
            row.appendChild(nameCell);
            row.appendChild(ownerCell);
            row.appendChild(locationCell);
            row.appendChild(floorsCell);
            row.appendChild(cityCell);

            // Add action buttons
            const actionsCell = document.createElement("td");

            // View button
            const viewBtn = document.createElement("button");
            viewBtn.className = "btn-icon";
            viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            viewBtn.title = "عرض التفاصيل";
            viewBtn.onclick = () => showMallDetails(m);

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-icon";
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteBtn.title = "حذف المجمع";
            deleteBtn.onclick = () => deleteMall(m.id);

            actionsCell.appendChild(viewBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);

            // Add row to table
            tbody.append(row);
        }
    } catch (error) {
        console.error('Error displaying malls:', error);
        $('#error').show();
    }
}

// Edit mall function
function editMall(id) {
    // TODO: Implement edit functionality
    console.log('Edit mall:', id);
}

// Delete mall function
function deleteMall(id) {
    if (confirm('هل أنت متأكد من حذف هذا المجمع؟')) {
        $.ajax({
            url: `http://localhost/IEMM/Back-end/public/api/malls/${id}`,
            method: 'DELETE',
            success: function() {
                // Refresh the mall list
                fetchMalls();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting mall:', error);
                alert('حدث خطأ أثناء حذف المجمع');
            }
        });
    }
}

// Load cities function
function loadCities() {
    $.ajax({
        url: 'http://localhost/IEMM/Back-end/public/api/cities',
        method: 'GET',
        success: function(response) {
            const citySelect = $('select[name="city_id"]');
            citySelect.find('option:not(:first)').remove();
            
            response.data.forEach(city => {
                citySelect.append(`<option value="${city.id}">${city.name}</option>`);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error loading cities:', error);
        }
    });
}

// Add new mall function
function addMall(event) {
    if (event) {
        event.preventDefault(); // منع إرسال النموذج
    }

    // جمع بيانات النموذج
    const formData = {
        mall_name: $('input[name="mall_name"]').val(),
        owner_name: $('input[name="owner_name"]').val(),
        location: $('input[name="location"]').val(),
        location_link: $('input[name="location_link"]').val(),
        floors_count: parseInt($('input[name="floors_count"]').val()),
        username: $('input[name="username"]').val(),
        email: $('input[name="email"]').val(),
        sex: $('input[name="sex"]:checked').val(),
        password: $('input[name="password"]').val(),
        phone: $('input[name="phone"]').val(),
        birth_date: $('input[name="birth_date"]').val(),
        city_id: $('select[name="city_id"]').val()
    };

    // التحقق من الحقول المطلوبة
    if (!formData.mall_name || !formData.owner_name || !formData.location || 
        !formData.username || !formData.email || !formData.password || 
        !formData.phone || !formData.birth_date || !formData.city_id) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }

    // حفظ البيانات في ملف JSON للمعاينة (تنزيل الملف)
    const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mall_data.json";
    a.click();
    URL.revokeObjectURL(url);

    // عرض حالة التحميل
    $('#loading').show();

    // إرسال الطلب إلى الـ API
    $.ajax({
        url: 'http://localhost/IEMM/Back-end/public/api/malls',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        
        success: function(response) {
            // إخفاء النموذج وتحديث القائمة
            $('#mall-form').hide();
            fetchMalls();
            
            // تفريغ الحقول
            $('input').val('');
            $('select').val('');
            
            // عرض رسالة نجاح
            alert('تم إضافة المجمع بنجاح');
        },
        error: function(xhr, status, error) {
            console.error('Error adding mall:', error);
            if (xhr.responseJSON && xhr.responseJSON.errors) {
                // عرض الأخطاء
                const errors = xhr.responseJSON.errors;
                let errorMessage = 'الرجاء تصحيح الأخطاء التالية:\n';
                for (const field in errors) {
                    errorMessage += `- ${errors[field][0]}\n`;
                }
                alert(errorMessage);
            } else {
                alert('حدث خطأ أثناء إضافة المجمع');
            }
        },
        complete: function() {
            $('#loading').hide();
        }
    });
}

// Submit owner change function
function submitOwnerChange() {
    const mallId = document
        .getElementById("changeOwnerBtn")
        .getAttribute("data-mall-id");
    const formData = {
        owner_name: $('input[name="newOwnerName"]').val(), 
        username: $('input[name="newUsername"]').val(),
        email: $('input[name="newOwnerEmail"]').val(),
        sex: $('input[name="newSex"]:checked').val(),
        password: $('input[name="newPassword"]').val(),
        phone: $('input[name="newPhone"]').val(),
        birth_date: $('input[name="newBirthDate"]').val(),
        
    };
    // const formData = {
        
    //     username: document.getElementById("newUsername").value,
    //     owner_name: document.getElementById("newOwnerName").value,
    //     email: document.getElementById("newOwnerEmail").value,
    //     password: document.getElementById("newPassword").value,
    //     sex: $('input[name="newSex"]:checked').val(),
    //     phone: document.getElementById("newPhone").value,
    //     birth_date: document.getElementById("newBirthDate").value
    // };

    // Validate required fields
    if (!formData.username || !formData.owner_name || !formData.email || 
        !formData.password || !formData.phone || !formData.birth_date) {
        alert("الرجاء إدخال جميع البيانات المطلوبة");
        return;
    }

    // Show loading state
    $('#loading').show();

    // Send PUT request to API
    $.ajax({
        url: `http://localhost/IEMM/Back-end/public/api/malls/${mallId}/owner`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            // Hide form and refresh mall list
            document.getElementById("changeOwnerForm").style.display = "none";
            document.getElementById("changeOwnerBtn").style.display = "block";
            document.getElementById("mallDetailsModal").style.display = "none";
            
            // Clear form fields
            document.getElementById("newUsername").value = "";
            document.getElementById("newOwnerName").value = "";
            document.getElementById("newOwnerEmail").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("newMale").checked = false;
            document.getElementById("newFemale").checked = false;
            document.getElementById("newPhone").value = "";
            document.getElementById("newBirthDate").value = "";
            
            // Refresh the mall list
            fetchMalls();
            loadCities();
            // Show success message
            
        },
        error: function(xhr, status, error) {
            console.error('Error changing mall owner:', error);
            if (xhr.responseJSON && xhr.responseJSON.errors) {
                // Show validation errors
                const errors = xhr.responseJSON.errors;
                let errorMessage = 'الرجاء تصحيح الأخطاء التالية:\n';
                for (const field in errors) {
                    errorMessage += `- ${errors[field][0]}\n`;
                }
                alert(errorMessage);
            } else {
                alert('حدث خطأ أثناء تغيير مالك المجمع');
            }
        },
        complete: function() {
            $('#loading').hide();
        }
    });
}

// Initialize the page
$(document).ready(function() {
    fetchMalls();
    loadCities();
});
function showMallDetails(mallData) {
        const detailsContent = document.getElementById("mallDetailsContent");

        // تفريغ المحتوى السابق
        detailsContent.innerHTML = "";

        // إضافة بيانات المجمع
        detailsContent.innerHTML += `<p><strong>اسم المجمع:</strong> ${mallData.name}</p>`;
        detailsContent.innerHTML += `<p><strong>المالك:</strong> ${mallData.owner_name}</p>`;
        detailsContent.innerHTML += `<p><strong>الموقع:</strong> ${mallData.location}</p>`;
        detailsContent.innerHTML += `<p><strong>عدد الطوابق:</strong> ${mallData.floors_count}</p>`;
        detailsContent.innerHTML += `<p><strong>المدينة:</strong> ${mallData.city_name}</p>`;

        // تخزين معرف المجمع للاستخدام في زر تغيير المالك
        document
          .getElementById("changeOwnerBtn")
          .setAttribute("data-mall-id", mallData.id);

        // عرض النافذة
        modal.style.display = "block";
      }

      // دالة لتغيير مالك المجمع
      document
        .getElementById("changeOwnerBtn")
        .addEventListener("click", function () {
          const changeOwnerForm = document.getElementById("changeOwnerForm");
          changeOwnerForm.style.display =
            changeOwnerForm.style.display === "none" ? "block" : "none";
          this.style.display = "none";
        });

      // دالة لإلغاء تغيير المالك
      function cancelOwnerChange() {
        document.getElementById("changeOwnerForm").style.display = "none";
        document.getElementById("changeOwnerBtn").style.display = "block";
        document.getElementById("newUsername").value = "";
        document.getElementById("newOwnerName").value = "";
        document.getElementById("newOwnerEmail").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("newMale").checked = false;
        document.getElementById("newFemale").checked = false;
        document.getElementById("newPhone").value = "";
        document.getElementById("newBirthDate").value = "";
      }

      // دالة لحفظ تغييرات المالك الجديد
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

      document.addEventListener('DOMContentLoaded', function () {
        applyNightModeFromCookie();
        const nightModeBtn = document.querySelector('.btn-dark');
        if (nightModeBtn) {
          nightModeBtn.onclick = function () {
            document.body.classList.toggle('dark');
            setCookie('nightMode', document.body.classList.contains('dark') ? 'on' : 'off', 365);
          };
        }
      });

// دالة البحث في المجمعات
function searchMalls(searchTerm) {
    const tbody = document.querySelector('table tbody');
    const rows = tbody.getElementsByTagName('tr');
    
    searchTerm = searchTerm.toLowerCase();
    
    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        // البحث في جميع الخلايا ما عدا خلية الإجراءات
        for (let i = 0; i < cells.length - 1; i++) {
            const cellText = cells[i].textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                found = true;
                break;
            }
        }
        
        // إظهار أو إخفاء الصف بناءً على نتيجة البحث
        row.style.display = found ? '' : 'none';
    }
}
      