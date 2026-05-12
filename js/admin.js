/* KisanConnect - Admin Dashboard Logic - Upgraded with Verification & Trust */

const Admin = {
  verificationTab: 'pending',

  init() {
    const user = Session.requireAuth(['admin']);
    if (!user) return;

    this.renderCharts();
    this.renderVerifications();
    this.renderReviewModeration();
    this.renderTrustChart();
    this.renderOrders();
    this.renderDisputes();
    this.animateCounters();
  },

  showSection(name) {
    document.querySelectorAll('[id^="section-"]').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById('section-' + name);
    if (section) section.classList.remove('hidden');

    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    const sectionMap = { overview: 0, verification: 1, orders: 2, disputes: 3, stats: 4 };
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

  setVerificationTab(tab) {
    this.verificationTab = tab;
    document.querySelectorAll('#verificationTabs .admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    this.renderVerifications();
  },

  renderVerifications() {
    const el = document.getElementById('verificationList');
    if (!el) return;

    const queue = DEMO_VERIFICATION_QUEUE.filter(v => v.status === this.verificationTab);
    const approvedFarmers = DEMO_FARMERS.filter(f => f.verificationStatus === 'approved');

    if (this.verificationTab === 'approved') {
      el.innerHTML = approvedFarmers.map(f => `
        <div class="verification-detail-card">
          <div class="verification-detail-header">
            <div class="verification-detail-avatar" style="background:var(--primary-100);color:var(--primary-700)">${f.avatar}</div>
            <div>
              <div style="font-weight:700">${App.lang === 'hi' && f.nameHi ? f.nameHi : f.name}</div>
              <div style="font-size:0.85rem;color:var(--neutral-500)">${f.mobile} | Verified: ${f.verifiedDate || 'N/A'}</div>
            </div>
            <span class="badge badge-success" style="margin-left:auto">Approved</span>
          </div>
          <div class="verification-detail-grid">
            <div class="verification-detail-item"><div class="label">Aadhaar</div><div class="value">${f.aadhaar}</div></div>
            <div class="verification-detail-item"><div class="label">Kisan ID</div><div class="value">${f.kisanId}</div></div>
            <div class="verification-detail-item"><div class="label">Khasra</div><div class="value">${f.khasra}</div></div>
            <div class="verification-detail-item"><div class="label">Location</div><div class="value">${f.village}, ${f.district}</div></div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
            ${renderStars(f.rating, 14)} <span style="font-size:0.85rem;color:var(--neutral-500)">${f.rating} | Trust: ${f.trustScore}%</span>
          </div>
        </div>
      `).join('');
      return;
    }

    if (this.verificationTab === 'rejected') {
      const rejected = DEMO_FARMERS.filter(f => f.verificationStatus === 'rejected');
      el.innerHTML = rejected.map(f => `
        <div class="verification-detail-card" style="border-left:3px solid var(--error-500)">
          <div class="verification-detail-header">
            <div class="verification-detail-avatar" style="background:var(--error-50);color:var(--error-600)">${f.avatar}</div>
            <div>
              <div style="font-weight:700">${App.lang === 'hi' && f.nameHi ? f.nameHi : f.name}</div>
              <div style="font-size:0.85rem;color:var(--error-500)">${f.rejectionReason || 'Rejected'}</div>
            </div>
            <span class="badge badge-error" style="margin-left:auto">Rejected</span>
          </div>
        </div>
      `).join('');
      if (rejected.length === 0) el.innerHTML = '<div class="empty-state"><h4>No rejected applications</h4></div>';
      return;
    }

    // Pending
    if (queue.length === 0) {
      el.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><polyline points="20 6 9 17 4 12"/></svg><h4>No pending verifications</h4><p>All caught up!</p></div>';
      return;
    }

    el.innerHTML = queue.map(v => `
      <div class="verification-detail-card" id="verification-${v.id}">
        <div class="verification-detail-header">
          <div class="verification-detail-avatar" style="background:var(--warning-50);color:var(--warning-600)">${v.name.charAt(0)}</div>
          <div>
            <div style="font-weight:700">${App.lang === 'hi' && v.nameHi ? v.nameHi : v.name}</div>
            <div style="font-size:0.85rem;color:var(--neutral-500)">${v.mobile} | Applied: ${v.date}</div>
          </div>
          <span class="badge badge-warning" style="margin-left:auto">Pending</span>
        </div>
        <div class="verification-detail-grid">
          <div class="verification-detail-item"><div class="label">Aadhaar</div><div class="value">${v.aadhaar}</div></div>
          <div class="verification-detail-item"><div class="label">Kisan ID</div><div class="value">${v.kisanId}</div></div>
          <div class="verification-detail-item"><div class="label">Khasra</div><div class="value">${v.khasra}</div></div>
          <div class="verification-detail-item"><div class="label">Location</div><div class="value">${v.village}, ${v.district}, ${v.state}</div></div>
        </div>
        <div class="verification-docs">
          <div class="verification-doc-thumb ${v.documents.aadhaar ? '' : 'style=opacity:0.4"'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            Aadhaar ${v.documents.aadhaar ? '' : '(Missing)'}
          </div>
          <div class="verification-doc-thumb" ${v.documents.landProof ? '' : 'style="opacity:0.4"'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            Land Proof ${v.documents.landProof ? '' : '(Missing)'}
          </div>
          <div class="verification-doc-thumb" ${v.documents.farmerPhoto ? '' : 'style="opacity:0.4"'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Photo ${v.documents.farmerPhoto ? '' : '(Missing)'}
          </div>
        </div>
        <div id="bhulekhResult-${v.id}"></div>
        <div class="verification-actions-bar">
          <button class="btn btn-outline btn-sm" onclick="Admin.verifyBhulekh(${v.id})" data-i18n="verify_bhulekh">Verify via MP Bhulekh Portal</button>
          <button class="btn btn-primary btn-sm" onclick="Admin.approveFarmer(${v.id})" data-i18n="approve_farmer">Approve Farmer</button>
          <button class="btn btn-danger btn-sm" onclick="Admin.rejectFarmer(${v.id})" data-i18n="reject_farmer">Reject Farmer</button>
          <button class="btn btn-ghost btn-sm" onclick="Admin.requestReupload(${v.id})" data-i18n="request_reupload">Request Re-upload</button>
        </div>
      </div>
    `).join('');
  },

  verifyBhulekh(id) {
    const el = document.getElementById('bhulekhResult-' + id);
    if (!el) return;

    el.innerHTML = `<div class="bhulekh-loader"><div class="bhulekh-spinner"></div><span>${App.t('bhulekh_verifying')}</span></div>`;

    setTimeout(() => {
      const isSuccess = id !== 3; // Ravi Singh fails
      el.innerHTML = isSuccess
        ? `<div class="bhulekh-result success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg><span>${App.t('bhulekh_verified')}</span></div>`
        : `<div class="bhulekh-result error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>${App.t('bhulekh_mismatch')}</span></div>`;
    }, 2500);
  },

  approveFarmer(id) {
    const v = DEMO_VERIFICATION_QUEUE.find(v => v.id === id);
    if (v) v.status = 'approved';
    const card = document.getElementById('verification-' + id);
    if (card) {
      card.style.borderLeft = '3px solid var(--primary-500)';
      card.querySelector('.verification-actions-bar').innerHTML = '<span class="badge badge-success">Approved - Farmer will be notified</span>';
      card.querySelector('.badge-warning').className = 'badge badge-success';
      card.querySelector('.badge-success').textContent = 'Approved';
    }
    Toast.show('Farmer approved successfully!', 'success');
  },

  rejectFarmer(id) {
    const v = DEMO_VERIFICATION_QUEUE.find(v => v.id === id);
    if (v) v.status = 'rejected';
    const card = document.getElementById('verification-' + id);
    if (card) {
      card.style.borderLeft = '3px solid var(--error-500)';
      card.querySelector('.verification-actions-bar').innerHTML = '<span class="badge badge-error">Rejected</span>';
    }
    Toast.show('Farmer verification rejected', 'error');
  },

  requestReupload(id) {
    const card = document.getElementById('verification-' + id);
    if (card) {
      card.querySelector('.verification-actions-bar').innerHTML = '<span class="badge badge-warning">Re-upload requested - Farmer will be notified</span>';
    }
    Toast.show('Re-upload requested', 'success');
  },

  renderReviewModeration() {
    const el = document.getElementById('reviewModerationList');
    if (!el) return;

    const reported = DEMO_REVIEWS.filter(r => r.reported);
    const allReviews = DEMO_REVIEWS.slice().sort((a, b) => b.rating - a.rating);

    el.innerHTML = `
      <div style="margin-bottom:16px">
        <h4 style="font-weight:700;color:var(--error-500);margin-bottom:12px;display:flex;align-items:center;gap:8px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${App.t('spam_alert')} - ${reported.length} reported reviews
        </h4>
        ${reported.map(r => {
          const farmer = getFarmerById(r.farmerId);
          return `
          <div class="review-card review-reported">
            <div class="review-card-header">
              <div class="review-card-author">
                <div class="review-avatar" style="background:var(--error-50);color:var(--error-600)">${r.consumerName.charAt(0)}</div>
                <div><strong>${r.consumerName}</strong> <span style="color:var(--neutral-400);font-size:0.8rem">${r.date}</span></div>
              </div>
              ${renderStars(r.rating, 12)}
            </div>
            <div class="review-card-body">${r.text}</div>
            <div style="font-size:0.8rem;color:var(--neutral-500);margin-top:4px">Farmer: ${farmer ? farmer.name : 'Unknown'}</div>
            <div style="margin-top:8px;display:flex;gap:8px">
              <button class="btn btn-danger btn-sm" onclick="this.parentElement.innerHTML='<span class=badge badge-error>Review Removed</span>'">Remove Review</button>
              <button class="btn btn-ghost btn-sm" onclick="this.parentElement.innerHTML='<span class=badge badge-success>Review Kept</span>'">Keep Review</button>
            </div>
          </div>`;
        }).join('')}
      </div>
      <h4 style="font-weight:700;margin-bottom:12px" data-i18n="reported_reviews">All Reviews</h4>
      ${allReviews.slice(0, 5).map(r => {
        const farmer = getFarmerById(r.farmerId);
        return `
        <div class="review-card" style="padding:12px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="review-avatar" style="width:28px;height:28px;font-size:0.7rem">${r.consumerName.charAt(0)}</div>
              <div><strong style="font-size:0.85rem">${r.consumerName}</strong> <span style="font-size:0.75rem;color:var(--neutral-400)">-> ${farmer ? farmer.name : 'Unknown'}</span></div>
            </div>
            ${renderStars(r.rating, 12)}
          </div>
          <p style="font-size:0.8rem;color:var(--neutral-600);margin-top:4px">${r.text.substring(0, 80)}...</p>
        </div>`;
      }).join('')}
    `;
  },

  renderTrustChart() {
    const chart = document.getElementById('trustChart');
    if (!chart) return;
    const farmers = ['Ram K.', 'Suresh P.', 'Mahesh Y.', 'Gopal V.', 'Lakshmi D.'];
    const scores = [95, 88, 62, 25, 20];
    const colors = ['#22c55e', '#22c55e', '#f59e0b', '#ef4444', '#ef4444'];
    chart.innerHTML = farmers.map((f, i) => `
      <div class="bar-item">
        <div class="bar" style="height:${scores[i]}%;background:${colors[i]}"></div>
        <span class="bar-label">${f}</span>
      </div>
    `).join('');
  },

  renderCharts() {
    const ordersChart = document.getElementById('ordersChart');
    if (ordersChart) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const values = [120, 180, 250, 320, 410];
      ordersChart.innerHTML = months.map((m, i) => `
        <div class="bar-item"><div class="bar" style="height:${(values[i] / 410) * 100}%;background:var(--primary-400)"></div><span class="bar-label">${m}</span></div>
      `).join('');
    }

    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const values = [2.1, 3.4, 4.8, 5.2, 6.1];
      revenueChart.innerHTML = months.map((m, i) => `
        <div class="bar-item"><div class="bar" style="height:${(values[i] / 6.1) * 100}%;background:var(--secondary-400)"></div><span class="bar-label">${m}</span></div>
      `).join('');
    }

    const categoryChart = document.getElementById('categoryChart');
    if (categoryChart) {
      const cats = ['Veg', 'Grains', 'Pulses', 'Fruits'];
      const vals = [45, 30, 15, 10];
      const colors = ['#22c55e', '#f59e0b', '#14b8a6', '#ef4444'];
      categoryChart.innerHTML = cats.map((c, i) => `
        <div class="bar-item"><div class="bar" style="height:${vals[i]}%;background:${colors[i]}"></div><span class="bar-label">${c}</span></div>
      `).join('');
    }

    const paymentChart = document.getElementById('paymentChart');
    if (paymentChart) {
      const methods = ['UPI', 'Wallet', 'COD', 'Bank'];
      const vals = [45, 25, 20, 10];
      const colors = ['#22c55e', '#14b8a6', '#f59e0b', '#0d9488'];
      paymentChart.innerHTML = methods.map((m, i) => `
        <div class="bar-item"><div class="bar" style="height:${vals[i]}%;background:${colors[i]}"></div><span class="bar-label">${m}</span></div>
      `).join('');
    }
  },

  renderOrders() {
    const el = document.getElementById('adminOrders');
    if (!el) return;
    el.innerHTML = DEMO_ORDERS.map(order => `
      <div class="order-card">
        <div class="order-card-header">
          <h4>${order.id}</h4>
          <span class="badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'in_transit' ? 'badge-warning' : 'badge-primary'}">${order.status.replace('_', ' ')}</span>
        </div>
        <div class="order-card-body">
          <span>${order.consumer} - ${order.crop} x ${order.quantity}kg</span>
          <span style="font-weight:700">₹${order.total}</span>
        </div>
        <div style="margin-top:8px;font-size:0.85rem;color:var(--neutral-500)">Farmer: ${order.farmer} | Payment: ${order.paymentMethod} | Date: ${order.date}</div>
      </div>
    `).join('');
  },

  renderDisputes() {
    const el = document.getElementById('disputesList');
    if (!el) return;
    const disputes = [
      { id: 'DSP001', consumer: 'Shyam', farmer: 'Ravi Singh', issue: 'Quality not as expected', status: 'open', date: '2026-05-06' },
      { id: 'DSP002', consumer: 'Priya', farmer: 'Ram Kumar', issue: 'Late delivery', status: 'investigating', date: '2026-05-05' }
    ];
    el.innerHTML = disputes.map(d => `
      <div class="verification-item">
        <div class="verification-info">
          <div class="verification-avatar" style="background:var(--warning-50);color:var(--warning-600)">!</div>
          <div>
            <div style="font-weight:600">${d.id} - ${d.issue}</div>
            <div style="font-size:0.85rem;color:var(--neutral-500)">Consumer: ${d.consumer} | Farmer: ${d.farmer} | ${d.date}</div>
          </div>
        </div>
        <span class="badge ${d.status === 'open' ? 'badge-error' : 'badge-warning'}">${d.status}</span>
      </div>
    `).join('');
  },

  animateCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter-animate').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            if (target) animateCounter(el, target);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stat-cards').forEach(s => observer.observe(s));
  },

  logout() { Session.clear(); window.location.href = 'index.html'; }
};

document.addEventListener('DOMContentLoaded', () => {
  Admin.init();
});
