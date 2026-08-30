# Prop Firm ROI Tracker 📊

Web app single-user untuk mencatat & memantau performa finansial akun-akun prop firm (Apex, Topstep, dll.) — tahu persis berapa modal keluar, berapa payout masuk, dan ROI aktual. Bukan cuma di kepala atau spreadsheet manual.

Akses gratis disini https://raditya-id.github.io/propfirm-roi-track/

## ✨ Fitur

- **Tambah Akun** — catat prop firm, ukuran, tanggal beli, harga eval, status, biaya aktivasi, ID akun custom, catatan strategi, batch add
- **Quick Status Update** — ganti status langsung dari daftar akun (Eval → Funded → Breach) tanpa buka form, histori perubahan tersimpan
- **Catat Payout** — gross, profit split auto-fill dari firm, net otomatis; satu akun bisa payout berkali-kali
- **Dashboard 10 KPI** — ROI%, Net P&L, Total Belanja, Total Payout, Pass Rate, Payout Rate, Breach Rate, Rata-rata Payout, Target tracker, jumlah akun
- **Pie Chart Allocation** — Spend & Payout allocation per prop firm, warna unik per slice
- **Cumulative Net P&L** — grafik tren untung/rugi sepanjang waktu
- **Breakdown per Prop Firm** — akun, lolos, payout, belanja, net, ROI% side-by-side
- **Aktivitas Terbaru** — feed kronologis payout & perubahan status
- **Akun Funded Aktif** — section khusus untuk update status cepat saat breach
- **Export/Import CSV** — backup manual, satu-satunya cara sinkron antar device

## 💾 Penyimpanan

- **100% client-side** — semua data tersimpan di `localStorage` browser
- Tanpa backend, tanpa server, tanpa database eksternal
- Data aman saat tab ditutup / di-refresh
- **Backup rutin via Export CSV** (menu Data) — karena data hanya ada di browser

## 🚀 Deploy

Build & upload folder `dist/`:

```bash
npm install
npm run build
```

- **GitHub Pages**: push folder `dist` ke branch `gh-pages`, lalu aktifkan di Settings → Pages
- **Netlify**: seret folder `dist` ke [app.netlify.com/drop](https://app.netlify.com/drop)
- Bisa juga di-hosting statis lain (Vercel, Cloudflare Pages, dll.)

## 🛠️ Tech Stack

- React 18 (Vite)
- Vanilla CSS — Liquid Glass / iOS 26 glassmorphism
- localStorage untuk persistensi
- Zero dependency chart — SVG murni

## 🎨 Desain

- Dark mode + gradient mesh background
- Frosted glass panels (blur, border semi-transparan, soft shadow)
- Spring-based animations (iOS style)
- Monospace untuk angka finansial
- Hijau = profit, merah = loss, signature accent ungu elektrik
- Responsive / mobile-friendly

---

*Dibuat untuk trader prop firm yang mau angka jujur, bukan perasaan.*
