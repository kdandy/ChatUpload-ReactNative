# UNDIPintar - Chat Mobile Application

Aplikasi chat mobile untuk Universitas Diponegoro yang dibangun menggunakan React Native dan Expo. Aplikasi ini mengintegrasikan Firebase untuk autentikasi dan penyimpanan data, Cloudinary untuk upload gambar, serta Google Gemini AI untuk fitur asisten cerdas.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Struktur Proyek](#struktur-proyek)
- [Penggunaan](#penggunaan)
- [Layanan](#layanan)
- [Troubleshooting](#troubleshooting)
- [Lisensi](#lisensi)

## Fitur

### Autentikasi
- Registrasi pengguna dengan username, password, dan nama lengkap
- Login menggunakan username dan password
- Penyimpanan token autentikasi menggunakan Expo SecureStore
- Validasi input untuk username (minimal 3 karakter, maksimal 20 karakter) dan password

### Chat Real-time
- Sinkronisasi pesan secara real-time melalui Firebase Firestore
- Tampilan chat bubble dengan indikator status pesan (sent, pending, failed)
- Format timestamp dalam bahasa Indonesia
- Avatar pengguna dengan inisial nama

### AI Assistant (UNDIPintar)
- Integrasi Google Gemini AI (model gemini-2.5-flash)
- Asisten virtual yang merespons semua pesan pengguna
- Konteks percakapan dengan history 5 pesan terakhir
- Konfigurasi temperature 0.7 untuk respons yang natural

### Upload Gambar
- Pilih gambar dari galeri atau ambil foto dari kamera
- Upload gambar ke Cloudinary dengan kualitas 0.8
- Retry mechanism hingga 3 kali jika upload gagal
- Timeout 30 detik untuk setiap request upload

### Mode Offline
- Penyimpanan history chat di AsyncStorage (maksimal 100 pesan terakhir)
- Queue pesan offline yang akan dikirim saat kembali online
- Monitoring status jaringan menggunakan NetInfo
- Sinkronisasi otomatis pesan offline saat koneksi tersedia

### Komponen UI
- Button dengan loading state
- Input field dengan validasi error
- Avatar dengan inisial nama pengguna
- Loading spinner
- Chat bubble dengan dukungan gambar dan teks

## Teknologi

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| Framework | React Native | 0.81.5 |
| Platform | Expo | 54.0.23 |
| Runtime | React | 19.1.0 |
| Backend | Firebase | 12.6.0 |
| AI | Google Generative AI | 0.24.1 |
| Navigasi | React Navigation | 6.x |
| HTTP Client | Axios | 1.7.9 |

### Dependencies Utama
- `@react-native-async-storage/async-storage` - Penyimpanan data lokal
- `@react-native-community/netinfo` - Monitoring status jaringan
- `expo-image-picker` - Pemilihan gambar dari galeri/kamera
- `expo-secure-store` - Penyimpanan data sensitif
- `expo-linear-gradient` - Komponen gradient

## Persyaratan Sistem

- Node.js versi 16 atau lebih tinggi
- npm atau yarn
- Expo Go app di perangkat mobile (untuk development)
- Akun Firebase dengan Firestore dan Authentication aktif
- Akun Cloudinary
- API Key Google Gemini (opsional, untuk fitur AI)

## Instalasi

```bash
# Clone repository
git clone https://github.com/kdandy/ChatUpload-ReactNative.git
cd ChatUpload-ReactNative

# Install dependencies
npm install

# Jalankan development server
npm start
```

### Menjalankan di Platform Spesifik

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Konfigurasi

### Environment Variables

Buat file `.env` di root proyek dengan konfigurasi berikut:

```env
PUBLIC_FIREBASE_API_KEY=AIzaSyAlgHOwt7uPxK1dVqlMl65OGFSGXkPpzbw
PUBLIC_FIREBASE_AUTH_DOMAIN=test-mobile-aad6e.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=test-mobile-aad6e
PUBLIC_FIREBASE_STORAGE_BUCKET=test-mobile-aad6e.firebasestorage.app
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=539074616267
PUBLIC_FIREBASE_APP_ID=1:539074616267:android:9a861d2586be354d72f44e

CLOUDINARY_NAME=dq5qalw24
CLOUDINARY_API_KEY=526624961284445
CLOUDINARY_API_SECRET=4ZykcxatJCdNV3E0_wfXNWyB8RE

GEMINI_API_KEY=AIzaSyAp_EHAdi-rBVwcu4Gsfj1budjYhvaGKBk
GEMINI_PROJECT_NAME=projects/98385919844
GEMINI_PROJECT_NUMBER=98385919844
```

### Firebase Setup

1. Buat project di Firebase Console
2. Aktifkan Firestore Database
3. Aktifkan Authentication dengan metode Email/Password
4. Salin konfigurasi Firebase ke file `.env`

### Cloudinary Setup

1. Buat akun di Cloudinary
2. Aktifkan unsigned upload di Settings > Upload
3. Gunakan upload preset `ml_default` atau buat preset baru
4. Salin credentials ke file `.env`

## Struktur Proyek

```
chat-mobile/
├── App.js                          # Entry point aplikasi
├── app.json                        # Konfigurasi Expo
├── package.json                    # Dependencies dan scripts
├── babel.config.js                 # Konfigurasi Babel
├── metro.config.js                 # Konfigurasi Metro bundler
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatBubble.js       # Komponen bubble chat
│   │   │   ├── ChatInput.js        # Input pesan dengan tombol kirim dan gambar
│   │   │   └── index.js
│   │   └── common/
│   │       ├── Avatar.js           # Avatar dengan inisial
│   │       ├── Button.js           # Button dengan loading state
│   │       ├── Input.js            # Input field
│   │       ├── SimpleInput.js      # Input field sederhana
│   │       ├── LoadingSpinner.js   # Indikator loading
│   │       └── index.js
│   ├── config/
│   │   └── firebase.js             # Inisialisasi Firebase
│   ├── constants/
│   │   └── theme.js                # Warna, ukuran, konfigurasi API
│   ├── navigation/
│   │   └── AppNavigator.js         # Konfigurasi navigasi
│   ├── screens/
│   │   ├── LoginScreen.js          # Halaman login dan registrasi
│   │   ├── ChatRoomScreen.js       # Halaman chat utama
│   │   └── TestInputScreen.js      # Halaman testing
│   ├── services/
│   │   ├── authService.js          # Logika autentikasi
│   │   ├── chatService.js          # Logika chat dan Firestore
│   │   ├── cloudinaryService.js    # Upload gambar ke Cloudinary
│   │   ├── geminiService.js        # Integrasi Google Gemini AI
│   │   ├── storageService.js       # Penyimpanan lokal
│   │   └── index.js
│   └── utils/
│       ├── helpers.js              # Fungsi utilitas (format timestamp, validasi)
│       ├── networkService.js       # Monitoring status jaringan
│       └── index.js
├── android/                        # Konfigurasi native Android
├── ios/                            # Konfigurasi native iOS
└── assets/                         # Asset statis
```

## Penggunaan

### Registrasi
1. Buka aplikasi
2. Tap link "Daftar" di bagian bawah form login
3. Isi nama lengkap, username, dan password
4. Tap tombol "Sign Up"

### Login
1. Masukkan username dan password
2. Tap tombol "Sign In"

### Mengirim Pesan
1. Ketik pesan di input field
2. Tap tombol kirim (ikon panah)
3. Pesan akan muncul di chat room

### Upload Gambar
1. Tap ikon gambar di sebelah kiri input field
2. Pilih "Kamera" untuk mengambil foto atau "Galeri" untuk memilih dari penyimpanan
3. Gambar akan diupload dan dikirim ke chat room

### Menggunakan AI Assistant
1. Kirim pesan apapun ke chat room
2. AI akan merespons secara otomatis
3. Respons AI ditandai dengan avatar UNDIPintar

## Layanan

### AuthService
Menangani autentikasi pengguna:
- `register(username, password, displayName)` - Registrasi pengguna baru
- `login(username, password)` - Login pengguna
- `logout()` - Logout pengguna
- `autoLogin()` - Login otomatis dengan token tersimpan

### ChatService
Menangani operasi chat:
- `sendMessage(messageData, retryCount)` - Kirim pesan dengan retry mechanism
- `subscribeToMessages(callback)` - Subscribe ke update pesan real-time
- `syncOfflineMessages()` - Sinkronisasi pesan offline
- `markAsRead(messageId)` - Tandai pesan sebagai dibaca

### CloudinaryService
Menangani upload gambar:
- `pickImage()` - Pilih gambar dari galeri
- `takePhoto()` - Ambil foto dari kamera
- `uploadImage(imageUri, retryCount)` - Upload gambar ke Cloudinary

### GeminiService
Menangani integrasi AI:
- `sendMessage(userMessage, conversationHistory)` - Kirim pesan ke Gemini AI
- `isAIQuestion(message)` - Cek apakah pesan perlu respons AI
- `isAvailable()` - Cek ketersediaan layanan AI

### StorageService
Menangani penyimpanan lokal:
- `saveUserToken(token)` / `getUserToken()` - Manajemen token
- `saveUserData(userData)` / `getUserData()` - Manajemen data pengguna
- `saveChatHistory(history)` / `getChatHistory()` - Manajemen history chat
- `addOfflineMessage(message)` / `getOfflineMessages()` - Manajemen pesan offline

### NetworkService
Menangani monitoring jaringan:
- `getNetworkStatus()` - Dapatkan status jaringan saat ini
- `isOnline()` - Cek apakah perangkat online
- `addListener(callback)` - Tambah listener untuk perubahan status

## Troubleshooting

### Firebase tidak terkonfigurasi
- Pastikan file `.env` berisi semua variabel Firebase yang diperlukan
- Restart development server setelah mengubah `.env`

### Pesan tidak terkirim
- Periksa koneksi internet
- Pesan akan masuk ke queue offline dan dikirim saat online

## Lisensi

MIT License
