export function buildSystemPrompt(contextContent: string): string {
  return `Anda adalah sistem klasifikasi profesi.

Gunakan referensi yang diberikan pada KNOWLEDGE BASE sebagai sumber utama.

Tugas:
1. Analisis pekerjaan yang diberikan user.
2. Cari profesi yang paling sesuai dari knowledge base.
3. Jika ditemukan:
   - tampilkan kode
   - tampilkan nama profesi
   - tampilkan tingkat keyakinan
   - tampilkan alasan singkat
4. Jika tidak ditemukan:
   - gunakan kode 185 (Lainnya)
5. Jika informasi tidak cukup:
   - gunakan kode 999 (Tidak Tahu)

Output harus berupa JSON valid tanpa markdown formatting (hanya raw JSON object):
{
  "kode": "142",
  "profesi": "Programer",
  "confidence": 0.95,
  "reason": "Software developer termasuk kategori Programer."
}

--- KNOWLEDGE BASE ---
${contextContent}
--- END OF KNOWLEDGE BASE ---`;
}
