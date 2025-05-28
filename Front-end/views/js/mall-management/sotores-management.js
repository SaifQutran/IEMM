// Store Management CRUD Operations
// const API_URL = 'http://localhost/IEMM/Back-end/public/api/shop';

const API_URL = 'http://127.0.0.1:8000/api/malls/1/shops';
const facility_API_URL='http://127.0.0.1:8000/api/malls/1/facilities';
const OWNER_API_URL = 'http://127.0.0.1:8000/api/malls/1/shops/owners';

class StoreManagement {
    constructor() {
        this.initializeEventListeners();
        this.loadStores();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Handle new store form submission
        $('#newStoreFormContainer form').on('submit', (e) => {
            e.preventDefault();
            this.addStore($(e.target).serialize());
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
   
    // Add new store
    addStore(storeData) {
        $.ajax({
            url: API_URL,
            method: 'POST',
            data: storeData,
            success: (response) => {
                alert('تم إضافة المحل بنجاح');
                this.loadStores();
                this.closeModal('newStoreFormContainer');
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

        // تعريف الحقول حسب النوع
        let fields = [];
        title.textContent = 'بيانات المحل';
        fields = [
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
                url: `${API_URL}/${storeId}`,
                method: 'DELETE',
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
            url: `${API_URL}/${storeId}/toggle-status`,
            method: 'PUT',
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
                            <button class="btn-icon view-btn" title="عرض" onclick="StoreOwnerManagement.openViewModal(${JSON.stringify(owner).replace(/"/g, '&quot;')})"><i class="fas fa-eye"></i></button>
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

        // تعريف الحقول حسب النوع
        let fields = [];
        title.textContent = 'بيانات المحل';
        fields = [
            {label: 'الاسم', key: 'owner_name', type: 'text'},
            {label: 'رقم الجوال', key: 'phone', type: 'tel'},
            {label: 'البريد الإلكتروني', key: 'owner_email', type: 'email'},
            {label: 'المحلات المستأجرة', key: 'facilities', type: 'text'},
            {label: 'النوع', key: 'gender', type: 'select', options: [{value:'male',label:'ذكر'},{value:'female',label:'أنثى'}]},
            {label: 'تاريخ الميلاد', key: 'birthdate', type: 'date'}
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
                <button type="button" class="btn-icon edit-field-btn" title="تعديل" onclick="StoreOwnerManagement.enableFieldEdit('${fieldId}', '${field.key}', '${field.type}')" style="position:absolute; left:0; top:50%; transform:translateY(-50%);")'><i class='fas fa-edit'></i></button>
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
                url: `${OWNER_API_URL}/${ownerId}`,
                method: 'DELETE',
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
    importEvents() {
        return $.ajax({
            url: 'http://127.0.0.1:8000/api/malls/1/',
            method: 'GET',
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
        alert("Enter in Post");
        $.ajax({
            url: 'http://127.0.0.1:8000/api/facilities',
            method: 'POST',
            data: JSON.stringify(facilityData),
            contentType: 'application/json',
            success: (response) => {
                alert('تم إضافة المرفق بنجاح');
                this.loadFacilities();
                this.closeModal('newFacilityFormContainer');
                // Reset form
                $('#newFacilityFormContainer')[0].reset();
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
                url: `http://127.0.0.1:8000/api/facilities/${facilityId}`,
                method: 'DELETE',
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

    // static openViewModal(data) {
    //     const modal = document.getElementById('viewEditModal');
    //     if (!modal) {
    //         console.error('Modal element not found! Make sure you have an element with id="viewEditModal"');
    //         return;
    //     }

    //     const title = document.getElementById('viewEditModalTitle');
    //     if (!title) {
    //         console.error('Modal title element not found! Make sure you have an element with id="viewEditModalTitle"');
    //         return;
    //     }

    //     const fieldsContainer = document.getElementById('viewEditFields');
    //     if (!fieldsContainer) {
    //         console.error('Fields container not found! Make sure you have an element with id="viewEditFields"');
    //         return;
    //     }

    //     fieldsContainer.innerHTML = '';
    //     title.textContent = 'بيانات المرفق';
        
    //     const fields = [
    //         {label: 'اسم المرفق', key: 'name', type: 'text'},
    //         {label: 'الدور', key: 'floor', type: 'number'},
    //         {label: 'مبلغ الإيجار', key: 'rent', type: 'number'},
    //         {label: 'رقم عداد الماء', key: 'water_meter', type: 'text'},
    //         {label: 'رقم عداد الكهرباء', key: 'electricity_meter', type: 'text'},
    //         {label: 'الحالة', key: 'state', type: 'text'}
    //     ];

    //     // Create view mode elements
    //     fields.forEach(field => {
    //         const value = data[field.key] || '';
    //         const fieldId = `view-field-${field.key}`;
    //         const fieldDiv = document.createElement('div');
    //         fieldDiv.className = 'form-group';
    //         fieldDiv.innerHTML = `
    //             <label>${field.label}</label>
    //             <span id="${fieldId}" class="field-value">${value}</span>
    //         `;
    //         fieldsContainer.appendChild(fieldDiv);
    //     });

    //     // Add edit button
    //     const editButton = document.createElement('button');
    //     editButton.className = 'btn btn-primary';
    //     editButton.textContent = 'تعديل البيانات';
    //     editButton.onclick = () => {
    //         // Switch to edit mode
    //         fieldsContainer.innerHTML = '';
    //         const form = document.createElement('form');
    //         form.id = 'editFacilityForm';

    //         fields.forEach(field => {
    //             const value = data[field.key] || '';
    //             const fieldDiv = document.createElement('div');
    //             fieldDiv.className = 'form-group';
                
    //             const label = document.createElement('label');
    //             label.textContent = field.label;
                
    //             const input = document.createElement('input');
    //             input.type = field.type;
    //             input.name = field.key;
    //             input.value = value;
    //             input.className = 'form-control';
                
    //             fieldDiv.appendChild(label);
    //             fieldDiv.appendChild(input);
    //             form.appendChild(fieldDiv);
    //         });

    //         // Add update button
    //         const updateButton = document.createElement('button');
    //         updateButton.type = 'submit';
    //         updateButton.className = 'btn btn-success';
    //         updateButton.textContent = 'حفظ التغييرات';
    //         form.appendChild(updateButton);

    //         // Add cancel button
    //         const cancelButton = document.createElement('button');
    //         cancelButton.type = 'button';
    //         cancelButton.className = 'btn btn-secondary';
    //         cancelButton.textContent = 'إلغاء';
    //         cancelButton.onclick = () => {
    //             // Return to view mode
    //             FacilitiesManagement.openViewModal(data);
    //         };
    //         form.appendChild(cancelButton);

    //         // Handle form submission
    //         form.onsubmit = (e) => {
    //             e.preventDefault();
    //             const formData = new FormData(form);
    //             const updateData = {};
    //             formData.forEach((value, key) => {
    //                 updateData[key] = value;
    //             });

    //             // Call API to update facility
    //             $.ajax({
    //                 url: `${facility_API_URL}/${data.id}`,
    //                 method: 'PUT',
    //                 data: updateData,
    //                 success: (response) => {
    //                     alert('تم تحديث البيانات بنجاح');
    //                     modal.style.display = 'none';
    //                     window.facilitiesManagement.loadFacilities();
    //                 },
    //                 error: (xhr, status, error) => {
    //                     alert('حدث خطأ أثناء تحديث البيانات');
    //                     console.error(error);
    //                 }
    //             });
    //         };

    //         fieldsContainer.appendChild(form);
    //     };

    //     fieldsContainer.appendChild(editButton);
    //     modal.style.display = 'block';
    // }
}

// Initialize all management instances when document is ready
$(document).ready(() => {
    window.storeManagement = new StoreManagement();
    window.storeOwnerManagement = new StoreOwnerManagement();
    window.facilitiesManagement = new FacilitiesManagement();
});
