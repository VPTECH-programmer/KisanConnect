/* KisanConnect - Authentication Logic */

const Auth = {
  mobile: '',
  role: '',

  init() {
    // Get role from URL params
    const params = new URLSearchParams(window.location.search);
    this.role = params.get('role') || '';

    // Pre-fill if returning
    const session = Session.get();
    if (session) {
      this.redirectByRole(session.role);
    }
  },

  sendOTP() {
    const input = document.getElementById('mobileInput');
    const mobile = input.value.trim();

    if (!/^\d{10}$/.test(mobile)) {
      Toast.show(App.t('mobile_invalid'), 'error');
      Voice.speakKey('mobile_invalid');
      return;
    }

    // Check if mobile exists in demo accounts
    const account = DEMO_ACCOUNTS[mobile];
    if (!account) {
      // Allow any number for demo, assign consumer role
      this.mobile = mobile;
      this.role = this.role || 'consumer';
    } else {
      this.mobile = mobile;
      this.role = this.role || account.role;
    }

    document.getElementById('mobileStep').classList.add('hidden');
    document.getElementById('otpStep').classList.remove('hidden');
    Toast.show(App.t('otp_sent'), 'success');
    Voice.speakKey('otp_sent');

    // Focus first OTP input
    document.querySelector('.otp-digit').focus();
  },

  otpNext(input, index) {
    // Only allow digits
    input.value = input.value.replace(/\D/g, '');
    if (input.value && index < 5) {
      const inputs = document.querySelectorAll('.otp-digit');
      inputs[index + 1].focus();
    }
  },

  verifyOTP() {
    const digits = document.querySelectorAll('.otp-digit');
    const otp = Array.from(digits).map(d => d.value).join('');

    if (otp !== DEMO_OTP) {
      Toast.show(App.t('otp_invalid'), 'error');
      Voice.speakKey('otp_invalid');
      return;
    }

    // Create session
    const account = DEMO_ACCOUNTS[this.mobile] || { name: 'User', role: this.role, kycVerified: false };
    const user = {
      mobile: this.mobile,
      name: account.name,
      role: account.role || this.role,
      kycVerified: account.kycVerified || false
    };

    Session.set(user);
    Toast.show('Login successful!', 'success');
    this.redirectByRole(user.role);
  },

  resendOTP() {
    Toast.show(App.t('otp_sent'), 'success');
    Voice.speakKey('otp_sent');
  },

  redirectByRole(role) {
    switch (role) {
      case 'farmer':
        window.location.href = 'farmer.html';
        break;
      case 'consumer':
        window.location.href = 'consumer.html';
        break;
      case 'admin':
        window.location.href = 'admin.html';
        break;
      default:
        window.location.href = 'index.html';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
