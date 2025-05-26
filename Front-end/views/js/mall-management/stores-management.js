// Store Management CRUD Operations
// const API_URL = 'http://localhost/IEMM/Back-end/public/api/shop';


const API_URL = 'http://127.0.0.1:8000/api/shops';
const OWNER_API_URL = 'http://127.0.0.1:8000/api/store-owners';

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
                            <td>${store.name}</td>
                            <td>${store.facility_id}</td>
                            <td>${store.work_times}</td>
                            <td>${store.facility_id} م²</td>
                            <td>${store.state}</td>
                            <td>${store.owner_id || '-'}</td>
                            <td>
                                <button class="btn-icon" title="تعديل" onclick="storeManagement.editStore(${store.id})">✏️</button>
                                <button class="btn-icon" title="تغيير الحالة" onclick="storeManagement.toggleStoreStatus(${store.id})">🔄</button>
                                <button class="btn-icon" title="حذف" onclick="storeManagement.deleteStore(${store.id})">🗑️</button>
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

    // Edit store
    editStore(storeId) {
        $.ajax({
            url: `${API_URL}/${storeId}`,
            method: 'GET',
            success: (store) => {
                // Fill the edit form with store data
                $('#edit-store-number').val(store.store_number);
                $('#edit-store-area').val(store.area);
                $('#edit-store-activity').val(store.activity);
                $('#edit-store-floor').val(store.floor);
                $('#edit-store-x').val(store.location_x);
                $('#edit-store-y').val(store.location_y);
                $('#edit-store-width').val(store.width);
                $('#edit-store-height').val(store.height);
                
                // If store has tenant, fill tenant data
                if (store.tenant) {
                    $('#edit-tenant-name').val(store.tenant.name);
                    $('#edit-tenant-phone').val(store.tenant.phone);
                    $('#edit-tenant-email').val(store.tenant.email);
                    $('#edit-tenant-id').val(store.tenant.id_number);
                    $('#edit-tenant-contract-start').val(store.tenant.contract_start);
                    $('#edit-tenant-contract-end').val(store.tenant.contract_end);
                }
                
                // Show the edit modal
                $('#editStoreModal').show();
                
                // Handle form submission
                $('#editStoreModal form').off('submit').on('submit', (e) => {
                    e.preventDefault();
                    this.updateStore(storeId, $(e.target).serialize());
                });
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحميل بيانات المحل');
                console.error(error);
            }
        });
    }

    // Update store
    updateStore(storeId, storeData) {
        $.ajax({
            url: `${API_URL}/${storeId}`,
            method: 'PUT',
            data: storeData,
            success: (response) => {
                alert('تم تحديث بيانات المحل بنجاح');
                this.loadStores();
                this.closeModal('editStoreModal');
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحديث بيانات المحل');
                console.error(error);
            }
        });
    }

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
                const ownersTable = $('table tbody.owners-table');
                ownersTable.empty();
                
                response.data.forEach(owner => {
                    const row = `
                        <tr>
                            <td>${owner.name}</td>
                            <td>${owner.phone}</td>
                            <td>${owner.email}</td>
                            <td>${owner.id_number}</td>
                            <td>${owner.contract_start}</td>
                            <td>${owner.contract_end}</td>
                            <td>
                                <button class="btn-icon" title="تعديل" onclick="storeOwnerManagement.editStoreOwner(${owner.id})">✏️</button>
                                <button class="btn-icon" title="حذف" onclick="storeOwnerManagement.deleteStoreOwner(${owner.id})">🗑️</button>
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

    // Edit store owner
    editStoreOwner(ownerId) {
        $.ajax({
            url: `${OWNER_API_URL}/${ownerId}`,
            method: 'GET',
            success: (owner) => {
                // Fill the edit form with owner data
                $('#edit-owner-name').val(owner.name);
                $('#edit-owner-phone').val(owner.phone);
                $('#edit-owner-email').val(owner.email);
                $('#edit-owner-id').val(owner.id_number);
                $('#edit-owner-contract-start').val(owner.contract_start);
                $('#edit-owner-contract-end').val(owner.contract_end);
                
                // Show the edit modal
                $('#editOwnerModal').show();
                
                // Handle form submission
                $('#editOwnerModal form').off('submit').on('submit', (e) => {
                    e.preventDefault();
                    this.updateStoreOwner(ownerId, $(e.target).serialize());
                });
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحميل بيانات صاحب المحل');
                console.error(error);
            }
        });
    }

    // Update store owner
    updateStoreOwner(ownerId, ownerData) {
        $.ajax({
            url: `${OWNER_API_URL}/${ownerId}`,
            method: 'PUT',
            data: ownerData,
            success: (response) => {
                alert('تم تحديث بيانات صاحب المحل بنجاح');
                this.loadStoreOwners();
                this.closeModal('editOwnerModal');
            },
            error: (xhr, status, error) => {
                alert('حدث خطأ أثناء تحديث بيانات صاحب المحل');
                console.error(error);
            }
        });
    }

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

// Initialize both management instances when document is ready
$(document).ready(() => {
    window.storeManagement = new StoreManagement();
    window.storeOwnerManagement = new StoreOwnerManagement();
});