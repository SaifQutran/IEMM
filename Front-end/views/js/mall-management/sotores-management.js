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
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
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
// <<<<<<< HEAD
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
//     static enableFieldEdit(fieldId, fieldKey, fieldType) {
//         // Add your field editing logic here
//         console.log('Editing field:', fieldId, fieldKey, fieldType);
//     }
    
// =======

//     // Add new store owner
//     addStoreOwner(ownerData) {
//         $.ajax({
//             url: OWNER_API_URL,
//             method: 'POST',
//             data: ownerData,
//             headers: {
//                 'Authorization': 'Bearer ' + localStorage.getItem('token')
//             },
//             success: (response) => {
//                 alert('تم إضافة صاحب المحل بنجاح');
//                 this.loadStoreOwners();
//                 this.closeModal('newOwnerFormContainer');
//             },
//             error: (xhr, status, error) => {
//                 alert('حدث خطأ أثناء إضافة صاحب المحل');
//                 console.error(error);
//             }
//         });


//     // Delete store owner
//     deleteStoreOwner(ownerId) {
//         if (confirm('هل أنت متأكد من حذف صاحب المحل؟')) {
//             $.ajax({
//                 url: `http://localhost/IEMM/Back-end/public/api/owners/${ownerId}`,
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': 'Bearer ' + localStorage.getItem('token')
//                 },
//                 success: (response) => {
//                     alert('تم حذف صاحب المحل بنجاح');
//                     this.loadStoreOwners();
//                 },
//                 error: (xhr, status, error) => {
//                     alert('حدث خطأ أثناء حذف صاحب المحل');
//                     console.error(error);
//                 }
//             });
//         }
//     }

