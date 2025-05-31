// Dashboard API endpoint
const ADMIN_DASHBOARD_API = 'http://localhost/IEMM/Back-end/public/api/malls';

// Mapping of API keys to card titles (Arabic)
const dashboardCards = [
  { 
    key: 'total_facilities', 
    title: 'إجمالي المرافق',
    detail: 'total_rented_facilities',
    detailTitle: 'المرافق المؤجرة'
  },
  { 
    key: 'total_shops', 
    title: 'إجمالي المحلات',
    details:[{ 
    key: 'total_opened_shops', 
    title: 'إجمالي المحلات المفتوحة'
  },
  { 
    key: 'total_closed_shops', 
    title: 'إجمالي المحلات المغلقة'
  }
        
    ]
  },
  
  { 
    key: 'total_rents_last_month', 
    title: 'إجمالي الإيجارات الشهر الماضي',
    format: (value) => `${value.toLocaleString()} ريال`
  },
  { 
    key: 'remaining_payments.total', 
    title: 'إجمالي المبالغ المتبقية',
    format: (value) => `${value.toLocaleString()} ريال`,
    details: [
      { key: 'remaining_payments.water', title: 'الماء' },
      { key: 'remaining_payments.electricity', title: 'الكهرباء' },
      { key: 'remaining_payments.rent', title: 'الإيجار' }
    ],
    detailStyle: 'color: #ef4444; font-weight: 500;'
  }
];

function formatValue(value, format) {
  if (format) {
    return format(value);
  }
  return value.toLocaleString();
}

function renderDashboardCards(data) {
  const grid = document.querySelector('.stats-grid');
  if (!grid) return;
  grid.innerHTML = '';

  dashboardCards.forEach(card => {
    // Get the value using dot notation for nested properties
    const value = card.key.split('.').reduce((obj, key) => obj?.[key], data);
    if (typeof value === 'undefined') return;

    // Card HTML
    let cardHtml = `<div class="stat-card">
      <h3>${card.title}</h3>
      <p class="stat-number">${formatValue(value, card.format)}</p>`;

    // Add detail if available
    if (card.detail) {
      const detailValue = data[card.detail];
      if (typeof detailValue !== 'undefined') {
        cardHtml += `<p class="stat-change">${card.detailTitle}: ${detailValue}</p>`;
      }
    }

    // Add multiple details if available
    if (card.details) {
      card.details.forEach(detail => {
        const detailValue = detail.key.split('.').reduce((obj, key) => obj?.[key], data);
        if (typeof detailValue !== 'undefined') {
          const style = card.detailStyle || '';
          cardHtml += `<p class="stat-change" style="${style}">${detail.title}: ${formatValue(detailValue, card.format)}</p>`;
        }
      });
    }

    cardHtml += '</div>';
    grid.innerHTML += cardHtml;
  });
}

// Function to load jQuery dynamically if not present
function loadjQuery() {
  return new Promise((resolve, reject) => {
    if (window.jQuery) {
      resolve(window.jQuery);
    } else {
      const script = document.createElement('script');
      script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      script.onload = () => resolve(window.jQuery);
      script.onerror = () => reject(new Error('Failed to load jQuery'));
      document.head.appendChild(script);
    }
  });
}

// Show error message in the dashboard
function showError(message) {
  const grid = document.querySelector('.stats-grid');
  if (!grid) return;
  
  grid.innerHTML = `
    <div class="error-message" style="
      text-align: center;
      padding: 20px;
      background-color: #fee2e2;
      border: 1px solid #ef4444;
      border-radius: 8px;
      color: #991b1b;
      margin: 20px 0;
    ">
      <i class="fas fa-exclamation-circle" style="font-size: 24px; margin-bottom: 10px;"></i>
      <p>${message}</p>
    </div>
  `;
}

// Initialize dashboard
async function initializeDashboard() {
  try {
    // Load jQuery if not present
    await loadjQuery();
    
    // Get mall ID from localStorage
    const mallId = localStorage.getItem('mall_id');
    if (!mallId) {
      showError('Mall ID not found. Please log in again.');
      return;
    }

    // Show loading state
    const grid = document.querySelector('.stats-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="loading" style="text-align: center; padding: 20px;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i>
          <p>جاري تحميل البيانات...</p>
        </div>
      `;
    }

    // Fetch dashboard data using jQuery AJAX
    $.ajax({
      url: `${ADMIN_DASHBOARD_API}/${mallId}/admin`,
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      success: function(response) {
        // console.log(response.data);
        if (response && response.success && response.data) {
          renderDashboardCards(response.data);
        } else {
          showError(response?.message || 'Error loading dashboard data');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error fetching dashboard data:', error);
        console.error('Response:', xhr.responseText);
        
        if (xhr.status === 401) {
          // Handle unauthorized access
          window.location.href = '../login.html';
        } else if (xhr.status === 404) {
          showError('Mall not found');
        } else {
          showError('Error loading dashboard data. Please try again later.');
        }
      }
    });
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    showError('Error initializing dashboard. Please refresh the page.');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDashboard);
