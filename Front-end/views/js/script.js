// رسم بياني لتوزيع المحلات حسب النشاط
const storeTypesChart = new Chart(
  document.getElementById('storeTypesChart'),
  {
    type: 'doughnut',
    data: {
      labels: ['مطاعم', 'ملابس', 'إلكترونيات', 'مجوهرات', 'أخرى'],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#22c55e',
          '#3b82f6',
          '#f59e0b',
          '#ec4899',
          '#64748b'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  }
);

// رسم بياني لمعدل تحصيل الإيجارات
const rentCollectionChart = new Chart(
  document.getElementById('rentCollectionChart'),
  {
    type: 'line',
    data: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [{
        label: 'نسبة التحصيل',
        data: [95, 92, 96, 94, 95, 93],
        borderColor: '#22c55e',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  }
);

// رسم بياني لمقارنة نسب الإشغال
const occupancyChart = new Chart(
  document.getElementById('occupancyChart'),
  {
    type: 'bar',
    data: {
      labels: ['الدور الأرضي', 'الدور الأول', 'الدور الثاني'],
      datasets: [{
        label: 'نسبة الإشغال',
        data: [95, 85, 75],
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  }
);

// وظائف إدارة الفواتير
function openNewInvoiceForm() {
  document.getElementById('newInvoiceModal').style.display = 'block';
}

function openBulkMessageModal() {
  document.getElementById('bulkMessageModal').style.display = 'block';
}

function viewInvoice(id) {
  document.getElementById('invoiceDetailsModal').style.display = 'block';
}

function downloadPDF(id) {
  // تنفيذ تحميل PDF
  console.log('Downloading PDF for invoice:', id);
}

function sendMessage(id) {
  // تنفيذ إرسال رسالة
  console.log('Sending message for invoice:', id);
}

// وظائف إدارة المحلات
function openAddStockForm() {
  // تنفيذ فتح نموذج إضافة المخزون
  console.log('Opening add stock form');
}

function openNewStaffForm() {
  // تنفيذ فتح نموذج إضافة موظف جديد
  console.log('Opening new staff form');
}

// وظائف لوحة تحكم المول
function toggleForm() {
  const form = document.getElementById('mall-form');
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
}

// رسم المخطط البياني للمجمعات
const mallsChart = new Chart(
  document.getElementById('mallsChart'),
  {
    type: 'line',
    data: {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [{
        label: 'المجمعات الجديدة',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#22c55e',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  }
);

// تهيئة الوضع الليلي
document.addEventListener('DOMContentLoaded', () => {
  // إضافة مستمع لزر الوضع الليلي
  document.querySelectorAll('.btn-dark').forEach(button => {
    button.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  });

  // تهيئة الرسوم البيانية في لوحة تحكم المحل
  if (document.getElementById('weeklySalesChart')) {
    // رسم بياني للمبيعات الأسبوعية
    const weeklySalesChart = new Chart(document.getElementById('weeklySalesChart'), {
      type: 'line',
      data: {
        labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        datasets: [{
          label: 'المبيعات',
          data: [4500, 5200, 4800, 5500, 4900, 5230, 4700],
          borderColor: '#22c55e',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // رسم بياني فقاعي لأفضل المنتجات مبيعاً
    const topProductsChart = new Chart(document.getElementById('topProductsChart'), {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'المنتجات',
          data: [
            { x: 42, y: 4500, r: 15, label: 'منتج 1' },
            { x: 38, y: 3800, r: 12, label: 'منتج 2' },
            { x: 34, y: 4200, r: 10, label: 'منتج 3' },
            { x: 30, y: 3500, r: 8, label: 'منتج 4' },
            { x: 25, y: 3000, r: 6, label: 'منتج 5' }
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(34, 197, 94, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(239, 68, 68, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.raw.label}: ${context.raw.x} مبيعة, ${context.raw.y} ريال`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'عدد المبيعات'
            }
          },
          y: {
            title: {
              display: true,
              text: 'الإيرادات (ريال)'
            }
          }
        }
      }
    });

    // رسم بياني دائري لتوزيع المبيعات حسب الفئات
    const categorySalesChart = new Chart(document.getElementById('categorySalesChart'), {
      type: 'doughnut',
      data: {
        labels: ['ملابس', 'إلكترونيات', 'أحذية', 'اكسسوارات', 'منتجات منزلية'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b','#ef4444', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // رسم بياني لمقارنة المبيعات مع الأسبوع السابق
    const salesComparisonChart = new Chart(document.getElementById('salesComparisonChart'), {
      type: 'line',
      data: {
        labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        datasets: [{
          label: 'هذا الأسبوع',
          data: [4500, 5200, 4800, 5500, 4900, 5230, 4700],
          borderColor: '#22c55e',
          tension: 0.4
        }, {
          label: 'الأسبوع السابق',
          data: [4200, 4800, 4500, 5100, 4600, 4900, 4400],
          borderColor: '#94a3b8',
          tension: 0.4,
          borderDash: [5, 5]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // رسم بياني شبكي لأداء الموظفين
    const staffPerformanceChart = new Chart(document.getElementById('staffPerformanceChart'), {
      type: 'radar',
      data: {
        labels: ['المبيعات', 'خدمة العملاء', 'الالتزام', 'المعرفة بالمنتجات', 'العمل الجماعي'],
        datasets: [{
          label: 'أحمد',
          data: [95, 85, 90, 88, 92],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)'
        }, {
          label: 'محمد',
          data: [88, 90, 85, 92, 87],
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.2)'
        }, {
          label: 'سارة',
          data: [82, 95, 88, 85, 90],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.2)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    // رسم بياني مساحي لتوزيع المبيعات حسب ساعات اليوم
    const hourlyDistributionChart = new Chart(document.getElementById('hourlyDistributionChart'), {
      type: 'line',
      data: {
        labels: ['8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22'],
        datasets: [{
          label: 'المبيعات (ريال)',
          data: [2800, 3500, 4200, 3800, 4500, 5200, 4800],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // تهيئة التنقل بين الأقسام
// document.querySelectorAll('nav a').forEach(link => {
//   link.addEventListener('click', (e) => {
//     e.preventDefault();
//     document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
//     link.classList.add('active');
    
//     const sectionId = link.id.replace('-link', '-section');
//     document.querySelectorAll('.section').forEach(section => {
//       section.classList.remove('active');
//     });
//     document.getElementById(sectionId).classList.add('active');
//   });
// });

  // تهيئة النوافذ المنبثقة
  window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  };
});
// وظائف النوافذ المنبثقة
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function toggleProductForm() {
  const form = document.getElementById('newProductForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// وظائف إدارة المحلات
function openNewStoreForm() {
  const formContainer = document.getElementById('newStoreFormContainer');
  formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}

function openNewTenantForm() {
  const formContainer = document.getElementById('newTenantFormContainer');
  formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}

// وظائف خريطة المول
let currentFloor = 0;

function incrementFloor() {
  if (currentFloor < 2) {
    currentFloor++;
    updateFloorDisplay();
    renderFloorMap(currentFloor);
  }
}

function decrementFloor() {
  if (currentFloor > 0) {
    currentFloor--;
    updateFloorDisplay();
    renderFloorMap(currentFloor);
  }
}

function updateFloorDisplay() {
  document.getElementById('currentFloor').textContent = `الدور: ${currentFloor}`;
}

function renderFloorMap(floor) {
  const mapContainer = document.getElementById('mall-map');
  if (!mapContainer) return;
  
  mapContainer.innerHTML = '';

  const shops = [
    { id: 1, name: 'محل A101', status: 'open', area: 120, floor: 0, x: 1, y: 1, width: 2, height: 2 },
    { id: 2, name: 'محل A102', status: 'closed', area: 85, floor: 0, x: 3, y: 1, width: 2, height: 1 },
    { id: 3, name: 'محل A103', status: 'empty', area: 100, floor: 0, x: 5, y: 1, width: 2, height: 2 }
  ];

  const GRID_UNIT = 80;

  shops.filter(shop => shop.floor === floor).forEach(shop => {
    const shopDiv = document.createElement('div');
    shopDiv.className = `shop ${shop.status}`;
    shopDiv.style.width = `${shop.width * GRID_UNIT}px`;
    shopDiv.style.height = `${shop.height * GRID_UNIT}px`;
    shopDiv.style.left = `${shop.x * GRID_UNIT}px`;
    shopDiv.style.top = `${shop.y * GRID_UNIT}px`;
    
    shopDiv.innerHTML = `
      <strong>${shop.name}</strong>
      <span>${shop.area} م²</span>
    `;
    
    shopDiv.title = `اسم: ${shop.name}\nحالة: ${shop.status}\nمساحة: ${shop.area} م²`;
    mapContainer.appendChild(shopDiv);
  });
}

// تحديث خيارات الرسوم البيانية للوضع الليلي
function updateChartOptions(chart) {
  const isDarkMode = document.body.classList.contains('dark');
  const textColor = isDarkMode ? '#f8fafc' : '#1f2937';
  const gridColor = isDarkMode ? '#475569' : '#e5e7eb';
  const tooltipBackgroundColor = isDarkMode ? '#1e293b' : '#ffffff';

  if (chart.options) {
    // تحديث لون النص في المحاور
    if (chart.options.scales) {
      Object.values(chart.options.scales).forEach(scale => {
        if (scale.ticks) {
          scale.ticks.color = textColor;
          scale.ticks.font = {
            size: 12,
            weight: isDarkMode ? '600' : '400'
          };
        }
        if (scale.grid) {
          scale.grid.color = gridColor;
          scale.grid.borderColor = gridColor;
        }
        if (scale.title) {
          scale.title.color = textColor;
          scale.title.font = {
            size: 14,
            weight: '600'
          };
        }
      });
    }

    // تحديث لون النص في العنوان
    if (chart.options.plugins && chart.options.plugins.title) {
      chart.options.plugins.title.color = textColor;
      chart.options.plugins.title.font = {
        size: 16,
        weight: '600'
      };
    }

    // تحديث لون النص في التلميحات
    if (chart.options.plugins && chart.options.plugins.tooltip) {
      chart.options.plugins.tooltip.backgroundColor = tooltipBackgroundColor;
      chart.options.plugins.tooltip.titleColor = textColor;
      chart.options.plugins.tooltip.bodyColor = textColor;
      chart.options.plugins.tooltip.borderColor = gridColor;
      chart.options.plugins.tooltip.borderWidth = 1;
    }

    // تحديث لون النص في وسيلة الإيضاح
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = textColor;
      chart.options.plugins.legend.labels.font = {
        size: 12,
        weight: isDarkMode ? '600' : '400'
      };
    }

    chart.update();
  }
}

// تحديث جميع الرسوم البيانية عند تغيير الوضع
function updateAllCharts() {
  const charts = Object.values(Chart.instances);
  charts.forEach(chart => updateChartOptions(chart));
}

// إضافة مستمع لزر تغيير الوضع
document.querySelectorAll('.btn-dark').forEach(button => {
  button.addEventListener('click', () => {
    setTimeout(updateAllCharts, 100);
  });
});

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

function applyNightModeFromCookie() {
  const nightMode = getCookie('nightMode');
  if (nightMode === 'on') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

// On page load, apply the mode
document.addEventListener('DOMContentLoaded', function () {
  applyNightModeFromCookie();
  // If you have multiple night mode buttons, use a class instead of id
  const nightModeBtn = document.querySelector('.btn-dark');
  if (nightModeBtn) {
    nightModeBtn.onclick = function () {
      document.body.classList.toggle('dark');
      document.documentElement.classList.toggle('dark');
      setCookie('nightMode', document.body.classList.contains('dark') ? 'on' : 'off', 365);
    };
  }
});
