// Dashboard API endpoint
const DASHBOARD_API = 'http://localhost/IEMM/Back-end/public/api/admin';

// Mapping of API keys to card titles (Arabic)
const dashboardCards = [
  { key: 'malls_count', title: 'إجمالي المجمعات', monthKey: 'malls_count_last_month' },
  { key: 'shops_count', title: 'إجمالي المحلات', monthKey: 'shops_count_last_month' },
  { key: 'sales_count', title: 'إجمالي المبيعات', monthKey: 'sales_count_last_month' },
  // { key: 'available_facilities', title: 'المرافق الشاغرة', extra: true },
  { key: 'facilities_count', title: 'إجمالي المرافق' },
  { key: 'users_count', title: 'إجمالي المستخدمين',first_detail_title:'عدد مدراء المولات',first_detail:'mall_owners_count',second_detail_title:'عدد موظفي المحلات',second_detail:'salesmen_count'},
  // { key: 'stat_detail', title: 'إجمالي المستخدمين',first_detail_title:'عدد مدراء المولات',first_detail:'malls_owners_count',second_detail_title:'عدد موظفي المحلات',second_detail:'salesmen_count'},
  { key: 'customers_count', title: 'إجمالي العملاء', monthKey: 'customers_count_last_month' }
];

function renderDashboardCards(data) {
  const grid = document.querySelector('.stats-grid');
  if (!grid) return;
  grid.innerHTML = '';

  dashboardCards.forEach(card => {
    if (typeof data[card.key] === 'undefined') return; // Skip if not in API
    console.log(data);
    // Card HTML
    let cardHtml = `<div class="stat-card">
      <h3>${card.title}</h3>
      <p class="stat-number">${data[card.key]}</p>`;

    // Show month change if available
    if (card.monthKey && typeof data[card.monthKey] !== 'undefined') {
      cardHtml += `<p class="stat-change positive">+${data[card.monthKey]} هذا الشهر</p>`;
    }
    if ((card.first_detail && typeof data[card.first_detail] !== 'undefined')) {
      cardHtml += `<p class="stat-change positive">${card.first_detail_title} ${data[card.first_detail]} </p>`;
      cardHtml += `<p class="stat-change positive">${card.second_detail_title} ${data[card.second_detail]} </p>`;
    }

    // Special for available_facilities: show total if facilities_count exists
    if (card.key === 'stat_detail' && typeof data['stat_detail'] !== 'undefined') {
      cardHtml += `<p style="font-size:14px;">${data['stat_detail']} ${data['stat_detail_title-']}</p>`;
    }

    cardHtml += '</div>';
    grid.innerHTML += cardHtml;
  });
}

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
      document.addEventListener('DOMContentLoaded', function () {
        // Fetch dashboard data from API
        fetch(DASHBOARD_API)
          .then(res => res.json())
          .then(json => {
            if (json && json.data) {
              renderDashboardCards(json.data);
            }
          })
          .catch(err => {
            console.error('Error fetching dashboard data:', err);
          });
      });