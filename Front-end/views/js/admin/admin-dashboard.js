    const ctx = document.getElementById('mallsChart').getContext('2d');
    new Chart(ctx, {
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
    });