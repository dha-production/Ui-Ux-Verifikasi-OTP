/**
 * UI/UX VERIFIKASI OTP - MAIN APPLICATION CONTROLLER
 * Menangani alur langkah (steps), timer mundur, verifikasi animasi,
 * efek confetti, tema, dan mode tampilan showcase.
 * 
 * Developer: Afdhal | DHA Production
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentStep: 1,
    email: 'dscode@gmail.com',
    phone: '+44 99999999',
    channel: 'email',
    validDemoOtp: '8524',
    soundEnabled: true,
    theme: localStorage.getItem('otp_theme') || 'light',
    timerSeconds: 45,
    timerMax: 45,
    timerInterval: null,
    viewMode: 'mobile' // 'mobile' | 'flow' | 'responsive'
  };

  // DOM Elements References
  const mainWrapper = document.getElementById('mainWrapper');
  const viewportStage = document.getElementById('viewportStage');
  const phoneFrame = document.getElementById('phoneFrame');
  const screen1 = document.getElementById('screen1');
  const screen2 = document.getElementById('screen2');
  const screen3 = document.getElementById('screen3');

  // Inputs & Buttons
  const formStep1 = document.getElementById('formStep1');
  const inputEmail = document.getElementById('inputEmail');
  const inputPhone = document.getElementById('inputPhone');
  const editEmailBtn = document.getElementById('editEmailBtn');
  const btnSendOtp = document.getElementById('btnSendOtp');

  const btnBackTo1 = document.getElementById('btnBackTo1');
  const btnConfirmOtp = document.getElementById('btnConfirmOtp');
  const btnResendOtp = document.getElementById('btnResendOtp');
  const btnSuccessContinue = document.getElementById('btnSuccessContinue');
  const btnRestartFlow = document.getElementById('btnRestartFlow');
  const quickAutofillBtn = document.getElementById('quickAutofillBtn');

  // Stepper Elements
  const stepperFill = document.getElementById('stepperFill');
  const stepDots = [
    document.getElementById('stepDot1'),
    document.getElementById('stepDot2'),
    document.getElementById('stepDot3')
  ];

  // Display Elements
  const displayTargetChannel = document.getElementById('displayTargetChannel');
  const targetEmailDisplay = document.getElementById('targetEmailDisplay');
  const summaryMethod = document.getElementById('summaryMethod');
  const summaryTarget = document.getElementById('summaryTarget');
  const timerCircle = document.getElementById('timerCircle');
  const timerDigits = document.getElementById('timerDigits');
  const statusClock = document.getElementById('statusClock');

  // Mode & Action Buttons
  const viewMobileBtn = document.getElementById('viewMobileBtn');
  const viewFlowBtn = document.getElementById('viewFlowBtn');
  const viewResponsiveBtn = document.getElementById('viewResponsiveBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');

  // Channel Pills
  const channelPills = document.querySelectorAll('.channel-pill');

  // Initialize OTP Input Controller
  const otpController = new OtpInputController('#otpContainer', {
    length: 4,
    soundEnabled: state.soundEnabled,
    onComplete: (code) => {
      // Auto highlight confirm button when code complete
      btnConfirmOtp.classList.add('ready');
    },
    onChange: (code, isComplete) => {
      if (!isComplete) {
        btnConfirmOtp.classList.remove('ready');
      }
    }
  });

  // Audio Synthetic Synthesizer
  let audioCtx = null;
  function playAudioTone(type) {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      if (type === 'success') {
        // Melodi sukses harmonis C5 -> E5 -> G5 -> C6
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      // Browser policy ignore
    }
  }

  // Live Phone Clock
  function updateLiveClock() {
    if (!statusClock) return;
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    statusClock.textContent = `${hrs}:${mins}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  // Apply Theme
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('otp_theme', theme);

    const iconSun = themeToggleBtn.querySelector('.icon-sun');
    const iconMoon = themeToggleBtn.querySelector('.icon-moon');
    if (theme === 'dark') {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    } else {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    }
  }
  applyTheme(state.theme);

  themeToggleBtn.addEventListener('click', () => {
    playAudioTone('click');
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  // Sound Toggle
  soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    otpController.options.soundEnabled = state.soundEnabled;

    const soundOn = soundToggleBtn.querySelector('.sound-on');
    const soundOff = soundToggleBtn.querySelector('.sound-off');
    soundOn.style.display = state.soundEnabled ? 'block' : 'none';
    soundOff.style.display = state.soundEnabled ? 'none' : 'block';

    if (state.soundEnabled) playAudioTone('click');
  });

  // Channel Selection Pills
  channelPills.forEach(pill => {
    pill.addEventListener('click', () => {
      channelPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        state.channel = radio.value;
      }
      playAudioTone('click');
    });
  });

  // Stepper UI Update
  function updateStepperUI(step) {
    const percentages = { 1: '0%', 2: '50%', 3: '100%' };
    stepperFill.style.width = percentages[step];

    stepDots.forEach((dot, idx) => {
      const dotStep = idx + 1;
      dot.classList.remove('active', 'completed');
      if (dotStep === step) {
        dot.classList.add('active');
      } else if (dotStep < step) {
        dot.classList.add('completed');
      }
    });
  }

  // Step Navigation Animation
  function goToStep(targetStep, direction = 'forward') {
    if (targetStep === state.currentStep) return;

    playAudioTone('click');
    const screens = [screen1, screen2, screen3];
    const currentScreen = screens[state.currentStep - 1];
    const targetScreen = screens[targetStep - 1];

    // Out animation
    currentScreen.classList.remove('active', 'slide-in-right', 'slide-in-left');
    if (direction === 'forward') {
      currentScreen.classList.add('slide-out-left');
    } else {
      currentScreen.classList.add('slide-out-right');
    }

    setTimeout(() => {
      currentScreen.classList.remove('slide-out-left', 'slide-out-right');
      screens.forEach(s => s.classList.remove('active'));

      // In animation
      targetScreen.classList.add('active');
      if (direction === 'forward') {
        targetScreen.classList.add('slide-in-right');
      } else {
        targetScreen.classList.add('slide-in-left');
      }

      state.currentStep = targetStep;
      updateStepperUI(targetStep);

      // Actions when entering step
      if (targetStep === 2) {
        startOtpCountdown();
        setTimeout(() => {
          otpController.focusFirstEmpty();
        }, 300);
      } else if (targetStep === 3) {
        triggerSuccessCelebration();
      }
    }, 280);
  }

  // Stepper Dots Click Navigation
  stepDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const targetStep = idx + 1;
      const dir = targetStep > state.currentStep ? 'forward' : 'backward';
      goToStep(targetStep, dir);
    });
  });

  // Step 1: Submit Form -> Go to Step 2
  function handleSendOtp() {
    const emailVal = inputEmail.value.trim();
    const phoneVal = inputPhone.value.trim();

    if (!emailVal || !emailVal.includes('@')) {
      inputEmail.focus();
      return;
    }

    state.email = emailVal;
    state.phone = `+44 ${phoneVal}`;

    // Update Step 2 Labels
    if (state.channel === 'sms') {
      displayTargetChannel.textContent = 'phone number via SMS';
      targetEmailDisplay.textContent = state.phone;
      summaryMethod.textContent = 'SMS OTP (4 Digit)';
      summaryTarget.textContent = state.phone;
    } else {
      displayTargetChannel.textContent = 'email address';
      targetEmailDisplay.textContent = state.email;
      summaryMethod.textContent = 'Email OTP (4 Digit)';
      summaryTarget.textContent = state.email;
    }

    goToStep(2, 'forward');
  }

  btnSendOtp.addEventListener('click', (e) => {
    e.preventDefault();
    handleSendOtp();
  });

  formStep1.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendOtp();
  });

  editEmailBtn.addEventListener('click', () => {
    inputEmail.focus();
    inputEmail.select();
  });

  // Step 2: Back Button -> Go to Step 1
  btnBackTo1.addEventListener('click', () => {
    goToStep(1, 'backward');
  });

  // Step 2: Timer Countdown Controller
  function startOtpCountdown() {
    clearInterval(state.timerInterval);
    state.timerSeconds = state.timerMax;
    btnResendOtp.disabled = true;

    function renderTime() {
      const mins = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
      const secs = String(state.timerSeconds % 60).padStart(2, '0');
      timerDigits.textContent = `${mins}:${secs}`;
      timerDigits.classList.remove('ticking');
      void timerDigits.offsetWidth;
      timerDigits.classList.add('ticking');

      // Update circular SVG progress
      const percent = (state.timerSeconds / state.timerMax) * 100;
      timerCircle.setAttribute('stroke-dasharray', `${percent}, 100`);

      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        btnResendOtp.disabled = false;
        timerDigits.textContent = '00:00';
      } else {
        state.timerSeconds--;
      }
    }

    renderTime();
    state.timerInterval = setInterval(renderTime, 1000);
  }

  // Step 2: Resend Code Button
  btnResendOtp.addEventListener('click', () => {
    playAudioTone('click');
    otpController.clear();
    startOtpCountdown();

    // Show Notification Toast
    showToastFeedback('Kode OTP baru telah dikirimkan ke target Anda!');
  });

  // Toast feedback helper
  function showToastFeedback(msg) {
    const toast = document.getElementById('demoToast');
    const toastBody = toast.querySelector('.toast-body');
    const originalContent = toastBody.innerHTML;
    toastBody.innerHTML = `<strong>Terkirim!</strong> ${msg}`;
    toast.style.borderColor = 'var(--color-primary)';

    setTimeout(() => {
      toastBody.innerHTML = originalContent;
      toast.style.borderColor = 'var(--color-border)';
    }, 4000);
  }

  // Quick Autofill Demo Button
  quickAutofillBtn.addEventListener('click', () => {
    playAudioTone('click');
    otpController.setValue(state.validDemoOtp);
    if (state.currentStep !== 2) {
      goToStep(2, 'forward');
    }
  });

  // Step 2: Confirm OTP & Verification Process
  btnConfirmOtp.addEventListener('click', () => {
    const code = otpController.getValue();

    if (code.length < 4) {
      otpController.showError();
      return;
    }

    // Start Authentic Verification State Animation
    btnConfirmOtp.classList.add('is-loading');
    btnConfirmOtp.disabled = true;

    // Simulate Secure Verification Process (1.2 seconds)
    setTimeout(() => {
      btnConfirmOtp.classList.remove('is-loading');
      btnConfirmOtp.disabled = false;

      // Check OTP: Valid if matches demo code '8524' or valid 4 digits
      if (code === state.validDemoOtp || code === '8524' || code.length === 4) {
        // Dispatch Custom Event for Backend Integration
        const eventDetail = {
          otpCode: code,
          email: state.email,
          phone: state.phone,
          timestamp: new Date().toISOString()
        };
        window.dispatchEvent(new CustomEvent('otp:verified', { detail: eventDetail }));
        console.log('[SecureAuth UI] OTP Verified Successfully:', eventDetail);

        goToStep(3, 'forward');
      } else {
        otpController.showError();
      }
    }, 1100);
  });

  // Step 3: Success State & Confetti Celebration
  function triggerSuccessCelebration() {
    playAudioTone('success');
    createConfettiBurst();
  }

  btnSuccessContinue.addEventListener('click', () => {
    playAudioTone('click');
    alert('Selamat! Anda sekarang telah masuk ke dashboard akun Anda.');
  });

  btnRestartFlow.addEventListener('click', () => {
    otpController.clear();
    goToStep(1, 'backward');
  });

  // Confetti Particle System
  function createConfettiBurst() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const colors = ['#FF6E40', '#FFA07A', '#FF5722', '#FBBF24', '#34D399', '#38BDF8'];
    const particles = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.35,
        w: Math.random() * 8 + 5,
        h: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.7) * 9,
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frameId;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // Gravity
        p.vx *= 0.98; // Drag
        p.rotation += p.rSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        frameId = requestAnimationFrame(renderConfetti);
      } else {
        cancelAnimationFrame(frameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    renderConfetti();
  }

  // ==========================================================================
  // VIEW MODE SWITCHER (Mobile, 3-Step Showcase Flow, Responsive Web)
  // ==========================================================================
  function setViewMode(mode) {
    state.viewMode = mode;
    document.body.classList.remove('mode-mobile', 'mode-flow', 'mode-responsive');
    document.body.classList.add(`mode-${mode}`);

    // Update Segmented Control Buttons
    [viewMobileBtn, viewFlowBtn, viewResponsiveBtn].forEach(btn => {
      const isActive = btn.dataset.view === mode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const flowContainer = document.getElementById('flowContainer');

    if (mode === 'flow') {
      // Build 3-Screen Side-by-Side Showcase (like the prompt preview!)
      if (!flowContainer) {
        buildFlowShowcase();
      } else {
        flowContainer.style.display = 'flex';
      }
      phoneFrame.style.display = 'none';
    } else {
      if (flowContainer) {
        flowContainer.style.display = 'none';
      }
      phoneFrame.style.display = 'flex';
    }
  }

  function buildFlowShowcase() {
    const container = document.createElement('div');
    container.id = 'flowContainer';
    container.className = 'flow-showcase-container';

    // Step 1 Device Clone
    const d1 = document.createElement('div');
    d1.className = 'flow-card-device';
    d1.innerHTML = `
      <span class="flow-card-badge">Step 1: Input Data</span>
      ${screen1.innerHTML}
    `;

    // Step 2 Device Clone
    const d2 = document.createElement('div');
    d2.className = 'flow-card-device';
    d2.innerHTML = `
      <span class="flow-card-badge">Step 2: Masukkan OTP</span>
      ${screen2.innerHTML}
    `;

    // Step 3 Device Clone
    const d3 = document.createElement('div');
    d3.className = 'flow-card-device';
    d3.innerHTML = `
      <span class="flow-card-badge">Step 3: Terverifikasi Sukses</span>
      ${screen3.innerHTML}
    `;

    // Pastikan SVG checkmark tampil di d3
    const check = d3.querySelector('.checkmark-check');
    if (check) check.style.strokeDashoffset = '0';

    container.appendChild(d1);
    container.appendChild(d2);
    container.appendChild(d3);

    viewportStage.appendChild(container);
  }

  viewMobileBtn.addEventListener('click', () => setViewMode('mobile'));
  viewFlowBtn.addEventListener('click', () => setViewMode('flow'));
  viewResponsiveBtn.addEventListener('click', () => setViewMode('responsive'));

  // Ripple effect on all primary buttons
  document.querySelectorAll('.btn-primary-pill').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      const rect = this.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();

      this.appendChild(circle);
    });
  });

});
