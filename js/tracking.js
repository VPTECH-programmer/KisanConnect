/* KisanConnect - Order Tracking Logic */

const Tracking = {
  currentStep: 2, // Start at step 3 (packed) for demo

  init() {
    // Check URL for order ID
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order') || 'ORD002';
    document.getElementById('trackingOrderId').textContent = orderId;

    // Load saved step
    const saved = localStorage.getItem('kc_tracking_step');
    if (saved) this.currentStep = parseInt(saved);

    this.renderTimeline();
  },

  renderTimeline() {
    const timeline = document.getElementById('trackingTimeline');
    if (!timeline) return;

    const steps = [
      { key: 'order_placed', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>', time: 'May 5, 10:00 AM' },
      { key: 'farmer_accepted', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>', time: 'May 5, 11:30 AM' },
      { key: 'packed', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>', time: 'May 6, 9:00 AM' },
      { key: 'in_transit', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M14 18V2H4a2 2 0 0 0-2 2v16"/><circle cx="7" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></svg>', time: 'May 7, 2:00 PM' },
      { key: 'delivered', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>', time: 'Expected: May 9' }
    ];

    timeline.innerHTML = steps.map((step, i) => {
      let status = 'pending';
      if (i < this.currentStep) status = 'completed';
      else if (i === this.currentStep) status = 'active';

      return `
        <div class="tracking-step ${status}">
          <div class="tracking-step-dot">${status === 'completed' ? '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>' : step.icon}</div>
          <div class="tracking-step-content">
            <h4 data-i18n="${step.key}">${App.t(step.key)}</h4>
            <p>${step.time}</p>
          </div>
        </div>
      `;
    }).join('');

    // Update status badge
    const statusBadge = document.getElementById('trackingStatus');
    if (statusBadge) {
      const statusKeys = ['order_placed', 'farmer_accepted', 'packed', 'in_transit', 'delivered'];
      const currentKey = statusKeys[this.currentStep] || 'order_placed';
      statusBadge.textContent = App.t(currentKey);
      statusBadge.className = 'badge ' + (this.currentStep >= 4 ? 'badge-success' : this.currentStep >= 3 ? 'badge-warning' : 'badge-primary');
    }
  },

  simulateProgress() {
    if (this.currentStep < 4) {
      this.currentStep++;
      localStorage.setItem('kc_tracking_step', this.currentStep.toString());
      this.renderTimeline();

      const statusKeys = ['order_placed', 'farmer_accepted', 'packed', 'in_transit', 'delivered'];
      const currentKey = statusKeys[this.currentStep];
      Toast.show(App.t(currentKey), 'success');
      Voice.speakKey(currentKey);
    } else {
      Toast.show('Order already delivered!', 'success');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Tracking.init();
});
