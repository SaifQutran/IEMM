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
            const row = `
                <tr>
                    <td>${m.name || '-'}</td>
                    <td>${m.owner_name || '-'}</td>
                    <td>
                        ${m.location || '-'}
                        <br> 
                        <a href="https://www.google.com/maps?q=${m.Y_Coordinates},${m.X_Coordinates}" target="_blank">
                            عرض على الخريطة
                        </a>
                    </td>
                    <td>${m.floors_count || '0'}</td>
                    <td>${m.city_name}</td>
                    <td>
                        <button class="btn-edit" onclick="editMall(${m.id})">✏️</button>
                        <button class="btn-delete" onclick="deleteMall(${m.id})">🗑️</button>
                    </td>
                </tr>
            `;
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
        sex: $('input[name="sex"]').val(),
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
                const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mall_response.json";
    a.click();
    URL.revokeObjectURL(url);

    // عرض حالة التحميل
    $('#loading').show();

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

// Initialize the page
$(document).ready(function() {
    fetchMalls();
    loadCities();
});