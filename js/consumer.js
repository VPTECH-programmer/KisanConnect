/* KisanConnect - Consumer Marketplace Logic - Upgraded with Trust & Reviews */

const ConsumerApp = {
  user: null,
  currentFilter: 'all',
  favorites: [],
  reviewFarmerId: null,

  init() {
    this.user = Session.requireAuth(['consumer']);
    if (!this.user) return;

    const stored = localStorage.getItem('kc_favorites');
    this.favorites = stored ? JSON.parse(stored) : [];

    this.renderMarket();
    this.renderCart();
    this.renderOrders();
    this.renderFavorites();
    this.renderMarketplaceSections();
  },

  showSection(name) {
    document.querySelectorAll('[id^="section-"]').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById('section-' + name);
    if (section) section.classList.remove('hidden');

    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    const sectionMap = { market: 0, cart: 1, orders: 2, favorites: 3 };
    const links = document.querySelectorAll('.sidebar-nav a');
    if (sectionMap[name] !== undefined && links[sectionMap[name]]) {
      links[sectionMap[name]].classList.add('active');
    }

    if (name === 'cart') this.renderCart();
    if (name === 'favorites') this.renderFavorites();
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

  renderMarket() {
    const grid = document.getElementById('marketGrid');
    if (!grid) return;
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const crops = DEMO_CROPS.filter(c => {
      const matchFilter = this.currentFilter === 'all' || c.category === this.currentFilter;
      const matchSearch = c.name.toLowerCase().includes(search) || (c.nameHi && c.nameHi.includes(search));
      return matchFilter && matchSearch;
    });

    grid.innerHTML = crops.map(crop => {
      const farmer = getFarmerById(crop.farmerId);
      const rating = farmer ? farmer.rating : 0;
      const trustScore = farmer ? farmer.trustScore : 0;
      const isVerified = farmer && farmer.verificationStatus === 'approved';
      const limits = getPurchaseLimits(crop);

      return `
      <div class="crop-card">
        <div class="crop-card-img">
          ${CropSVGs[crop.image] || CropSVGs.potato}
          ${isVerified ? '<span class="badge badge-success" style="position:absolute;top:8px;right:8px"><svg viewBox="0 0 24 24" fill="#16a34a" width="12" height="12"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Verified</span>' : ''}
          <button onclick="ConsumerApp.toggleFavorite(${crop.id})" style="position:absolute;top:8px;left:8px;background:white;border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-sm)">
            <svg viewBox="0 0 24 24" fill="${this.favorites.includes(crop.id) ? '#ef4444' : 'none'}" stroke="${this.favorites.includes(crop.id) ? '#ef4444' : '#a3a3a3'}" stroke-width="2" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <div class="crop-card-body">
          <h4>${App.lang === 'hi' && crop.nameHi ? crop.nameHi : crop.name}</h4>
          <div class="crop-card-farmer" style="flex-wrap:wrap">
            <span style="display:flex;align-items:center;gap:4px;cursor:pointer" onclick="ConsumerApp.showFarmerProfile(${crop.farmerId})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${crop.farmer}
            </span>
            ${isVerified ? '<span class="verified-badge" style="font-size:0.7rem;padding:2px 8px"><svg viewBox="0 0 24 24" fill="#16a34a" width="12" height="12"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> ' + App.t('verified_farmer') + '</span>' : ''}
          </div>
          ${farmer ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.8rem">
            ${renderStars(rating, 12)} <span style="color:var(--neutral-500)">${rating} (${farmer.totalReviews})</span>
            ${renderTrustBar(trustScore, false)}
          </div>` : ''}
          <div class="crop-card-price">
            <span class="price">₹${crop.price}<span>/${App.lang === 'hi' ? 'किलो' : 'kg'}</span></span>
            <span class="badge badge-primary">Buy ${limits.min}-${limits.max} ${App.lang === 'hi' ? 'किलो' : 'kg'}</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="ConsumerApp.buyNow(${crop.id})" data-i18n="buy_now">Buy Now</button>
            <button class="btn btn-outline btn-sm" style="flex:1" onclick="ConsumerApp.addToCart(${crop.id})" data-i18n="add_to_cart">Add to Cart</button>
          </div>
        </div>
      </div>`;
    }).join('');

    if (crops.length === 0) {
      grid.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><h4>No crops found</h4><p>Try a different search or filter</p></div>';
    }
  },

  renderMarketplaceSections() {
    // Top Rated
    const topRated = document.getElementById('topRatedFarmers');
    if (topRated) {
      const farmers = [...DEMO_FARMERS].filter(f => f.verificationStatus === 'approved').sort((a, b) => b.rating - a.rating).slice(0, 4);
      topRated.innerHTML = farmers.map(f => this.renderFarmerCard(f)).join('');
    }

    // Most Trusted
    const mostTrusted = document.getElementById('mostTrustedFarmers');
    if (mostTrusted) {
      const farmers = [...DEMO_FARMERS].filter(f => f.verificationStatus === 'approved').sort((a, b) => b.trustScore - a.trustScore).slice(0, 4);
      mostTrusted.innerHTML = farmers.map(f => this.renderFarmerCard(f)).join('');
    }

    // Recently Verified
    const recentlyVerified = document.getElementById('recentlyVerifiedFarmers');
    if (recentlyVerified) {
      const farmers = DEMO_FARMERS.filter(f => f.verificationStatus === 'approved').slice(0, 4);
      recentlyVerified.innerHTML = farmers.map(f => this.renderFarmerCard(f)).join('');
    }
  },

  renderFarmerCard(farmer) {
    const isVerified = farmer.verificationStatus === 'approved';
    return `
      <div class="farmer-trust-card" style="width:220px;cursor:pointer" onclick="ConsumerApp.showFarmerProfile(${farmer.id})">
        <div class="farmer-trust-header">
          <div class="farmer-trust-avatar" style="background:${isVerified ? 'var(--primary-100)' : 'var(--neutral-100)'};color:${isVerified ? 'var(--primary-700)' : 'var(--neutral-500)'}">${farmer.avatar}</div>
          <div>
            <div style="font-weight:700;font-size:0.95rem">${App.lang === 'hi' && farmer.nameHi ? farmer.nameHi : farmer.name}</div>
            <div style="display:flex;align-items:center;gap:4px;font-size:0.8rem">
              ${renderStars(farmer.rating, 12)} <span style="color:var(--neutral-500)">${farmer.rating}</span>
            </div>
          </div>
          ${isVerified ? '<span class="badge badge-success" style="font-size:0.65rem;padding:2px 6px">Verified</span>' : ''}
        </div>
        ${renderTrustBar(farmer.trustScore)}
        <div style="margin-top:8px;font-size:0.75rem;color:var(--neutral-500)">${farmer.village}, ${farmer.district}</div>
      </div>
    `;
  },

  showFarmerProfile(farmerId) {
    const farmer = getFarmerById(farmerId);
    if (!farmer) return;

    const reviews = getFarmerReviews(farmerId);
    const isVerified = farmer.verificationStatus === 'approved';
    const el = document.getElementById('farmerProfileContent');

    el.innerHTML = `
      <div style="text-align:center;margin-bottom:24px">
        <div class="farmer-trust-avatar" style="width:64px;height:64px;font-size:1.4rem;margin:0 auto 12px;background:${isVerified ? 'var(--primary-100)' : 'var(--neutral-100)'};color:${isVerified ? 'var(--primary-700)' : 'var(--neutral-500)'}">${farmer.avatar}</div>
        <h3 style="font-size:1.3rem;font-weight:700">${App.lang === 'hi' && farmer.nameHi ? farmer.nameHi : farmer.name}</h3>
        <p style="color:var(--neutral-500);font-size:0.9rem">${farmer.village}, ${farmer.district}, ${farmer.state}</p>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px">
          ${isVerified ? '<span class="verified-badge"><svg viewBox="0 0 24 24" fill="#16a34a" width="14" height="14"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Verified Farmer</span>' : '<span class="badge badge-warning">Unverified</span>'}
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span style="font-size:2rem;font-weight:800">${farmer.rating}</span>
        <div>
          ${renderStars(farmer.rating, 18)}
          <p style="font-size:0.8rem;color:var(--neutral-500)">${farmer.totalReviews} reviews | ${farmer.totalOrders} orders</p>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-weight:600;font-size:0.85rem;margin-bottom:6px;display:block" data-i18n="trust_score">Trust Score</label>
        ${renderTrustBar(farmer.trustScore)}
      </div>

      <div class="farmer-trust-stats" style="margin-bottom:20px">
        <div class="farmer-trust-stat"><div class="value" style="color:var(--primary-600)">${farmer.deliverySuccessRate}%</div><div class="label">${App.t('delivery_success')}</div></div>
        <div class="farmer-trust-stat"><div class="value" style="color:var(--secondary-600)">${farmer.repeatCustomerPercent}%</div><div class="label">${App.t('repeat_customers')}</div></div>
        <div class="farmer-trust-stat"><div class="value" style="color:var(--accent-600)">${farmer.positiveReviewPercent}%</div><div class="label">${App.t('positive_reviews')}</div></div>
      </div>

      <h4 style="font-weight:700;margin-bottom:12px" data-i18n="reviews">Reviews</h4>
      ${reviews.length > 0 ? reviews.map(r => `
        <div class="review-card ${r.reported ? 'review-reported' : ''}">
          <div class="review-card-header">
            <div class="review-card-author">
              <div class="review-avatar">${r.consumerName.charAt(0)}</div>
              <div><strong>${r.consumerName}</strong> <span style="color:var(--neutral-400);font-size:0.8rem">${r.date}</span></div>
            </div>
            ${renderStars(r.rating, 12)}
          </div>
          <div class="review-card-body">${App.lang === 'hi' && r.textHi ? r.textHi : r.text}</div>
          <div class="review-card-ratings">
            <div class="review-rating-item">${App.t('product_quality')} ${renderMiniStars(r.quality)}</div>
            <div class="review-rating-item">${App.t('delivery_rating')} ${renderMiniStars(r.delivery)}</div>
            <div class="review-rating-item">${App.t('packaging_rating')} ${renderMiniStars(r.packaging)}</div>
            <div class="review-rating-item">${App.t('communication_rating')} ${renderMiniStars(r.communication)}</div>
          </div>
          <div class="review-helpful">
            <button onclick="this.textContent='👍 Helpful (' + (${r.helpful}+1) + ')'">${App.t('helpful')} (${r.helpful})</button>
            ${r.reported ? '<span class="badge badge-error" style="font-size:0.7rem">Reported</span>' : ''}
          </div>
        </div>
      `).join('') : '<p style="color:var(--neutral-400)">No reviews yet</p>'}

      <button class="btn btn-primary btn-block mt-16" onclick="ConsumerApp.openReviewModal(${farmerId})" data-i18n="write_review">Write a Review</button>
    `;

    document.getElementById('farmerProfileModal').classList.remove('hidden');
  },

  closeFarmerProfile() {
    document.getElementById('farmerProfileModal').classList.add('hidden');
  },

  openReviewModal(farmerId) {
    this.reviewFarmerId = farmerId;
    document.getElementById('farmerProfileModal').classList.add('hidden');
    document.getElementById('reviewModal').classList.remove('hidden');
    renderInteractiveStars('reviewOverallStars');
    renderInteractiveStars('reviewQualityStars');
    renderInteractiveStars('reviewDeliveryStars');
    renderInteractiveStars('reviewPackagingStars');
    renderInteractiveStars('reviewCommStars');
  },

  closeReviewModal() {
    document.getElementById('reviewModal').classList.add('hidden');
  },

  submitReview() {
    const overall = getStarRating('reviewOverallStars');
    const quality = getStarRating('reviewQualityStars');
    const delivery = getStarRating('reviewDeliveryStars');
    const packaging = getStarRating('reviewPackagingStars');
    const communication = getStarRating('reviewCommStars');
    const text = document.getElementById('reviewText').value.trim();

    if (overall === 0) {
      Toast.show('Please give a rating', 'error');
      return;
    }

    const newReview = {
      id: Date.now(), farmerId: this.reviewFarmerId, consumerName: this.user.name,
      rating: overall, date: new Date().toISOString().split('T')[0],
      text: text || 'Good experience', textHi: text || 'अच्छा अनुभव',
      quality, delivery, packaging, communication, reported: false, helpful: 0
    };
    DEMO_REVIEWS.push(newReview);

    this.closeReviewModal();
    Toast.show(App.t('review_submitted'), 'success');
    Voice.speakKey('review_submitted');
    document.getElementById('reviewText').value = '';
  },

  setFilter(filter) {
    this.currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    this.renderMarket();
  },

  filterCrops() { this.renderMarket(); },

  addToCart(cropId) {
    const crop = DEMO_CROPS.find(c => c.id === cropId);
    if (crop) {
      const limits = getPurchaseLimits(crop);
      Cart.add({ ...crop, minPurchase: limits.min, maxPurchase: limits.max, qty: limits.min });
    }
  },

  buyNow(cropId) {
    const crop = DEMO_CROPS.find(c => c.id === cropId);
    if (crop) {
      const limits = getPurchaseLimits(crop);
      Cart.add({ ...crop, minPurchase: limits.min, maxPurchase: limits.max, qty: limits.min });
      window.location.href = 'payment.html';
    }
  },

  toggleFavorite(cropId) {
    const idx = this.favorites.indexOf(cropId);
    if (idx > -1) this.favorites.splice(idx, 1);
    else this.favorites.push(cropId);
    localStorage.setItem('kc_favorites', JSON.stringify(this.favorites));
    this.renderMarket();
    this.renderFavorites();
  },

  renderCart() {
    const el = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (!el) return;

    const cart = Cart.get();
    if (cart.length === 0) {
      el.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="var(--neutral-300)" stroke-width="1.5" width="48" height="48"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.36-5.43H5.12"/></svg><h4>${App.t('cart_empty')}</h4></div>`;
      if (summary) summary.classList.add('hidden');
      return;
    }

    el.innerHTML = cart.map(item => `
      <div class="order-card">
        <div class="order-card-header">
          <h4>${App.lang === 'hi' && item.nameHi ? item.nameHi : item.name}</h4>
          <button class="btn btn-ghost btn-sm" onclick="Cart.remove(${item.id});ConsumerApp.renderCart()">Remove</button>
        </div>
        <div class="order-card-body">
          <span>₹${item.price} x ${item.qty || 1} ${App.lang === 'hi' ? 'किलो' : 'kg'}</span>
          <span style="font-weight:700">₹${item.price * (item.qty || 1)}</span>
        </div>
      </div>
    `).join('');

    if (summary) {
      summary.classList.remove('hidden');
      document.getElementById('cartTotal').textContent = '₹' + Cart.total();
    }
  },

  renderOrders() {
    const el = document.getElementById('consumerOrders');
    if (!el) return;
    const orders = DEMO_ORDERS.filter(o => o.consumerMobile === this.user.mobile);
    el.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-card-header">
          <h4>${order.id} - ${order.crop}</h4>
          <span class="badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'in_transit' ? 'badge-warning' : 'badge-primary'}">${order.status.replace('_', ' ')}</span>
        </div>
        <div class="order-card-body">
          <span>${order.quantity}kg @ ₹${order.price}/kg</span>
          <span style="font-weight:700">₹${order.total}</span>
        </div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <a href="tracking.html?order=${order.id}" class="btn btn-outline btn-sm" data-i18n="logistics">Track Order</a>
          ${order.status === 'delivered' ? `<button class="btn btn-ghost btn-sm" onclick="ConsumerApp.openReviewModal(${order.farmerId})" data-i18n="write_review">Review</button>` : ''}
        </div>
      </div>
    `).join('');

    if (orders.length === 0) {
      el.innerHTML = '<div class="empty-state"><h4>No orders yet</h4><p>Start shopping to see your orders here</p></div>';
    }
  },

  renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
    if (!grid) return;
    const favCrops = DEMO_CROPS.filter(c => this.favorites.includes(c.id));
    if (favCrops.length === 0) {
      grid.innerHTML = '<div class="empty-state"><h4>No favorites yet</h4><p>Heart crops you love to save them here</p></div>';
      return;
    }
    grid.innerHTML = favCrops.map(crop => `
      <div class="crop-card">
        <div class="crop-card-img">${CropSVGs[crop.image] || CropSVGs.potato}</div>
        <div class="crop-card-body">
          <h4>${App.lang === 'hi' && crop.nameHi ? crop.nameHi : crop.name}</h4>
          <div class="crop-card-price">
            <span class="price">₹${crop.price}<span>/kg</span></span>
            <span class="badge badge-primary">Buy ${getPurchaseLimits(crop).min}-${getPurchaseLimits(crop).max} kg</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="ConsumerApp.buyNow(${crop.id})">Buy Now</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  checkout() { window.location.href = 'payment.html'; },

  logout() { Session.clear(); window.location.href = 'index.html'; }
};

document.addEventListener('DOMContentLoaded', () => {
  ConsumerApp.init();
});
