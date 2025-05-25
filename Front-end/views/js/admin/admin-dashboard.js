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

      document.addEventListener('DOMContentLoaded', function () {
        applyNightModeFromCookie();
        const nightModeBtn = document.querySelector('.btn-dark');
        if (nightModeBtn) {
          nightModeBtn.onclick = function () {
            document.body.classList.toggle('dark');
            setCookie('nightMode', document.body.classList.contains('dark') ? 'on' : 'off', 365);
          };
        }
      });