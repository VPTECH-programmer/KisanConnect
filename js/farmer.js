/* KisanConnect - Farmer Dashboard Logic - Upgraded with Trust & Ratings */

const Farmer = {
  user: null,
  crops: [],

  init() {
    this.user = Session.requireAuth(['farmer']);
    if (!this.user) return;

    const stored = localStorage.getItem('kc_farmer_crops');
    if (stored) {
      this.crops = JSON.parse(stored);
    } else {
      this.crops = DEMO_CROPS.filter(c => c.farmerMobile === this.user.mobile);
      localStorage.setItem('kc_farmer_crops', JSON.stringify(this.crops));
    }

    this.renderCrops();
    this.renderOrders();
    this.renderEarnings();
    this.updateKYCBadge();
    this.renderTrustAndRating();
    this.renderVerificationTimeline();
    this.renderDemandPrediction();
  },

  updateKYCBadge() {
    const badges = [document.getElementById('kycBadge'), document.getElementById('kycBadgeMain')];
    const status = this.user.verificationStatus || (this.user.kycVerified ? 'approved' : 'none');
    badges.forEach(badge => {
      if (!badge) return;
      if (status === 'approved') {
        badge.style.display = 'inline-flex';
        badge.innerHTML = `<svg viewBox="0 0 24 24" fill="#16a34a" width="16" height="16"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span data-i18n="kyc_verified">${App.t('kyc_verified')}</span>`;
      } else if (status === 'pending') {
        badge.style.display = 'inline-flex';
        badge.innerHTML = `<span style="background:var(--warning-50);color:var(--warning-600);padding:4px 12px;border-radius:var(--radius-full);font-size:0.85rem;font-weight:600;display:inline-flex;align-items:center;gap:6px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Pending Verification</span>`;
      } else {
        badge.innerHTML = `<a href="kyc.html" class="btn btn-sm btn-outline" style="font-size:0.8rem">Complete Verification</a>`;
      }
    });
  },

  renderTrustAndRating() {
    const farmer = DEMO_FARMERS.find(f => f.mobile === this.user.mobile);
    if (!farmer) return;

    // Trust bar
    const trustBar = document.getElementById('farmerTrustBar');
    if (trustBar) {
      trustBar.innerHTML = renderTrustBar(farmer.trustScore);
    }

    // Trust stats
    const trustStats = document.getElementById('farmerTrustStats');
    if (trustStats) {
      trustStats.innerHTML = `
        <div class="farmer-trust-stat"><div class="value" style="color:var(--primary-600)">${farmer.deliverySuccessRate}%</div><div class="label">${App.t('delivery_success')}</div></div>
        <div class="farmer-trust-stat"><div class="value" style="color:var(--secondary-600)">${farmer.repeatCustomerPercent}%</div><div class="label">${App.t('repeat_customers')}</div></div>
        <div class="farmer-trust-stat"><div class="value" style="color:var(--accent-600)">${farmer.positiveReviewPercent}%</div><div class="label">${App.t('positive_reviews')}</div></div>
      `;
    }

    // Rating display
    const ratingDisplay = document.getElementById('farmerRatingDisplay');
    if (ratingDisplay) {
      const reviews = getFarmerReviews(farmer.id);
      ratingDisplay.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
          <span style="font-size:2rem;font-weight:800">${farmer.rating}</span>
          ${renderStars(farmer.rating, 20)}
        </div>
        <p style="font-size:0.85rem;color:var(--neutral-500)">${farmer.totalReviews} ${App.t('reviews')} | ${farmer.totalOrders} orders</p>
      `;
    }

    // Reviews list
    const reviewsList = document.getElementById('farmerReviewsList');
    if (reviewsList) {
      const reviews = getFarmerReviews(farmer.id);
      if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color:var(--neutral-400);font-size:0.85rem">No reviews yet</p>';
      } else {
        reviewsList.innerHTML = reviews.slice(0, 3).map(r => `
          <div class="review-card" style="padding:12px;margin-bottom:8px">
            <div class="review-card-header" style="margin-bottom:4px">
              <div class="review-card-author">
                <div class="review-avatar">${r.consumerName.charAt(0)}</div>
                <div><strong style="font-size:0.85rem">${r.consumerName}</strong></div>
              </div>
              ${renderStars(r.rating, 12)}
            </div>
            <p style="font-size:0.8rem;color:var(--neutral-600)">${App.lang === 'hi' && r.textHi ? r.textHi : r.text}</p>
          </div>
        `).join('');
      }
    }
  },

  renderVerificationTimeline() {
    const el = document.getElementById('farmerVerificationTimeline');
    if (!el) return;

    const farmer = DEMO_FARMERS.find(f => f.mobile === this.user.mobile);
    const status = farmer ? farmer.verificationStatus : 'none';

    const steps = [
      { label: 'Aadhaar Verified', done: status !== 'none' },
      { label: 'Kisan ID Verified', done: status === 'approved' || status === 'pending' },
      { label: 'Land Details Submitted', done: status === 'approved' || status === 'pending' },
      { label: 'Documents Uploaded', done: status === 'approved' || status === 'pending' },
      { label: 'Admin Verification', done: status === 'approved', active: status === 'pending' }
    ];

    el.innerHTML = steps.map((step, i) => `
      <div class="tracking-step ${step.done ? 'completed' : ''} ${step.active ? 'active' : ''}">
        <div class="tracking-step-dot" style="width:36px;height:36px">
          ${step.done ? '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>' : (i + 1)}
        </div>
        <div class="tracking-step-content">
          <h4 style="font-size:0.9rem">${step.label}</h4>
          ${step.active ? '<p style="color:var(--warning-600);font-size:0.8rem">Under review by admin</p>' : ''}
          ${step.done && i === 4 ? '<p style="color:var(--primary-600);font-size:0.8rem">Verified on ' + (farmer.verifiedDate || 'May 2026') + '</p>' : ''}
        </div>
      </div>
    `).join('');
  },

  showSection(name) {
    document.querySelectorAll('[id^="section-"]').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById('section-' + name);
    if (section) section.classList.remove('hidden');

    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    const sectionMap = { dashboard: 0, crops: 1, orders: 2, earnings: 3 };
    const links = document.querySelectorAll('.sidebar-nav a');
    if (sectionMap[name] !== undefined && links[sectionMap[name]]) {
      links[sectionMap[name]].classList.add('active');
    }
    this.toggleSidebar(false);
  },

  toggleSidebar(forceState) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen = sidebar.classList.contains('open');
    const shouldOpen = forceState !== undefined ? forceState : !isOpen;
    if (shouldOpen) { sidebar.classList.add('open'); overlay.classList.add('active'); }
    else { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
  },

  renderCrops() {
    const grid = document.getElementById('cropGrid');
    if (!grid) return;
    grid.innerHTML = this.crops.map(crop => `
      <div class="crop-card">
        <div class="crop-card-img">
          ${CropSVGs[crop.image] || CropSVGs.potato}
          ${crop.verified ? '<span class="badge badge-success" style="position:absolute;top:8px;right:8px"><svg viewBox="0 0 24 24" fill="#16a34a" width="12" height="12"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Verified</span>' : ''}
        </div>
        <div class="crop-card-body">
          <h4>${App.lang === 'hi' && crop.nameHi ? crop.nameHi : crop.name}</h4>
          <div class="crop-card-farmer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${crop.farmer}
          </div>
          <div class="crop-card-price">
            <span class="price">₹${crop.price}<span>/${App.lang === 'hi' ? 'किलो' : 'kg'}</span></span>
            <span class="badge badge-primary">${crop.quantity} ${App.lang === 'hi' ? 'किलो' : 'kg'}</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderDemandPrediction() {
    const el = document.getElementById('aiDemandPanel');
    if (!el || typeof DEMAND_PREDICTIONS === 'undefined') return;

    el.innerHTML = `
      <div class="ai-panel-header">
        <div>
          <h3>AI-Based Demand Prediction & Price Optimization</h3>
          <p>Market data + demand trends + weather analysis -> AI prediction -> best selling price suggestion</p>
        </div>
        <span class="badge badge-primary">Smart Pricing</span>
      </div>
      <div class="ai-signal-grid">
        <div><strong>Market price</strong><span>Previous mandi price movement</span></div>
        <div><strong>Seasonality</strong><span>Crop cycle and demand pattern</span></div>
        <div><strong>Weather</strong><span>Local supply risk forecast</span></div>
        <div><strong>Consumer trends</strong><span>Buying and repeat order signals</span></div>
      </div>
      <div class="ai-recommendation-grid">
        ${DEMAND_PREDICTIONS.map(item => `
          <div class="ai-recommendation-card">
            <div class="flex justify-between items-center gap-12">
              <h4>${item.crop}</h4>
              <span class="badge ${item.demand === 'High' || item.demand === 'Rising' ? 'badge-success' : 'badge-warning'}">${item.demand}</span>
            </div>
            <div class="ai-price-row">
              <span>Suggested price</span>
              <strong>&#8377;${item.suggestedPrice}/kg</strong>
            </div>
            <div class="ai-price-row">
              <span>Sell window</span>
              <strong>${item.sellWindow}</strong>
            </div>
            <div class="ai-confidence"><span style="width:${item.confidence}%"></span></div>
            <p>${item.confidence}% confidence - ${item.reason}</p>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderOrders() {
    const orders = DEMO_ORDERS.filter(o => o.farmerMobile === this.user.mobile);
    const html = orders.map(order => `
      <div class="order-card">
        <div class="order-card-header">
          <h4>${order.id}</h4>
          <span class="badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'in_transit' ? 'badge-warning' : 'badge-primary'}">${order.status.replace('_', ' ')}</span>
        </div>
        <div class="order-card-body">
          <span>${order.crop} x ${order.quantity}kg</span>
          <span style="font-weight:700">₹${order.total}</span>
        </div>
      </div>
    `).join('');

    const recentEl = document.getElementById('recentOrders');
    const allEl = document.getElementById('allOrders');
    if (recentEl) recentEl.innerHTML = html;
    if (allEl) allEl.innerHTML = html || '<p style="color:var(--neutral-400)">No orders yet</p>';
  },

  renderEarnings() {
    const el = document.getElementById('earningsHistory');
    if (!el) return;
    el.innerHTML = DEMO_PAYMENTS.map(p => `
      <div class="txn-item">
        <div class="txn-info">
          <div class="txn-icon" style="background:${p.status === 'completed' ? 'var(--success-50)' : 'var(--warning-50)'}; color:${p.status === 'completed' ? 'var(--success-600)' : 'var(--warning-600)'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div style="font-weight:600">${p.orderId}</div>
            <div style="font-size:0.85rem;color:var(--neutral-500)">${p.method} - ${p.date}</div>
          </div>
        </div>
        <div class="txn-amount" style="color:${p.status === 'completed' ? 'var(--success-600)' : 'var(--warning-600)'}">₹${p.amount}</div>
      </div>
    `).join('');
  },

  showAddCrop() {
    document.getElementById('addCropModal').classList.remove('hidden');
    if (!document.getElementById('cropNameInput').value.trim()) {
      document.getElementById('cropNameInput').value = 'Potato';
    }
    this.updateGovtPriceGuide();
  },

  hideAddCrop() {
    document.getElementById('addCropModal').classList.add('hidden');
  },

  addCrop() {
    const name = document.getElementById('cropNameInput').value.trim();
    const price = parseInt(document.getElementById('cropPriceInput').value);
    const qty = parseInt(document.getElementById('cropQtyInput').value);
    const minPurchase = parseInt(document.getElementById('cropMinPurchaseInput').value) || Math.max(1, Math.round(qty * 0.05));
    const maxPurchase = parseInt(document.getElementById('cropMaxPurchaseInput').value) || Math.max(5, Math.round(qty * 0.2));
    const category = document.getElementById('cropCategoryInput').value;

    if (!name || !price || !qty || minPurchase > maxPurchase || maxPurchase > qty) {
      Toast.show('Please fill all fields', 'error');
      return;
    }

    const newCrop = {
      id: Date.now(), name, nameHi: name, category, price, quantity: qty, minPurchase, maxPurchase,
      farmer: this.user.name, farmerMobile: this.user.mobile,
      verified: this.user.verificationStatus === 'approved',
      unit: 'kg', image: 'potato'
    };

    this.crops.push(newCrop);
    localStorage.setItem('kc_farmer_crops', JSON.stringify(this.crops));
    this.renderCrops();
    this.hideAddCrop();
    Toast.show('Crop listed successfully!', 'success');

    document.getElementById('cropNameInput').value = '';
    document.getElementById('cropPriceInput').value = '';
    document.getElementById('cropQtyInput').value = '';
    document.getElementById('cropMinPurchaseInput').value = '';
    document.getElementById('cropMaxPurchaseInput').value = '';
    this.updateGovtPriceGuide();
  },

  updateGovtPriceGuide() {
    const guide = document.getElementById('govtPriceGuide');
    const name = document.getElementById('cropNameInput')?.value.trim() || 'Potato';
    if (!guide) return;

    const source = typeof getGovtPriceSource === 'function' ? getGovtPriceSource(name) : null;
    if (!source) {
      guide.innerHTML = `
        <div class="govt-guide-title">Govt source price guide</div>
        <div class="govt-guide-empty">No default range found. Use nearby mandi or MSP data for this crop.</div>
      `;
      return;
    }

    guide.innerHTML = `
      <div class="govt-guide-title">Govt source price guide - ${source.source}</div>
      <div class="govt-price-range">
        <span>Min &#8377;${source.min}/kg</span>
        <span>Max &#8377;${source.max}/kg</span>
      </div>
    `;
  },

  logout() {
    Session.clear();
    window.location.href = 'index.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Farmer.init();
});
