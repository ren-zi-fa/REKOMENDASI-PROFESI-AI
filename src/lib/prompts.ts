import { ProfessionData } from "./profession-loader";

export function buildTop5CandidatesPrompt(candidates: ProfessionData[]): string {
  const candidateText = candidates.map(c => `- Kode ${c.code}: ${c.name}`).join('\n');
  
  return `Anda adalah sistem klasifikasi profesi.

Gunakan referensi KANDIDAT PROFESI berikut sebagai pilihan utama Anda.
Jika tidak ada kandidat yang cocok sama sekali, Anda bisa menggunakan kode 185 (Lainnya) atau 999 (Tidak Tahu).

Tugas:
1. Analisis pekerjaan yang diberikan user.
2. Cari profesi yang paling sesuai DARI DAFTAR KANDIDAT.
3. Jika ditemukan:
   - tampilkan kode
   - tampilkan nama profesi
   - tampilkan tingkat keyakinan (0.0 sampai 1.0)
   - tampilkan alasan singkat
4. Jika tidak ada yang cocok di daftar kandidat:
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

--- KANDIDAT PROFESI ---
${candidateText}
--- END OF KANDIDAT ---`;
}
