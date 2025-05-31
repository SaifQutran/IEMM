const API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/1/shops';
const facility_API_URL='http://localhost/IEMM/Back-end/public/api/malls/1/facilities';
const OWNER_API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/1/shops/owners';
// const API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/shops';
// const facility_API_URL='http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/facilities';
// const OWNER_API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/shops/owners';

// Add these functions at the class level, before the StoreManagement class
function showDeleteModal(message, onConfirm) {
    // Set the message
    $('#delete-confirm-message').text(message);
    
    // Show the modal
    $('#delete-confirm-modal').css('display', 'block');
    
    // Handle delete button click
    $('#delete-confirm-modal .btn-secondary').off('click').on('click', function() {
        onConfirm();
        $('#delete-confirm-modal').css('display', 'none');
    });
    
    // Handle cancel button click
    $('#delete-confirm-modal .btn-green').off('click').on('click', function() {
        $('#delete-confirm-modal').css('display', 'none');
    });
    
    // Handle close button click
    $('#delete-confirm-modal .close-modal').off('click').on('click', function() {
        $('#delete-confirm-modal').css('display', 'none');
    });
    
    // Handle click outside modal
    $(window).off('click').on('click', function(event) {
        if ($(event.target).is('#delete-confirm-modal')) {
            $('#delete-confirm-modal').css('display', 'none');
        }
    });
}

