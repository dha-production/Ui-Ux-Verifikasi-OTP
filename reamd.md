# 🔐 SecureAuth UI - Template UI/UX Verifikasi OTP Modern & Responsive

Template antarmuka web (UI/UX) premium untuk alur **Verifikasi OTP (One-Time Password)** dengan desain *human-crafted* berestetika tinggi (tidak kaku seperti template AI generik), animasi interaktif yang dinamis untuk angka dan proses verifikasi, serta 100% responsif di seluruh perangkat (Mobile, Tablet, & Desktop).

Terinspirasi dari desain kelas atas Dribbble & Behance dengan sentuhan palet warna hangat (*Warm Amber & Coral* `#FF6E40`), tipografi modern (*Plus Jakarta Sans* & *Outfit*), serta *micro-interactions* yang sangat halus.

---

## ✨ Fitur Utama

- 📱 **3 Alur Layar Lengkap (Full 3-Step Flow):**
  1. **Layar 1 (Data Akun):** Input Email dengan tombol edit cepat, nomor telepon dengan prefix kode negara, serta pemilih kanal (Email / SMS/WhatsApp).
  2. **Layar 2 (Kode OTP):** 4 kotak input OTP interaktif dengan animasi ketuk angka, timer hitung mundur melingkar (*SVG radial countdown*), tombol kirim ulang kode dinamis, dan catatan keamanan enkripsi 256-bit.
  3. **Layar 3 (Sukses):** Animasi penarikan centang SVG (*stroke-dashoffset*), semburan konfeti (*canvas particles*), ringkasan status sesi, dan tombol navigasi ke dashboard.

- 🔢 **Animasi Angka & Proses Verifikasi yang Dinamis:**
  - **Digit Pop Effect:** Animasi skala pegas (*spring scale bounce*) saat setiap angka diketik.
  - **Auto-Advance & Smart Backspace:** Otomatis berpindah ke kotak berikutnya saat mengetik, dan mundur otomatis ke kotak sebelumnya saat menekan *Backspace*.
  - **Copy-Paste Support:** Pengguna dapat langsung menempelkan (*paste*) kode 4 digit dari SMS/Email ke dalam kotak mana saja.
  - **Error Shake Animation:** Animasi guncangan horizontal dengan aksen peringatan jika kode OTP tidak lengkap atau salah.
  - **State Loading Otentik:** Tombol *"Confirm"* berubah menjadi pemutar animasi (*spinner blade*) saat memproses verifikasi kriptografis.

- 🎛️ **3 Mode Tampilan Interaktif (Showcase Switcher):**
  - **Mobile Device Frame:** Tampilan mockup ponsel realistis lengkap dengan *notch speaker*, kamera, *status bar* (dengan jam digital otomatis), dan *home indicator*.
  - **3-Step Showcase:** Menampilkan ketiga layar sekaligus secara berdampingan (*side-by-side*) seperti pada portofolio Figma / Dribbble.
  - **Web Responsive:** Mode kartu modern yang responsif dan elegan untuk implementasi langsung pada web desktop maupun SaaS dashboard.

- 🔊 **Efek Suara Haptic (Web Audio API):**
  - Umpan balik suara klik halus saat mengetik angka dan tombol navigasi.
  - Melodi harmonis (*chord chime*) yang menyenangkan saat verifikasi berhasil.
  - Dapat diaktifkan / dinonaktifkan sewaktu-waktu melalui tombol audio di pojok kanan atas.

- 🌓 **Dark & Light Mode Toggle:**
  - Dilengkapi transisi tema gelap dan terang dengan penyimpanan otomatis ke `localStorage`.

- ⚡ **Zero Dependencies (Pure Vanilla):**
  - Dibuat murni dengan **HTML5**, **Vanilla CSS3**, dan **Vanilla JavaScript (ES6+)**. Tanpa dependensi berat, sangat ringan, cepat, dan mudah diintegrasikan ke proyek apa pun (Laravel, CodeIgniter, Node.js, React, Vue, dsb.).

---

## 📂 Struktur Direktori

```plaintext
Ui-Ux-Verifikasi-OTP/
│
├── index.html            # Halaman utama aplikasi & struktur tampilan
├── README.md             # Dokumentasi proyek & panduan penggunaan
│
├── css/
│   ├── style.css         # Desain sistem, variabel warna, layout, dan responsivitas
│   └── animations.css    # Animasi angka, efek loading, transisi step, dan centang SVG
│
└── js/
    ├── otp-input.js      # Controller logika input digit OTP, keyboard, & paste
    └── app.js            # Controller alur langkah, timer mundur, confetti, & audio
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Menjalankan Server Lokal (http://127.0.0.1:8000/)
Anda dapat menjalankan server lokal dengan salah satu cara berikut:
- **Cara Praktis:** Klik 2x file `serve.bat` pada folder ini (otomatis membuka server dan browser ke `http://127.0.0.1:8000/`).
- **Melalui Terminal / CMD / PowerShell:**
  ```bash
  php -S 127.0.0.1:8000
  ```
  Lalu buka tautan: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### 2. Menggunakan Laragon / XAMPP (Local Web Server)
1. Karena folder ini sudah berada di direktori Laragon:
   `E:\Source_Code_Projeck\Laragon\www\Conten-github\Ui-Ux-Verifikasi-OTP`
2. Buka aplikasi Laragon dan klik **Start All**.
3. Akses melalui browser di:
   `http://localhost/Conten-github/Ui-Ux-Verifikasi-OTP/`

### 3. Menggunakan VS Code Live Server / Double Click
- Cukup klik kanan `index.html` -> **Open with Live Server**, atau klik ganda langsung file `index.html`.

---

## 🧪 Kode Demo Percobaan

Untuk mencoba alur verifikasi dengan cepat:
- Masukkan kode OTP: **`8524`**
- Atau klik tombol **Auto-fill** pada banner notifikasi di bagian atas layar.

---

## 🔌 Panduan Integrasi Backend

Template ini memancarkan (*dispatches*) Custom Browser Event bernama `otp:verified` saat verifikasi berhasil. Anda dapat mendengarkan (*listen*) event ini untuk mengirim data ke API backend Anda:

```javascript
window.addEventListener('otp:verified', async (event) => {
  const { otpCode, email, phone, timestamp } = event.detail;

  console.log('OTP Siap Dikirim ke Server:', otpCode);

  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
      },
      body: JSON.stringify({
        code: otpCode,
        identifier: email || phone
      })
    });

    const result = await response.json();
    if (result.success) {
      // Alihkan pengguna ke dashboard utama
      window.location.href = '/dashboard';
    } else {
      alert(result.message || 'Kode OTP tidak valid');
    }
  } catch (error) {
    console.error('Gagal memverifikasi OTP:', error);
  }
});
```
# Menjalankan
php -S 127.0.0.1:8000
---

<div align="center">

## 👨💻 Developer

**👨💻 Developer:** Afdhal

**🏢 Organization:** DHA Production

---

## 🪪 Lisensi

MIT License

Copyright (c) 2020-2025 Afdhal & DHA Production

---

**⭐ Jika proyek ini membantu Anda, jangan lupa berikan Star! ⭐**  

Made with ❤️ by <a href="https://github.com/dhall-afdhal">Afdhal</a> | DHA Production

</div>