// >>>>>>> 5608c021ee61b17f2977baf540ab84dfd5e8dc38
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
                                <button class="btn-icon view-btn" title="عرض" 
                                onclick="FacilitiesManagement.openViewModal(${JSON.stringify(facility).replace(/"/g, '&quot;')})"><i class="fas fa-eye"></i></button>
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


    static openViewModal(data, type = 'facilities') {
        const modal = document.getElementById('viewEditModal');
        if (!modal) {
            console.error('Modal element not found! Make sure you have an element with id="viewEditModal"');
            return;
        }

        // Store the facility ID in the modal's data attribute
        if (type === 'facilities' && data.id) {
            modal.setAttribute('data-facility-id', data.id);
            console.log('Stored facility ID:', data.id); // Debug log
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
        let fields = [];
        if (type === 'facilities') {
            title.textContent = 'بيانات المرفق';
            fields = [
                {label: 'مبلغ الإيجار', key: 'rent_price', type: 'number', group: 'rent-floor'},
                {label: 'الدور', key: 'floor_number', type: 'text', group: 'rent-floor'},
                {label: 'رقم عداد الماء', key: 'water_id_number', type: 'text', group: 'meters'},
                {label: 'رقم عداد الكهرباء', key: 'electricity_id_number', type: 'text', group: 'meters'},
                {label: 'الموقع X', key: 'X_Coordinates', type: 'number', group: 'location'},
                {label: 'الموقع Y', key: 'Y_Coordinates', type: 'number', group: 'location'},
                {label: 'العرض', key: 'width', type: 'number', group: 'dimensions'},
                {label: 'الطول', key: 'length', type: 'number', group: 'dimensions'}
            ];
        } else if (type === 'tenants') {
            title.textContent = 'بيانات صاحب المحل';
            fields = [
                {label: 'الاسم', key: 'name', type: 'text'},
                {label: 'رقم الجوال', key: 'phone', type: 'tel'},
                {label: 'البريد الإلكتروني', key: 'email', type: 'email'},
                {label: 'المحلات المستأجرة', key: 'stores', type: 'text'},
                {label: 'النوع', key: 'gender', type: 'select', options: [{value:'male',label:'ذكر'},{value:'female',label:'أنثى'}]},
                {label: 'تاريخ الميلاد', key: 'birthdate', type: 'date'}
            ];
        } else if (type === 'stores') {
            title.textContent = 'بيانات المحل';
            fields = [
                {label: 'اسم المالك', key: 'owner', type: 'text'},
                {label: 'اسم المحل', key: 'storeName', type: 'text'},
                {label: 'النشاط', key: 'activity', type: 'text'},
                {label: 'تاريخ بدء العقد', key: 'contractStart', type: 'date'},
                {label: 'أوقات الدوام', key: 'workingHours', type: 'text'}
            ];
        }
        
        // إضافة زر التعديل في الزاوية
        let fieldsHTML = '';
        if (type === 'facilities') {
            fieldsHTML = `
                <button type="button" class="edit-all-btn" title="تعديل جميع الحقول" 
                onclick="FacilitiesManagement.enableAllFieldsEdit('${type}')">
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
        } else {
            // توليد الحقول العادية للأنواع الأخرى
            fields.forEach(field => {
                const value = data[field.key] || '';
                const fieldId = `view-field-${field.key}`;
                fieldsHTML += `
                    <div class="field-row">
                        <label>${field.label}</label>
                        <span id="${fieldId}" class="field-value">${field.type === 'date' && value ? value.split('T')[0] : value}</span>
                    </div>
                `;
            });
        }
        
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

    static createFieldRow(fields, data) {
        return fields.map(field => {
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
    static getFieldType(key, type) {
          const fieldTypes = {
              facilities: {
                  rent: 'number',
                  waterMeter: 'text',
                  electricityMeter: 'text',
                  floor: 'text',
                  x: 'number',
                  y: 'number',
                  width: 'number',
                  height: 'number'
              }
          };
          return fieldTypes[type][key] || 'text';
      }
    static enableAllFieldsEdit(type, forceCancel = false, fieldId = null) {
        const editBtn = document.querySelector('.edit-all-btn');
        const fields = document.querySelectorAll('#viewEditFields .field-row');
        const fieldsContainer = document.getElementById('viewEditFields');
        let actionBtns = document.getElementById('edit-actions-bottom');

        // إذا كان في وضع التعديل أو تم الضغط على زر الإلغاء
        if (editBtn.classList.contains('editing') || forceCancel) {
            editBtn.classList.remove('editing');
            editBtn.style.display = '';
            
            // إلغاء التعديل لجميع الحقول أو حقل محدد
            fields.forEach(field => {
                const valueSpan = field.querySelector('.field-value');
                if (!valueSpan) {
                    const input = field.querySelector('.edit-input');
                    if (input && (!fieldId || input.id === `edit-${fieldId}`)) {
                        const fieldId = input.id.replace('edit-', '');
                        const originalValue = input.getAttribute('data-original-value') || '';
                        const span = document.createElement('span');
                        span.id = fieldId;
                        span.className = 'field-value';
                        span.textContent = originalValue;
                        field.querySelector('.edit-container').parentNode.replaceChild(span, field.querySelector('.edit-container'));
                    }
                }
            });

            if (actionBtns) actionBtns.remove();
            return;
        }

        // تفعيل وضع التعديل
        editBtn.classList.add('editing');
        editBtn.style.display = 'none';

        // تحويل الحقول إلى وضع التعديل
        fields.forEach(field => {
            const valueSpan = field.querySelector('.field-value');
            if (valueSpan && (!fieldId || valueSpan.id === fieldId)) {
                const currentFieldId = valueSpan.id;
                const fieldKey = currentFieldId.replace('view-field-', '');
                const fieldType = this.getFieldType(fieldKey, type);
                const currentValue = valueSpan.textContent.trim();

                // حفظ القيمة الأصلية
                valueSpan.setAttribute('data-original-value', currentValue);

                // إنشاء عنصر الإدخال المناسب
                let inputElement;
                if (fieldType === 'select') {
                    inputElement = document.createElement('select');
                    if (fieldKey === 'gender') {
                        inputElement.innerHTML = `
                            <option value="male" ${currentValue === 'ذكر' ? 'selected' : ''}>ذكر</option>
                            <option value="female" ${currentValue === 'أنثى' ? 'selected' : ''}>أنثى</option>
                        `;
                    }
                } else {
                    inputElement = document.createElement('input');
                    inputElement.type = fieldType;
                    inputElement.value = currentValue;

                    // إضافة خصائص إضافية حسب نوع الحقل
                    if (fieldType === 'number') {
                        inputElement.min = '0';
                        inputElement.step = 'any';
                    }
                    if (fieldType === 'tel') {
                        inputElement.pattern = '[0-9]{10}';
                        inputElement.placeholder = '05XXXXXXXX';
                    }
                    if (inputElement.type === 'email') {
                        inputElement.placeholder = 'example@domain.com';
                    }
                }

                // تعيين الخصائص المشتركة
                inputElement.className = 'edit-input';
                inputElement.id = `edit-${currentFieldId}`;
                inputElement.setAttribute('data-original-value', currentValue);
                inputElement.setAttribute('data-field-key', fieldKey);

                // إنشاء حاوية التعديل
                const container = document.createElement('div');
                container.className = 'edit-container';
                container.appendChild(inputElement);

                // استبدال عنصر العرض بحاوية التعديل
                valueSpan.parentNode.replaceChild(container, valueSpan);
            }
        });

        // إضافة أزرار الحفظ والإلغاء إذا لم تكن موجودة
        if (!actionBtns && !fieldId) {
            actionBtns = document.createElement('div');
            actionBtns.id = 'edit-actions-bottom';
            actionBtns.style = 'display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;';
            actionBtns.innerHTML = `
                <button type="button" class="btn-save btn-green" onclick="FacilitiesManagement.saveAllFieldsEdit('${type}')">
                    <i class='fas fa-check'></i>
                </button>
                <button type="button" class="btn-cancel btn-secondary" onclick="FacilitiesManagement.enableAllFieldsEdit('${type}', true)">
                    <i class='fas fa-times'></i>
                </button>
            `;
            fieldsContainer.appendChild(actionBtns);
        }
    }

    static saveAllFieldsEdit(type) {
        const fields = document.querySelectorAll('#viewEditFields .field-row');
        const updatedData = {};
        let valid = true;

        // Get facility ID from the modal data attribute
        const modal = document.getElementById('viewEditModal');
        const facilityId = modal.getAttribute('data-facility-id');

        console.log('Retrieved facility ID:', facilityId); // Debug log

        if (!facilityId) {
            alert('خطأ: لم يتم العثور على معرف المرفق');
            return;
        }

        // Collect all field values
        fields.forEach(field => {
            const input = field.querySelector('.edit-input');
            if (input) {
                const fieldKey = input.getAttribute('data-field-key');
                let newValue = input.value.trim();

                // Validate input based on type
                if (input.type === 'number' && isNaN(newValue)) {
                    alert('الرجاء إدخال رقم صحيح');
                    valid = false;
                    return;
                }
                if (input.type === 'tel' && !/^[0-9]{10}$/.test(newValue)) {
                    alert('الرجاء إدخال رقم جوال صحيح مكون من 10 أرقام');
                    valid = false;
                    return;
                }
                if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
                    alert('الرجاء إدخال بريد إلكتروني صحيح');
                    valid = false;
                    return;
                }

                // Map the field keys to match the API expectations
                switch(fieldKey) {
                    case 'rent_price':
                        updatedData.rent_price = parseFloat(newValue).toFixed(2);
                        break;
                    case 'floor_number':
                        updatedData.floor_number = parseInt(newValue);
                        updatedData.floor_id = parseInt(newValue); // Add floor_id
                        break;
                    case 'water_id_number':
                        updatedData.water_id_number = newValue;
                        break;
                    case 'electricity_id_number':
                        updatedData.electricity_id_number = newValue;
                        break;
                    case 'X_Coordinates':
                        updatedData.X_Coordinates = newValue;
                        break;
                    case 'Y_Coordinates':
                        updatedData.Y_Coordinates = newValue;
                        break;
                    case 'width':
                        updatedData.width = parseFloat(newValue).toFixed(2);
                        break;
                    case 'length':
                        updatedData.length = parseFloat(newValue).toFixed(2);
                        break;
                    default:
                        updatedData[fieldKey] = newValue;
                }
            }
        });

        if (!valid) return;

        // Add required fields that are not editable
        updatedData.id = parseInt(facilityId);
        updatedData.mall_id = 1; // or get from localStorage if needed
        updatedData.status = true; // Maintain the status

        console.log('Sending update data:', updatedData); // Debug log

        // Make API call to update facility
        $.ajax({
            url: `http://localhost/IEMM/Back-end/public/api/facilities/${facilityId}`,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(updatedData),
            success: (response) => {
                alert('تم تحديث بيانات المرفق بنجاح');
                // Refresh the facilities list
                if (window.facilitiesManagement) {
                    window.facilitiesManagement.loadFacilities();
                }
                // Close the modal
                modal.style.display = 'none';
            },
            error: (xhr, status, error) => {
                console.error('Error response:', xhr.responseText); // Debug log
                alert('حدث خطأ أثناء تحديث بيانات المرفق');
                console.error('Error updating facility:', error);
            }
        });
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
        } else if ($(this).closest('table').hasClass('facilities-table')) {
            window.facilitiesManagement.deleteFacility(id);
        }
    });
});

