/* KisanConnect - KYC Multi-Step Verification Logic */

const KYC = {
  currentStep: 1,
  data: { aadhaar: '', kisanId: '', khasra: '', village: '', district: '', state: '', docs: { aadhaar: false, land: false, photo: false } },

  init() {
    const user = Session.get();
    if (user && user.verificationStatus === 'approved') {
      document.querySelectorAll('.kyc-step-content').forEach(s => s.classList.add('hidden'));
      document.getElementById('kycSuccess').classList.remove('hidden');
      document.getElementById('kycSuccess').querySelector('h2').textContent = App.t('kyc_success');
      document.getElementById('kycSuccess').querySelector('p').textContent = 'You are already verified!';
      return;
    }

    // Populate states dropdown
    const stateSelect = document.getElementById('stateInput');
    if (stateSelect) {
      INDIAN_STATES.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        stateSelect.appendChild(opt);
      });
    }

    this.renderProgress();
  },

  renderProgress() {
    const container = document.getElementById('kycProgress');
    if (!container) return;

    const steps = KYC_STEPS;
    container.innerHTML = steps.map((step, i) => {
      const num = i + 1;
      const isActive = num === this.currentStep;
      const isCompleted = num < this.currentStep;
      const cls = isCompleted ? 'completed' : isActive ? 'active' : '';
      const title = App.lang === 'hi' ? step.titleHi : step.title;

      return `
        <div class="kyc-progress-step ${cls}">
          <div class="kyc-progress-dot">
            ${isCompleted ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>' : num}
          </div>
          <div class="kyc-progress-label">${title}</div>
        </div>
        ${i < steps.length - 1 ? `<div class="kyc-progress-line ${isCompleted ? 'completed' : ''}"></div>` : ''}
      `;
    }).join('');
  },

  goToStep(step) {
    this.currentStep = step;
    document.querySelectorAll('.kyc-step-content').forEach(s => s.classList.add('hidden'));
    const el = document.getElementById('kycStep' + step);
    if (el) el.classList.remove('hidden');
    this.renderProgress();

    if (step === 5) this.renderReviewSummary();
  },

  step1Action() {
    const aadhaar = document.getElementById('aadhaarInput').value.trim().replace(/\D/g, '');
    const otpSection = document.getElementById('aadhaarOtpSection');
    const btn = document.getElementById('step1Btn');

    if (!otpSection.classList.contains('hidden')) {
      // Verify OTP
      const digits = document.querySelectorAll('.kyc-otp-digit');
      const otp = Array.from(digits).map(d => d.value).join('');
      if (otp !== DEMO_OTP) {
        Toast.show(App.t('otp_invalid'), 'error');
        return;
      }
      this.data.aadhaar = aadhaar;
      Toast.show('Aadhaar verified!', 'success');
      Voice.speakKey('kyc_step2');
      this.goToStep(2);
      return;
    }

    if (aadhaar.length < 12) {
      Toast.show(App.t('aadhaar_placeholder'), 'error');
      return;
    }

    otpSection.classList.remove('hidden');
    btn.textContent = App.t('btn_verify_kyc');
    btn.setAttribute('data-i18n', 'btn_verify_kyc');
    Toast.show(App.t('aadhaar_otp_sent'), 'success');
    Voice.speakKey('aadhaar_otp_sent');
    document.querySelector('.kyc-otp-digit').focus();
  },

  otpNext(input, index) {
    input.value = input.value.replace(/\D/g, '');
    if (input.value && index < 5) {
      const inputs = document.querySelectorAll('.kyc-otp-digit');
      inputs[index + 1].focus();
    }
  },

  verifyKisanId() {
    const kisanId = document.getElementById('kisanIdInput').value.trim();
    if (!kisanId || kisanId.length < 5) {
      Toast.show('Please enter a valid Kisan ID', 'error');
      return;
    }

    this.data.kisanId = kisanId;
    const loader = document.getElementById('kisanFetchLoader');
    const result = document.getElementById('kisanFetchResult');
    loader.classList.remove('hidden');
    result.classList.add('hidden');

    setTimeout(() => {
      loader.classList.add('hidden');
      result.classList.remove('hidden');
      Toast.show('Kisan ID verified!', 'success');
    }, 2000);

    setTimeout(() => {
      this.goToStep(3);
    }, 3500);
  },

  verifyLandDetails() {
    const khasra = document.getElementById('khasraInput').value.trim();
    const village = document.getElementById('villageInput').value.trim();
    const district = document.getElementById('districtInput').value.trim();
    const state = document.getElementById('stateInput').value;

    if (!khasra || !village || !district || !state) {
      Toast.show('Please fill all land details', 'error');
      return;
    }

    this.data.khasra = khasra;
    this.data.village = village;
    this.data.district = district;
    this.data.state = state;
    Toast.show('Land details saved!', 'success');
    this.goToStep(4);
  },

  simulateUpload(zoneId) {
    const zone = document.getElementById(zoneId);
    if (!zone || zone.classList.contains('uploaded')) return;

    zone.classList.add('uploaded');
    const check = zone.querySelector('.upload-check');
    if (check) check.classList.remove('hidden');

    const key = zoneId === 'uploadAadhaar' ? 'aadhaar' : zoneId === 'uploadLand' ? 'land' : 'photo';
    this.data.docs[key] = true;
    Toast.show('Document uploaded (simulated)', 'success');
  },

  renderReviewSummary() {
    const el = document.getElementById('reviewSummary');
    if (!el) return;
    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.9rem">
        <div><span style="color:var(--neutral-500)">Aadhaar:</span><br><strong>${this.data.aadhaar || 'Not provided'}</strong></div>
        <div><span style="color:var(--neutral-500)">Kisan ID:</span><br><strong>${this.data.kisanId || 'Not provided'}</strong></div>
        <div><span style="color:var(--neutral-500)">Khasra:</span><br><strong>${this.data.khasra || 'Not provided'}</strong></div>
        <div><span style="color:var(--neutral-500)">Village:</span><br><strong>${this.data.village || 'Not provided'}</strong></div>
        <div><span style="color:var(--neutral-500)">District:</span><br><strong>${this.data.district || 'Not provided'}</strong></div>
        <div><span style="color:var(--neutral-500)">State:</span><br><strong>${this.data.state || 'Not provided'}</strong></div>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <span class="badge ${this.data.docs.aadhaar ? 'badge-success' : 'badge-error'}">Aadhaar: ${this.data.docs.aadhaar ? 'Uploaded' : 'Missing'}</span>
        <span class="badge ${this.data.docs.land ? 'badge-success' : 'badge-error'}">Land Proof: ${this.data.docs.land ? 'Uploaded' : 'Missing'}</span>
        <span class="badge ${this.data.docs.photo ? 'badge-success' : 'badge-error'}">Photo: ${this.data.docs.photo ? 'Uploaded' : 'Missing'}</span>
      </div>
    `;
  },

  submitVerification() {
    const user = Session.get();
    if (user) {
      user.verificationStatus = 'pending';
      user.kycVerified = false;
      Session.set(user);
    }

    document.querySelectorAll('.kyc-step-content').forEach(s => s.classList.add('hidden'));
    document.getElementById('kycSuccess').classList.remove('hidden');

    Toast.show(App.t('kyc_success'), 'success');
    Voice.speakKey('kyc_success');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  KYC.init();
});
