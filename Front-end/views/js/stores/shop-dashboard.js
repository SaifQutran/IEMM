// Fetch and render dashboard cards dynamically
$(document).ready(function () {
  const shopId = localStorage.getItem('shop_id');
  if (!shopId) return;

  fetch(`/api/shops/${shopId}/dashboard`)
    .then(res => res.json())
    .then(res => {
      if (res.status !== 'success' || !Array.isArray(res.data)) return;
      renderDashboardCards(res.data);
    });
});

function renderDashboardCards(cards) {
  const grid = document.querySelector('.stats-grid');
  if (!grid) return;
  grid.innerHTML = '';
  cards.forEach(card => {
    // Determine color class for value/change
    let valueClass = '';
    let changeClass = '';
    if (typeof card.change === 'number') {
      if (card.change > 0) changeClass = 'positive';
      else if (card.change < 0) changeClass = 'negative';
    }
    if (typeof card.value === 'number') {
      if (card.value > 0) valueClass = 'positive';
      else if (card.value < 0) valueClass = 'negative';
    }
    // Special: if change_text contains + or -, color accordingly
    if (card.change_text && card.change_text.includes('+')) changeClass = 'positive';
    if (card.change_text && card.change_text.includes('-')) changeClass = 'negative';

    grid.innerHTML += `
      <div class="stat-card">
        <h3 class="stat-title">${card.title}</h3>
        <p class="stat-value ${valueClass}">${card.value ?? '-' }${card.unit ? ' ' + card.unit : ''}</p>
        ${card.change_text ? `<span class="stat-change ${changeClass}">${card.change_text}</span>` : ''}
      </div>
    `;
  });
}

// Add some basic coloring if not present
const style = document.createElement('style');
style.innerHTML = `
  .stat-value.positive, .stat-change.positive { color: #22c55e !important; }
  .stat-value.negative, .stat-change.negative { color: #ef4444 !important; }
`;
document.head.appendChild(style);
