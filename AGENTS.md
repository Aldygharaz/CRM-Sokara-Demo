<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:dnd-kit-rule -->
## React Drag-and-Drop (dnd-kit) Rule
Setiap kali mengimplementasikan fitur Kanban Board atau List drag-and-drop menggunakan library `@dnd-kit`:
- **WAJIB** membungkus setiap wadah kolom (column container) dengan hook `useDroppable({ id: columnId })`.
- Jangan hanya mengandalkan `SortableContext` karena ia gagal mendeteksi kolom yang kosong (empty list drop target failure).
- Indikator area drop-zone (misal: garis putus-putus) harus ditambahkan sebagai fallback visual jika daftar item di dalam kolom bernilai 0.
<!-- END:dnd-kit-rule -->

<!-- BEGIN:currency-input-rule -->
## Currency/Financial Inputs (No-Spinner Rule)
Setiap kali membuat form input untuk nominal uang/finansial (terutama Rupiah):
- **JANGAN** gunakan `<input type="number">` bawaan browser. Tombol panah spinner (step=1) bawaan browser sama sekali tidak relevan dan sangat tidak berguna untuk nominal uang yang besar.
- **Gunakan** `<input type="text">` yang dikombinasikan dengan fungsi auto-formatting ribuan (misal `Intl.NumberFormat('id-ID')`) secara real-time saat user mengetik, lalu di-parse menggunakan Regex (menghilangkan non-digit).
- **WAJIB** sediakan tombol *Quick Preset Buttons* (contoh: `+ 10 Juta`, `+ 50 Juta`, `+ 100 Juta`) tepat di bawah input box. Hal ini akan mempercepat pengisian data (UX effort 3x lipat) bagi pengguna.
<!-- END:currency-input-rule -->
