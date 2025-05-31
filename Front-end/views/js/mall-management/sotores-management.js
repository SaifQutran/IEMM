// Store Management CRUD Operations
// const API_URL = 'http://localhost/IEMM/Back-end/public/api/shop';

const API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/shops';
const facility_API_URL='http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/facilities';
const OWNER_API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/shops/owners';

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
                mall_id: "1",
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
                            <button class="btn-icon" title="حذف"><i class="fas fa-trash"></i></button>
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
            url: 'http://127.0.0.1:8000/api/shops/',
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
                <button type="button" class="btn-icon edit-field-btn" title="تعديل" onclick="StoreManagement.enableFieldEdit('${fieldId}', '${field.key}', '${field.type}')" style="position:absolute; left:0; top:50%; transform:translateY(-50%);")'><i class='fas fa-edit'></i></button>
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

    // Edit store
    // editStore(storeId) {
    //     $.ajax({
    //         url: `${API_URL}/${storeId}`,
    //         method: 'GET',
    //         success: (store) => {
    //             // Fill the edit form with store data
    //             $('#edit-store-number').val(store.store_number);
    //             $('#edit-store-area').val(store.area);
    //             $('#edit-store-activity').val(store.activity);
    //             $('#edit-store-floor').val(store.floor);
    //             $('#edit-store-x').val(store.location_x);
    //             $('#edit-store-y').val(store.location_y);
    //             $('#edit-store-width').val(store.width);
    //             $('#edit-store-height').val(store.height);
                
    //             // If store has tenant, fill tenant data
    //             if (store.tenant) {
    //                 $('#edit-tenant-name').val(store.tenant.name);
    //                 $('#edit-tenant-phone').val(store.tenant.phone);
    //                 $('#edit-tenant-email').val(store.tenant.email);
    //                 $('#edit-tenant-id').val(store.tenant.id_number);
    //                 $('#edit-tenant-contract-start').val(store.tenant.contract_start);
    //                 $('#edit-tenant-contract-end').val(store.tenant.contract_end);
    //             }
                
    //             // Show the edit modal
    //             $('#editStoreModal').show();
                
    //             // Handle form submission
    //             $('#editStoreModal form').off('submit').on('submit', (e) => {
    //                 e.preventDefault();
    //                 this.updateStore(storeId, $(e.target).serialize());
    //             });
    //         },
    //         error: (xhr, status, error) => {
    //             alert('حدث خطأ أثناء تحميل بيانات المحل');
    //             console.error(error);
    //         }
    //     });
    // }

    // // Update store
    // updateStore(storeId, storeData) {
    //     $.ajax({
    //         url: `${API_URL}/${storeId}`,
    //         method: 'PUT',
    //         data: storeData,
    //         success: (response) => {
    //             alert('تم تحديث بيانات المحل بنجاح');
    //             this.loadStores();
    //             this.closeModal('editStoreModal');
    //         },
    //         error: (xhr, status, error) => {
    //             alert('حدث خطأ أثناء تحديث بيانات المحل');
    //             console.error(error);
    //         }
    //     });
    // }

    // Delete store
    deleteStore(storeId) {
        if (confirm('هل أنت متأكد من حذف هذا المحل؟')) {
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
        }
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
                            <button class="btn-icon" title="حذف"><i class="fas fa-trash"></i></button>
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

    // Add new store owner
    addStoreOwner(ownerData) {
        $.ajax({
            url: OWNER_API_URL,
            method: 'POST',
            data: ownerData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: (response) => {
                alert('تم إضافة صاحب المحل بنجاح');
                this.loadStoreOwners();
                this.closeModal('newOwnerFormContainer');
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء إضافة صاحب المحل');
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
    // Edit store owner
    // editStoreOwner(ownerId) {
    //     $.ajax({
    //         url: `${OWNER_API_URL}/${ownerId}`,
    //         method: 'GET',
    //         success: (owner) => {
    //             // Fill the edit form with owner data
    //             $('#edit-owner-name').val(owner.name);
    //             $('#edit-owner-phone').val(owner.phone);
    //             $('#edit-owner-email').val(owner.email);
    //             $('#edit-owner-id').val(owner.id_number);
    //             $('#edit-owner-contract-start').val(owner.contract_start);
    //             $('#edit-owner-contract-end').val(owner.contract_end);
                
    //             // Show the edit modal
    //             $('#editOwnerModal').show();
                
    //             // Handle form submission
    //             $('#editOwnerModal form').off('submit').on('submit', (e) => {
    //                 e.preventDefault();
    //                 this.updateStoreOwner(ownerId, $(e.target).serialize());
    //             });
    //         },
    //         error: (xhr, status, error) => {
    //             alert('حدث خطأ أثناء تحميل بيانات صاحب المحل');
    //             console.error(error);
    //         }
    //     });
    // }

    // // Update store owner
    // updateStoreOwner(ownerId, ownerData) {
    //     $.ajax({
    //         url: `${OWNER_API_URL}/${ownerId}`,
    //         method: 'PUT',
    //         data: ownerData,
    //         success: (response) => {
    //             alert('تم تحديث بيانات صاحب المحل بنجاح');
    //             this.loadStoreOwners();
    //             this.closeModal('editOwnerModal');
    //         },
    //         error: (xhr, status, error) => {
    //             alert('حدث خطأ أثناء تحديث بيانات صاحب المحل');
    //             console.error(error);
    //         }
    //     });
    // }

    // Delete store owner
    deleteStoreOwner(ownerId) {
        if (confirm('هل أنت متأكد من حذف صاحب المحل؟')) {
            $.ajax({
                url: `http://localhost/IEMM/Back-end/public/api/owners/${ownerId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: (response) => {
                    alert('تم حذف صاحب المحل بنجاح');
                    this.loadStoreOwners();
                },
                error: (xhr, status, error) => {
                    alert('حدث خطأ أثناء حذف صاحب المحل');
                    console.error(error);
                }
            });
        }
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
        
        const fields = [
            {label: 'مبلغ الإيجار', key: 'rent', type: 'number'},
            {label: 'رقم عداد الماء', key: 'waterMeter', type: 'text'},
            {label: 'رقم عداد الكهرباء', key: 'electricityMeter', type: 'text'},
            {label: 'الدور', key: 'floor', type: 'text'},
            {label: 'الموقع X', key: 'x', type: 'number'},
            {label: 'الموقع Y', key: 'y', type: 'number'},
            {label: 'العرض', key: 'width', type: 'number'},
            {label: 'الطول', key: 'height', type: 'number'}
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
                <button type="button" class="btn-icon edit-field-btn" title="تعديل" onclick="FacilitiesManagement.enableFieldEdit('${fieldId}', '${field.key}', '${field.type}')" style="position:absolute; left:0; top:50%; transform:translateY(-50%);"><i class='fas fa-edit'></i></button>
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
        if (confirm(`هل أنت متأكد من حذف هذا المرفق ${facilityId} ؟`)) {
            alert(facilityId);
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
        }
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
            {label: 'رقم المرفق', key: 'id', type: 'text'},
            {label: 'الدور', key: 'floor_number', type: 'number'},
            {label: 'المساحة', key: 'space', type: 'text'},
            {label: 'الحالة', key: 'facility_state', type: 'text'},
            {label: 'اسم المالك', key: 'owner_name', type: 'text'},
            {label: 'اسم المحل', key: 'shop_name', type: 'text'}
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
                <span id="${fieldId}" class="field-value">${value}</span>
                <button type="button" class="btn-icon edit-field-btn" title="تعديل" onclick="FacilitiesManagement.enableFieldEdit('${fieldId}', '${field.key}', '${field.type}')" style="position:absolute; left:0; top:50%; transform:translateY(-50%);")'><i class='fas fa-edit'></i></button>
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
}

// Initialize all management instances when document is ready
$(document).ready(() => {
    window.storeManagement = new StoreManagement();
    window.storeOwnerManagement = new StoreOwnerManagement();
    window.facilitiesManagement = new FacilitiesManagement();
});
