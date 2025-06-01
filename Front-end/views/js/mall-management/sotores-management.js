// Store Management CRUD Operations
// const API_URL = 'http://localhost/IEMM/Back-end/public/api/shop';

// const API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/shops';
// const facility_API_URL='http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/facilities';
// const OWNER_API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/'+localStorage.getItem("mall_id")+'/shops/owners';
const API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/2/shops';
const facility_API_URL='http://localhost/IEMM/Back-end/public/api/malls/2/facilities';
const OWNER_API_URL = 'http://localhost/IEMM/Back-end/public/api/malls/2/shops/owners';
// +localStorage.getItem("mall_id")+
// +localStorage.getItem("mall_id")+
// +localStorage.getItem("mall_id")+

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
                            <button class="btn-icon view-btn" title="عرض" onclick='showStoreModal(${JSON.stringify(store)})'><i class="fas fa-eye"></i></button>
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
                            <button class="btn-icon view-btn" title="عرض" onclick='showStoreOwnerModal(${JSON.stringify(owner)})'><i class="fas fa-eye"></i></button>
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