// Modal for store and owner view (single modal for both)
if (!document.getElementById('customViewModal')) {
    const modalHtml = `
    <div id="customViewModal" class="modal" style="display:none;z-index:9999;">
      <div class="modal-content" style="max-width:600px;direction:rtl;">
        <span class="close-modal" style="float:left;font-size:28px;cursor:pointer;">&times;</span>
        <h2 id="customViewModalTitle" style="color:#2176ff;text-align:center;margin-bottom:16px;"></h2>
        <div id="customViewModalGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:18px 18px;margin-bottom:24px;"></div>
        <button class="btn btn-secondary" id="customViewModalCloseBtn" style="margin-top:8px;">إغلاق</button>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('customViewModalCloseBtn').onclick = document.querySelector('#customViewModal .close-modal').onclick = function() {
        document.getElementById('customViewModal').style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === document.getElementById('customViewModal')) {
            document.getElementById('customViewModal').style.display = 'none';
        }
    };
}

window.showStoreOwnerModal = function(data) {
    const modal = document.getElementById('customViewModal');
    const title = document.getElementById('customViewModalTitle');
    const grid = document.getElementById('customViewModalGrid');
    title.textContent = 'بيانات صاحب المحل';
    grid.innerHTML = '';
    const fields = [
        {label: 'الاسم', key: 'owner_name'},
        {label: 'رقم الجوال', key: 'phone'},
        {label: 'المحلات المستأجرة', key: 'facilities'},
        {label: 'البريد الإلكتروني', key: 'owner_email'},
        {label: 'تاريخ الميلاد', key: 'birthdate'},
        {label: 'النوع', key: 'gender'}
    ];
    fields.forEach(field => {
        const value = data[field.key] || '';
        const card = document.createElement('div');
        card.style.background = '#f7fafd';
        card.style.borderRadius = '12px';
        card.style.padding = '18px 12px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'flex-start';
        card.innerHTML = `<div style='color:#2176ff;font-weight:500;margin-bottom:6px;'>${field.label}</div><div>${value}</div>`;
        grid.appendChild(card);
    });
    modal.style.display = 'block';
};

window.showStoreModal = function(data) {
    const modal = document.getElementById('customViewModal');
    const title = document.getElementById('customViewModalTitle');
    const grid = document.getElementById('customViewModalGrid');
    title.textContent = 'بيانات المحل';
    grid.innerHTML = '';
    const fields = [
        {label: 'اسم المالك', key: 'owner_name'},
        {label: 'اسم المحل', key: 'name'},
        {label: 'الدور', key: 'floor'},
        {label: 'النشاط', key: 'shop_state'},
        {label: 'تاريخ بدء العقد', key: 'rent_began_At'},
        {label: 'أوقات الدوام', key: 'work_times'}
    ];
    fields.forEach(field => {
        const value = data[field.key] || '';
        const card = document.createElement('div');
        card.style.background = '#f7fafd';
        card.style.borderRadius = '12px';
        card.style.padding = '18px 12px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'flex-start';
        card.innerHTML = `<div style='color:#2176ff;font-weight:500;margin-bottom:6px;'>${field.label}</div><div>${value}</div>`;
        grid.appendChild(card);
    });
    modal.style.display = 'block';
};


















