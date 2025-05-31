// تهيئة الرسوم البيانية
    document.addEventListener('DOMContentLoaded', function() {
      // تنسيق الشبكة لعرض 3 رسوم بيانية في صفين
      const chartsGrid = document.querySelector('.charts-grid');
      chartsGrid.style.display = 'grid';
      chartsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      chartsGrid.style.gridTemplateRows = 'repeat(2, 1fr)';
      chartsGrid.style.gap = '1.5rem';
      chartsGrid.style.width = '100%';
      chartsGrid.style.marginBottom = '2rem';
      
      // تحسين عرض البطاقات
      document.querySelectorAll('.charts-grid .card').forEach(card => {
        card.style.height = '100%';
        card.style.padding = '1.5rem';
        card.style.borderRadius = '0.75rem';
        card.style.backgroundColor = '#fff';
        card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      });
      
      // تحسين عناوين الرسوم البيانية
      document.querySelectorAll('.charts-grid .card h3').forEach(title => {
        title.style.marginTop = '0';
        title.style.marginBottom = '1rem';
        title.style.fontSize = '1rem';
        title.style.fontWeight = '600';
        title.style.color = '#1e293b';
      });
      
      // تحسين حجم الرسوم البيانية
      document.querySelectorAll('.charts-grid canvas').forEach(canvas => {
        canvas.style.width = '100%';
        canvas.style.maxHeight = '250px';
      })
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
            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
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
    });

    // وظائف التنقل بين الأقسام
    // document.querySelectorAll('nav a').forEach(link => {
    //   link.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    //     this.classList.add('active');
        
    //     const sectionId = this.id.replace('-link', '-section');
    //     document.querySelectorAll('.section').forEach(section => {
    //       section.classList.remove('active');
    //     });
    //     document.getElementById(sectionId).classList.add('active');
    //   });
    // });

    // وظائف النوافذ المنبثقة
    function openModal(modalId) {
      document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
    }

    function openNewProductForm() {
      openModal('newProductModal');
    }

    function openNewStaffForm() {
      openModal('newStaffModal');
    }

    function openAddStockForm() {
      // تنفيذ إضافة مخزون جديد
    }

    function completeSale() {
      // تنفيذ إتمام عملية البيع
    }
    