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
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
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
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
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

// Initialize the page
$(document).ready(function() {
    fetchMalls();
    loadCities();
});
function loadCities() {
    $.ajax({
        url: 'http://localhost/IEMM/Back-end/public/api/cities',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
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
      