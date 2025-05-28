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
        url: 'http://localhost:8000/api/malls',
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
                    <td>${m.owner || '-'}</td>
                    <td>${m.location || '-'}</td>
                    <td>${m.floors || '0'}</td>
                    <td>${m.city}</td>
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
            url: `http://localhost:8000/api/malls/${id}`,
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

// Initialize the page
$(document).ready(function() {
    fetchMalls();
});