class StoreManagement {
    constructor() {
        this.initializeEventListeners();
        this.loadStores();
        this.loadFacilitiesForDropdown();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Handle new store form submission
        $('#newStoreFormContainer').on('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const storeData = {
                shop_name: formData.get('shop_name'),
                mall_id: localStorage.getItem("mall_id"),
                owner_name: formData.get('owner_name'),
                facility_id: formData.get('facility_id'),
                work_times: formData.get('work_times'),
                username: formData.get('username'),
                email: formData.get('email'),
                sex: formData.get('sex') === 'male' ? 'true' : 'false',
                password: formData.get('password'),
                phone: formData.get('phone'),
                birth_date: formData.get('birth_date')
            };

            // Get the image file
            const imageFile = formData.get('image');
            if (imageFile) {
                storeData.image = imageFile;
            }
            
            this.addStore(storeData);
        });
        
        // Handle modal close buttons
        $('.modal .btn-secondary').on('click', function() {
            $(this).closest('.modal').hide();
        });
    }

    // Load all stores
    loadStores() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                const storesTable = $('table tbody.stores-table');
                storesTable.empty();
                response.data.forEach(store => {
                    const row = `
                        <tr>
                            <td>${store.owner_name}</td>
                            <td>${store.name}</td>
                            <td>${store.categories_names}</td>
                            <td>${store.floor}</td>
                            <td>${store.shop_state}</td>
                            <td>${store.rent_began_At.substring(0, 10)}</td>
                            <td>${store.work_times}</td>
                            <td>
                            <button class="btn-icon view-btn" title="عرض" onclick="StoreManagement.openViewModal(${JSON.stringify(store).replace(/"/g, '&quot;')})"><i class="fas fa-eye"></i></button>
                            <button class="btn-icon" title="حذف" onclick="storeManagement.deleteStore(${store.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                    storesTable.append(row);
                });
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحميل بيانات المحلات');
                console.error(error);
            }
        });
    }
   
    // Load facilities for dropdown
    loadFacilitiesForDropdown() {
        $.ajax({
            url: facility_API_URL,
            method: 'GET',
            success: (response) => {
                const facilitySelect = $('select[name="facility_id"]');
                facilitySelect.empty();
                facilitySelect.append('<option value="">اختر المرفق</option>');
                
                response.data.forEach(facility => {
                    if (facility.facility_state === "فارغ") { // Only show available facilities
                        facilitySelect.append(`<option value="${facility.id}">مرفق ${facility.id} - الدور ${facility.floor_number}</option>`);
                    }
                });
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحميل بيانات المرافق');
                console.error(error);
            }
        });
    }

    // Add new store
    addStore(storeData) {
        const formData = new FormData();
        
        // Append all store data to FormData
        Object.keys(storeData).forEach(key => {
            formData.append(key, storeData[key]);
        });

        $.ajax({
            url: 'http://localhost/IEMM/Back-end/public/api/shops/',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            data: storeData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                alert('تم إضافة المحل بنجاح');
                this.loadStores();
                this.closeModal('newStoreFormContainer');
                // Reset form
                $('#newStoreFormContainer form')[0].reset();
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء إضافة المحل');
                console.error(error);
            }
        });
    }

    // Change the openViewModal to be a static method
    static openViewModal(data) {
        const modal = document.getElementById('viewEditModal');
        if (!modal) {
            console.error('Modal element not found! Make sure you have an element with id="viewEditModal"');
            return;
        }

        const title = document.getElementById('viewEditModalTitle');
        if (!title) {
            console.error('Modal title element not found! Make sure you have an element with id="viewEditModalTitle"');
            return;
        }

        const fieldsContainer = document.getElementById('viewEditFields');
        if (!fieldsContainer) {
            console.error('Fields container not found! Make sure you have an element with id="viewEditFields"');
            return;
        }

        fieldsContainer.innerHTML = '';
        title.textContent = 'بيانات المحل';

        // تعريف الحقول حسب النوع
        const fields = [
            {label: 'اسم المالك', key: 'owner_name', type: 'text'},
            {label: 'اسم المحل', key: 'name', type: 'text'},
            {label: 'الدور', key: 'floor', type: 'number'},
            {label: 'النشاط', key: 'shop_state', type: 'text'},
            {label: 'تاريخ بدء العقد', key: 'rent_began_At', type: 'date'},
            {label: 'أوقات الدوام', key: 'work_times', type: 'text'}
        ];

        // توليد الحقول
        fields.forEach(field => {
            const value = data[field.key] || '';
            const fieldId = `view-field-${field.key}`;
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'form-group';
            fieldDiv.style.position = 'relative';
            fieldDiv.innerHTML = `
                <label>${field.label}</label>
                <span id="${fieldId}" class="field-value">${field.type === 'date' && value ? value.split('T')[0] : value}</span>
                
            `;
            fieldsContainer.appendChild(fieldDiv);
        });

        // Show the modal
        modal.style.display = 'block';
        
        // Add close button functionality if not already present
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    static enableFieldEdit(fieldId, fieldKey, fieldType) {
        // Add your field editing logic here
        console.log('Editing field:', fieldId, fieldKey, fieldType);
    }


    // Delete store
    deleteStore(storeId) {
        showDeleteModal('هل أنت متأكد من حذف هذا المحل؟', () => {
            $.ajax({
                url: `http://localhost/IEMM/Back-end/public/api/shops/${storeId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: (response) => {
                    alert('تم حذف المحل بنجاح');
                    this.loadStores();
                },
                error: (xhr, status, error) => {
                    alert('حدث خطأ أثناء حذف المحل');
                    console.error(error);
                }
            });
        });
    }

    // Toggle store status
    toggleStoreStatus(storeId) {
        $.ajax({
            url: `http://localhost/IEMM/Back-end/public/api/shops/${storeId}/toggle-status`,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                alert('تم تغيير حالة المحل بنجاح');
                this.loadStores();
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تغيير حالة المحل');
                console.error(error);
            }
        });
    }

    // Helper function to close modals
    closeModal(modalId) {
        $(`#${modalId}`).hide();
    }
}

class StoreOwnerManagement {
    constructor() {
        this.initializeEventListeners();
        this.loadStoreOwners();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Handle new owner form submission
        $('#newOwnerFormContainer form').on('submit', (e) => {
            e.preventDefault();
            this.addStoreOwner($(e.target).serialize());
        });
        
        // Handle modal close buttons
        $('.modal .btn-secondary').on('click', function() {
            $(this).closest('.modal').hide();
        });
    }

