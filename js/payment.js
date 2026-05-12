/* KisanConnect - Payment Logic */

const Payment = {
  selectedMethod: null,

  init() {
    this.renderSummary();
    this.renderHistory();
  },

  renderSummary() {
    const cart = Cart.get();
    const itemsEl = document.getElementById('summaryItems');
    const totalEl = document.getElementById('summaryTotal');

    if (cart.length === 0) {
      // Show demo order if cart is empty
      if (itemsEl) {
        itemsEl.innerHTML = `
          <div class="flex justify-between items-center" style="padding:8px 0">
            <span>Onion x 5kg</span>
            <span style="font-weight:600">₹150</span>
          </div>
        `;
      }
      if (totalEl) totalEl.textContent = '₹150';
      return;
    }

    if (itemsEl) {
      itemsEl.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center" style="padding:8px 0">
          <span>${App.lang === 'hi' && item.nameHi ? item.nameHi : item.name} x ${item.qty || 1}kg</span>
          <span style="font-weight:600">₹${item.price * (item.qty || 1)}</span>
        </div>
      `).join('');
    }
    if (totalEl) totalEl.textContent = '₹' + Cart.total();
  },

  selectMethod(method) {
    this.selectedMethod = method;
    document.querySelectorAll('.payment-method').forEach(el => {
      el.classList.toggle('selected', el.getAttribute('data-method') === method);
    });

    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.style.opacity = '1';
    }
  },

  processPayment() {
    if (!this.selectedMethod) {
      Toast.show('Please select a payment method', 'error');
      return;
    }

    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
      payBtn.innerHTML = `<span data-i18n="pay_processing">${App.t('pay_processing')}</span>`;
      payBtn.disabled = true;
    }

    // Simulate processing
    setTimeout(() => {
      const txnId = 'TXN' + Date.now().toString().slice(-6);
      document.getElementById('txnId').textContent = txnId;
      document.getElementById('paymentSuccess').classList.remove('hidden');

      Toast.show(App.t('pay_success'), 'success');
      Voice.speakKey('pay_success');

      // Clear cart
      Cart.clear();
    }, 2000);
  },

  renderHistory() {
    const el = document.getElementById('txnHistory');
    if (!el) return;

    const payments = DEMO_PAYMENTS;
    el.innerHTML = payments.map(p => `
      <div class="txn-item">
        <div class="txn-info">
          <div class="txn-icon" style="background:${p.status === 'completed' ? 'var(--success-50)' : 'var(--warning-50)'}; color:${p.status === 'completed' ? 'var(--success-600)' : 'var(--warning-600)'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div style="font-weight:600">${p.id}</div>
            <div style="font-size:0.85rem;color:var(--neutral-500)">${p.method} - ${p.date}</div>
          </div>
        </div>
        <div>
          <div class="txn-amount" style="color:${p.status === 'completed' ? 'var(--success-600)' : 'var(--warning-600)'}">₹${p.amount}</div>
          <span class="badge ${p.status === 'completed' ? 'badge-success' : 'badge-warning'}" style="font-size:0.7rem">${p.status}</span>
        </div>
      </div>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Payment.init();
});
