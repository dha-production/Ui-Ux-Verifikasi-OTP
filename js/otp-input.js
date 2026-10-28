/**
 * UI/UX VERIFIKASI OTP - OTP INPUT CONTROLLER
 * Mengelola interaksi input digit OTP, keyboard navigation, copy-paste,
 * dan animasi pop angka.
 * 
 * Developer: Afdhal | DHA Production
 */

class OtpInputController {
  /**
   * @param {string} containerSelector - Selector container elemen input OTP
   * @param {Object} options - Pengaturan tambahan
   */
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.options = Object.assign({
      length: 4,
      onComplete: null,
      onChange: null,
      soundEnabled: true
    }, options);

    this.inputs = Array.from(this.container.querySelectorAll('.otp-digit'));
    this.wrappers = Array.from(this.container.querySelectorAll('.otp-box-wrapper'));
    this.audioCtx = null;

    this.init();
  }

  init() {
    this.inputs.forEach((input, index) => {
      // Input event untuk karakter angka
      input.addEventListener('input', (e) => this.handleInput(e, index));

      // Keydown untuk navigasi tombol panah & Backspace
      input.addEventListener('keydown', (e) => this.handleKeyDown(e, index));

      // Paste event untuk mendukung salin-tempel OTP
      input.addEventListener('paste', (e) => this.handlePaste(e, index));

      // Focus & blur untuk style wrapper
      input.addEventListener('focus', () => this.handleFocus(index));
      input.addEventListener('blur', () => this.handleBlur(index));

      // Klik otomatis menempatkan kursor di akhir
      input.addEventListener('click', () => {
        input.setSelectionRange(input.value.length, input.value.length);
      });
    });

    this.updateWrapperStates();
  }

  /**
   * Mengatur suara feedback haptic (Web Audio API synthesized)
   */
  playKeySound(type = 'tap') {
    if (!this.options.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (err) {
      // Audio context ditolak oleh browser policies sebelum gesture user
    }
  }

  handleInput(e, index) {
    const input = this.inputs[index];
    let val = input.value;

    // Filter hanya digit angka (0-9)
    val = val.replace(/\D/g, '');

    if (val.length > 0) {
      // Ambil digit terakhir jika ada multiple characters
      input.value = val.slice(-1);

      // Tambahkan animasi pop angka
      input.classList.remove('digit-pop');
      void input.offsetWidth; // Force reflow
      input.classList.add('digit-pop');

      this.playKeySound('tap');

      // Auto-advance ke input berikutnya
      if (index < this.inputs.length - 1) {
        this.inputs[index + 1].focus();
        this.inputs[index + 1].select();
      }
    } else {
      input.value = '';
    }

    this.updateWrapperStates();
    this.notifyChange();

    // Jika seluruh digit telah terisi, trigger onComplete
    if (this.isComplete()) {
      if (typeof this.options.onComplete === 'function') {
        this.options.onComplete(this.getValue());
      }
    }
  }

  handleKeyDown(e, index) {
    const input = this.inputs[index];

    // Tombol Backspace
    if (e.key === 'Backspace') {
      if (input.value === '') {
        // Jika kotak saat ini kosong, mundur ke kotak sebelumnya lalu hapus
        if (index > 0) {
          e.preventDefault();
          const prevInput = this.inputs[index - 1];
          prevInput.value = '';
          prevInput.focus();
          this.playKeySound('tap');
          this.updateWrapperStates();
          this.notifyChange();
        }
      } else {
        // Hapus nilai kotak saat ini
        input.value = '';
        this.playKeySound('tap');
        this.updateWrapperStates();
        this.notifyChange();
      }
    } 
    // Navigasi Panah Kiri
    else if (e.key === 'ArrowLeft') {
      if (index > 0) {
        e.preventDefault();
        this.inputs[index - 1].focus();
      }
    } 
    // Navigasi Panah Kanan
    else if (e.key === 'ArrowRight') {
      if (index < this.inputs.length - 1) {
        e.preventDefault();
        this.inputs[index + 1].focus();
      }
    }
  }

  handlePaste(e, startIndex) {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text').trim();

    // Ambil angka saja dari clipboard
    const digits = pastedText.replace(/\D/g, '').split('');

    if (digits.length === 0) return;

    let targetIdx = startIndex;
    for (let i = 0; i < digits.length && targetIdx < this.inputs.length; i++) {
      this.inputs[targetIdx].value = digits[i];
      this.inputs[targetIdx].classList.remove('digit-pop');
      void this.inputs[targetIdx].offsetWidth;
      this.inputs[targetIdx].classList.add('digit-pop');
      targetIdx++;
    }

    this.playKeySound('tap');

    // Fokus ke kotak setelah digit terakhir yang terisi atau kotak terakhir
    const focusIdx = Math.min(targetIdx, this.inputs.length - 1);
    this.inputs[focusIdx].focus();
    this.inputs[focusIdx].select();

    this.updateWrapperStates();
    this.notifyChange();

    if (this.isComplete() && typeof this.options.onComplete === 'function') {
      this.options.onComplete(this.getValue());
    }
  }

  handleFocus(index) {
    this.wrappers.forEach((wrapper, idx) => {
      wrapper.classList.toggle('active-border', idx === index);
    });
  }

  handleBlur(index) {
    this.wrappers[index]?.classList.remove('active-border');
    this.updateWrapperStates();
  }

  updateWrapperStates() {
    this.inputs.forEach((input, index) => {
      const wrapper = this.wrappers[index];
      if (!wrapper) return;

      const hasVal = input.value.trim().length > 0;
      wrapper.classList.toggle('has-value', hasVal);
      wrapper.classList.toggle('filled', hasVal);
    });
  }

  notifyChange() {
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(this.getValue(), this.isComplete());
    }
  }

  getValue() {
    return this.inputs.map(input => input.value).join('');
  }

  setValue(codeString) {
    const chars = String(codeString).replace(/\D/g, '').split('');
    this.inputs.forEach((input, idx) => {
      input.value = chars[idx] || '';
      if (chars[idx]) {
        input.classList.remove('digit-pop');
        void input.offsetWidth;
        input.classList.add('digit-pop');
      }
    });
    this.updateWrapperStates();
    this.notifyChange();

    // Fokus ke digit terakhir
    const lastFilled = Math.min(chars.length, this.inputs.length - 1);
    this.inputs[lastFilled]?.focus();
  }

  clear() {
    this.inputs.forEach(input => {
      input.value = '';
    });
    this.wrappers.forEach(w => {
      w.classList.remove('has-value', 'filled', 'error-state');
    });
    this.inputs[0]?.focus();
    this.notifyChange();
  }

  isComplete() {
    return this.inputs.every(input => input.value.trim().length === 1);
  }

  showError() {
    this.playKeySound('error');
    this.container.classList.remove('error-shake');
    void this.container.offsetWidth;
    this.container.classList.add('error-shake');

    this.wrappers.forEach(w => w.classList.add('error-state'));

    setTimeout(() => {
      this.wrappers.forEach(w => w.classList.remove('error-state'));
    }, 1800);
  }

  focusFirstEmpty() {
    const emptyIndex = this.inputs.findIndex(input => input.value.trim() === '');
    if (emptyIndex !== -1) {
      this.inputs[emptyIndex].focus();
    } else {
      this.inputs[this.inputs.length - 1].focus();
    }
  }
}

window.OtpInputController = OtpInputController;