    // Load all store owners
    loadStoreOwners() {
        $.ajax({
            url: OWNER_API_URL,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                const ownersTable = $('table tbody.owner-table');
                ownersTable.empty();
                response.data.forEach(owner => {
                    const row = `
                        <tr>
                            <td>${owner.owner_name}</td>
                            <td>${owner.phone}</td>
                            <td>${owner.owner_email}</td>
                            <td>${owner.facilities}</td>
                            <td>
                            <button class="btn-icon view-btn" title="عرض" onclick="StoreOwnerManagement.openOwnerViewModal(${JSON.stringify(owner).replace(/"/g, '&quot;')})"><i class="fas fa-eye"></i></button>
                            </td>
                        </tr>
                    `;
                    ownersTable.append(row);
                });
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحميل بيانات أصحاب المحلات');
                console.error(error);
            }
        });
    }
    static openOwnerViewModal(data) {
        const modal = document.getElementById('viewEditModal');
        if (!modal) {
            console.error('Modal element not found! Make sure you have an element with id="viewEditModal"');
            return;
        }

        const title = document.getElementById('viewEditModalTitle');
        if (!title) {
            console.error('Modal title element not found! Make sure you have an element with id="viewEditModalTitle"');
            return;
        }

        const fieldsContainer = document.getElementById('viewEditFields');
        if (!fieldsContainer) {
            console.error('Fields container not found! Make sure you have an element with id="viewEditFields"');
            return;
        }

        fieldsContainer.innerHTML = '';

        // تعريف الحقول حسب النوع
        let fields = [];
        title.textContent = 'بيانات صاحب المحل';
        fields = [
            {label: 'الاسم', key: 'owner_name', type: 'text'},
            {label: 'رقم الجوال', key: 'phone', type: 'tel'},
            {label: 'البريد الإلكتروني', key: 'owner_email', type: 'email'},
            {label: 'المحلات المستأجرة', key: 'facilities', type: 'text'},
            {label: 'النوع', key: 'owner_sex', type: 'select', options: [{value:'male',label:'ذكر'},{value:'female',label:'أنثى'}]},
            {label: 'تاريخ الميلاد', key: 'owner_birth_date', type: 'date'}
          ];
        // توليد الحقول
        fields.forEach(field => {
            const value = data[field.key] || '';
            const fieldId = `view-field-${field.key}`;
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'form-group';
            fieldDiv.style.position = 'relative';
            fieldDiv.innerHTML = `
                <label>${field.label}</label>
                <span id="${fieldId}" class="field-value">${field.type === 'date' && value ? value.split('T')[0] : value}</span>
                
            `;
            fieldsContainer.appendChild(fieldDiv);
        });

        // Show the modal
        modal.style.display = 'block';
        
        // Add close button functionality if not already present
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
    static enableFieldEdit(fieldId, fieldKey, fieldType) {
        // Add your field editing logic here
        console.log('Editing field:', fieldId, fieldKey, fieldType);
    }
    
    // Helper function to close modals
    closeModal(modalId) {
        $(`#${modalId}`).hide();
    }
}

class FacilitiesManagement {
    constructor() {
        this.initializeEventListeners();
        this.loadFacilities();
    }   

    initializeEventListeners() {
        // Handle new facility form submission
        $('#newFacilityFormContainer').on('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const facilityData = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                facilityData[key] = value;
            }
            facilityData['mall_id']=1;
            console.log(facilityData);
            this.addFacility(facilityData);
        });

        // Add event listener for the Add Facility button
        $('.form-facility').on('click', () => {
            this.importEvents();
        });
            
        // Handle modal close buttons
        $('.modal .btn-secondary').on('click', function() {
            $(this).closest('.modal').hide();
        });
    }


    importEvents() {
        return $.ajax({
            url: 'http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                // Set floor constraints based on mall data
                console.log(response.data.floors_count);
                $('#floor_number')
                    .attr('max', response.data.floors_count)
                    .attr('min', 0)
                    .val(0);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching mall data:', error);
                // Set default max value if API call fails
                $('#floor_id')
                    .attr('max', 3)
                    .attr('min', 0)
                    .val(0);
            }
        });
    }

    // Load all facilities
    loadFacilities() {
        $.ajax({
            url: facility_API_URL,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                const facilitiesTable = $('table tbody.facilities-table');
                facilitiesTable.empty();
                
                response.data.forEach(facility => {
                    const row = `
                        <tr>
                            <td>${facility.id}</td>
                            <td>${facility.floor_number}</td>
                            <td>${facility.space}م²</td>
                            <td>${facility.facility_state}</td>
                            <td>${facility.owner_name}</td>
                            <td>${facility.shop_name}</td>
                            <td>
                                <button class="btn-icon view-btn" title="عرض" onclick="FacilitiesManagement.openViewModal(${JSON.stringify(facility).replace(/"/g, '&quot;')})"><i class="fas fa-eye"></i></button>
                                <button class="btn-icon" title="حذف" onclick="facilitiesManagement.deleteFacility(${facility.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                    facilitiesTable.append(row);
                });
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحميل بيانات المرافق');
                console.error(error);
            }
        });
    }

    // Add new facility
    addFacility(facilityData) {
        $.ajax({
            url: 'http://localhost/IEMM/Back-end/public/api/facilities',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify(facilityData),
            contentType: 'application/json',
            success: (response) => {
                alert('تم إضافة المرفق بنجاح');
                this.loadFacilities();
                this.closeModal('newFacilityFormContainer');
                // Reset form
                $('#newFacilityFormContainer')[0].reset();
                // Show table view
                $('#tables-view').show();
                $('#map-view').hide();
                $('#table-view-btn').addClass('active');
                $('#map-view-btn').removeClass('active');
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء إضافة المرفق');
                console.error(error);
            }
        });
    }

    // Delete facility
    deleteFacility(facilityId) {
        showDeleteModal(`هل أنت متأكد من حذف هذا المرفق ${facilityId}؟`, () => {
            $.ajax({
                url: `http://localhost/IEMM/Back-end/public/api/facilities/${facilityId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: (response) => {
                    alert('تم حذف المرفق بنجاح');
                    this.loadFacilities();
                },
                error: (xhr, status, error) => {
                    alert('حدث خطأ أثناء حذف المرفق');
                    console.error(error);
                }
            });
        });
    }

    // Helper function to close modals
    closeModal(modalId) {
        $(`#${modalId}`).hide();
    }

    static openViewModal(data) {
        const modal = document.getElementById('viewEditModal');
        if (!modal) {
            console.error('Modal element not found! Make sure you have an element with id="viewEditModal"');
            return;
        }

        const title = document.getElementById('viewEditModalTitle');
        if (!title) {
            console.error('Modal title element not found! Make sure you have an element with id="viewEditModalTitle"');
            return;
        }

        const fieldsContainer = document.getElementById('viewEditFields');
        if (!fieldsContainer) {
            console.error('Fields container not found! Make sure you have an element with id="viewEditFields"');
            return;
        }

        fieldsContainer.innerHTML = '';
        title.textContent = 'بيانات المرفق';

        // تعريف الحقول حسب النوع
        const fields = [
            {label: 'رقم المرفق', key: 'id', type: 'text', group: 'rent-floor'},
            {label: 'الدور', key: 'floor_number', type: 'number', group: 'rent-floor'},
            {label: 'المساحة', key: 'space', type: 'text', group: 'meters'},
            {label: 'الحالة', key: 'facility_state', type: 'text', group: 'location'},
            {label: 'اسم المالك', key: 'owner_name', type: 'text', group: 'location'},
            {label: 'اسم المحل', key: 'shop_name', type: 'text', group: 'location'}
        ];

        let fieldsHTML = `
            <button type="button" class="edit-all-btn" title="تعديل جميع الحقول" onclick="FacilitiesManagement.enableAllFieldsEdit('facility')">
              <i class="fas fa-edit"></i>
            </button>
        `;

        // تجميع الحقول حسب المجموعات
        const groups = {
            'rent-floor': [],
            'meters': [],
            'location': [],
            'dimensions': []
        };

        fields.forEach(field => {
            if (groups[field.group]) {
                groups[field.group].push(field);
            }
        });

        // إنشاء الصفوف المجمعة
        fieldsHTML += `
            <div class="fields-row">
                ${this.createFieldRow(groups['rent-floor'], data)}
            </div>
            <div class="fields-row">
                ${this.createFieldRow(groups['meters'], data)}
            </div>
            <div class="fields-row">
                ${this.createFieldRow(groups['location'], data)}
            </div>
            <div class="fields-row">
                ${this.createFieldRow(groups['dimensions'], data)}
            </div>
        `;

        fieldsContainer.innerHTML = fieldsHTML;

        // Show the modal
        modal.style.display = 'block';
        
        // Add close button functionality if not already present
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // static createFieldRow(fields, data) {
    //     if (!fields || fields.length === 0) return '';
        
    //     return fields.map(field => {
    //         const value = data[field.key] || '';
    //         const fieldId = `view-field-${field.key}`;
    //         return `
    //             <div class="form-group">
    //                 <label>${field.label}</label>
    //                 <span id="${fieldId}" class="field-value">${value}</span>
    //             </div>
    //         `;
    //     }).join('');
    // }
    static createFieldRow(fields, data) {
        return fields.map(field => {
            console.log(field)
          const value = data[field.key] || '';
          const fieldId = `view-field-${field.key}`;
          return `
            <div class="field-row">
              <label>${field.label}</label>
              <span id="${fieldId}" class="field-value">${field.type === 'date' && value ? value.split('T')[0] : value}</span>
            </div>
            `;
        }).join('');
      }

    static enableAllFieldsEdit(type, forceCancel = false) {
        const editBtn = document.querySelector('.edit-all-btn');
        const fields = document.querySelectorAll('#viewEditFields .form-group');
        const fieldsContainer = document.getElementById('viewEditFields');
        let actionBtns = document.getElementById('edit-actions-bottom');

        // إذا كان في وضع التعديل أو تم الضغط على زر الإلغاء
        if (editBtn.classList.contains('editing') || forceCancel) {
            editBtn.classList.remove('editing');
            editBtn.style.display = '';
            fields.forEach(field => {
                const valueSpan = field.querySelector('.field-value');
                if (valueSpan) {
                    const originalValue = valueSpan.getAttribute('data-original-value');
                    if (originalValue !== null) {
                        valueSpan.textContent = originalValue;
                        valueSpan.removeAttribute('data-original-value');
                        valueSpan.contentEditable = false;
                        valueSpan.style.border = 'none';
                        valueSpan.style.padding = '0';
                        valueSpan.style.backgroundColor = 'transparent';
                    }
                }
            });
            if (actionBtns) actionBtns.remove();
        } else {
            // تفعيل وضع التعديل
            editBtn.classList.add('editing');
            editBtn.style.display = 'none';
            fields.forEach(field => {
                const valueSpan = field.querySelector('.field-value');
                if (valueSpan) {
                    const fieldId = valueSpan.id;
                    const fieldKey = fieldId.replace('view-field-', '');
                    valueSpan.setAttribute('data-original-value', valueSpan.textContent);
                    valueSpan.contentEditable = true;
                    valueSpan.style.border = '1px solid #ccc';
                    valueSpan.style.padding = '5px';
                    valueSpan.style.backgroundColor = '#fff';
                    valueSpan.style.borderRadius = '4px';
                    valueSpan.style.minWidth = '200px';
                    valueSpan.style.display = 'inline-block';
                    valueSpan.focus();
                }
            });

            if (!document.getElementById('edit-actions-bottom')) {
                actionBtns = document.createElement('div');
                actionBtns.id = 'edit-actions-bottom';
                actionBtns.style = 'display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;';
                actionBtns.innerHTML = `
                    <button type="button" class="btn-save btn-green" onclick="FacilitiesManagement.saveAllFieldsEdit('${type}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button type="button" class="btn-cancel btn-secondary" onclick="FacilitiesManagement.enableAllFieldsEdit('${type}', true)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                fieldsContainer.appendChild(actionBtns);
            }
        }
    }

    static saveAllFieldsEdit(type) {
        const fields = document.querySelectorAll('#viewEditFields .form-group');
        const updatedData = {};

        fields.forEach(field => {
            const valueSpan = field.querySelector('.field-value');
            if (valueSpan) {
                const fieldKey = valueSpan.id.replace('view-field-', '');
                updatedData[fieldKey] = valueSpan.textContent;
            }
        });

        // Here you would typically make an API call to save the changes
        console.log('Saving updated data:', updatedData);
        
        // Disable editing mode
        this.enableAllFieldsEdit(type, true);
    }
}

// Initialize all management instances when document is ready
$(document).ready(() => {
    window.storeManagement = new StoreManagement();
    window.storeOwnerManagement = new StoreOwnerManagement();
    window.facilitiesManagement = new FacilitiesManagement();
    
    // Add click handlers for delete buttons
    $(document).on('click', '.btn-icon[title="حذف"]', function() {
        const row = $(this).closest('tr');
        const id = row.find('td:first').text(); // Get the ID from the first column
        
        if ($(this).closest('table').hasClass('stores-table')) {
            window.storeManagement.deleteStore(id);
        } else if ($(this).closest('table').hasClass('owner-table')) {
            window.storeOwnerManagement.deleteStoreOwner(id);
        } else if ($(this).closest('table').hasClass('facilities-table')) {
            window.facilitiesManagement.deleteFacility(id);
        }
    });
});
