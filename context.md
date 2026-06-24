# Referensi Kode Profesi / Pekerjaan Utama

Dokumen ini berisi referensi resmi kode profesi atau pekerjaan utama yang harus digunakan oleh AI saat melakukan klasifikasi pekerjaan.

## Aturan Penggunaan

1. Jika nama pekerjaan yang diberikan pengguna cocok dengan salah satu profesi dalam daftar, gunakan kode yang sesuai.
2. Jika pekerjaan tidak ditemukan secara eksplisit dalam daftar, pilih kode yang paling mendekati berdasarkan jenis pekerjaan.
3. Jika tidak ada kecocokan yang memadai, gunakan kode:
   - `185` = Lainnya
4. Gunakan kode:
   - `000` = Tidak Bekerja
   - `999` = Tidak Tahu
5. Kode harus dianggap sebagai referensi utama dalam proses klasifikasi pekerjaan.
6. Saat mengembalikan hasil, sertakan:
   - kode profesi
   - nama profesi resmi
   - alasan pemilihan (jika diperlukan)

## Format Output yang Direkomendasikan

```json
{
  "kode": "142",
  "profesi": "Programer"
}
```

## Daftar Kode Profesi

| Kode | Nama Profesi |
|------|--------------|
| 000 | Tidak Bekerja |
| 001 | Agen Tenaga Kerja |
| 002 | Ahli Sejarah dan Cagar budaya |
| 003 | Akuntan |
| 004 | Analis Keuangan |
| 005 | Anggota DPD |
| 006 | Anggota DPR RI/MPR RI |
| 007 | Anggota DPRD Provinsi/ Anggota DPRD Kabupaten/Kota |
| 008 | Apoteker |
| 009 | Arsiparis |
| 010 | Arsitek |
| 011 | Asisten Apoteker |
| 012 | Atase |
| 013 | Atlet/Olahragawan |
| 014 | Awak Kapal |
| 015 | Bhikkhu |
| 016 | Biarawan |
| 017 | Biarawati |
| 018 | Bidan |
| 019 | Broker/Pialang Saham |
| 020 | Bupati |
| 021 | Buruh Angkut Barang |
| 022 | Buruh Bangunan |
| 023 | Buruh Industri |
| 024 | Buruh Perikanan |
| 025 | Buruh Pertambangan |
| 026 | Buruh Pertanian/Kehutanan |
| 027 | Buruh Peternakan |
| 028 | Camat |
| 029 | Chef |
| 030 | Chief Executive Officer (CEO) |
| 031 | Dokter Gigi |
| 032 | Dokter Hewan |
| 033 | Dokter Spesialis |
| 034 | Dokter Umum |
| 035 | Dosen |
| 036 | Duta Besar |
| 037 | Empu Keris |
| 038 | Fotografer |
| 039 | Gembala |
| 040 | Gubernur |
| 041 | Guru |
| 042 | Hakim |
| 043 | Hakim Agung |
| 044 | Imam Masjid |
| 045 | Jaksa |
| 046 | Jaksa Agung |
| 047 | Jiaosheng |
| 048 | Juru Gambar Teknik/Drafter |
| 049 | Kameramen |
| 050 | Kapten Kapal |
| 051 | Kasir |
| 052 | Kepala Desa |
| 053 | Ketua Adat |
| 054 | Ketua Organisasi |
| 055 | Konsultan |
| 056 | Kreator Konten |
| 057 | Kurator |
| 058 | Kurir |
| 059 | Lurah |
| 060 | Makelar |
| 061 | Manajer |
| 062 | Masinis |
| 063 | Mekanik |
| 064 | Menteri/Kepala Badan (setingkat Menteri)/Wakil Menteri/Wakil Kepala Badan |
| 065 | Nakhoda |
| 066 | Nelayan |
| 067 | Notaris |
| 068 | Operator Layanan Pelanggan (Customer Service) |
| 069 | Operator Mesin |
| 070 | Pandita |
| 071 | Panitera Pengadilan |
| 072 | Paraji |
| 073 | Paranormal |
| 074 | Pastor |
| 075 | Pedagang |
| 076 | Pedagang Asongan/Keliling Makanan |
| 077 | Pedagang Asongan/Keliling Nonmakanan |
| 078 | Pedagang Online |
| 079 | PPPK |
| 080 | Pekerja Garmen/Konveksi |
| 081 | Pekerja Percetakan |
| 082 | Pekerja Profesional Penjualan |
| 083 | Pekerja Sosial |
| 084 | Pelaku Ekosistem Musik |
| 085 | Pelaku Ekosistem Perfilman |
| 086 | Pelaku Ekosistem Seni Pertunjukan |
| 087 | Pelaku Ekosistem Seni Rupa dan Kriya |
| 088 | Pelatih/Instruktur Olahraga |
| 089 | Pelayan Toko |
| 090 | Pembantu/Asisten Rumah Tangga |
| 091 | Pemberi Pinjaman |
| 092 | Pembuat Makanan/Juru Masak |
| 093 | Pembuat Minuman (Barista, Bartender, dll) |
| 094 | Pembuat Rokok/Cerutu/Tembakau Gulung |
| 095 | Pembuat Sepatu dan Tas |
| 096 | Pembudi Daya Ikan dan Biota Air Lainnya |
| 097 | Pemulung |
| 098 | Penagih Hutang (Debt Collector) |
| 099 | Penasihat Spiritual |
| 100 | Penata Busana |
| 101 | Penata Rambut |
| 102 | Penata Rias |
| 103 | Penata Suara |
| 104 | Pendeta |
| 105 | Peneliti |
| 106 | Penerjemah |
| 107 | Pengacara |
| 108 | Pengasuh Anak (Baby Sitter) |
| 109 | Pengelola Gedung/Properti |
| 110 | Pengemudi Ojek Online |
| 111 | Pengemudi Ojek Pangkalan |
| 112 | Pengepul |
| 113 | Penjaga Keamanan/Satpam |
| 114 | Penjahit |
| 115 | Penulis |
| 116 | Penyelenggara Acara (EO) |
| 117 | Penyiar Radio |
| 118 | Penyiar Televisi |
| 119 | Perajin Batu |
| 120 | Perajin Kayu, Bambu, dan Rattan |
| 121 | Perajin Kulit dan Tekstil |
| 122 | Perajin Logam |
| 123 | Perajin Perhiasan |
| 124 | Perajin Tembikar/Keramik |
| 125 | Peramal |
| 126 | Perancang Busana/Desainer |
| 127 | Perangkat Desa |
| 128 | Perawat |
| 129 | Petani/Pekebun/Petani Hutan |
| 130 | Peternak |
| 131 | Petugas Pemadam Kebakaran |
| 132 | Petugas SPBU |
| 133 | Pilot |
| 134 | Pinandita |
| 135 | PNS Fungsional Tertentu |
| 136 | PNS Fungsional Umum |
| 137 | PNS Struktural |
| 138 | Polisi |
| 139 | Pramugara/Pramugari |
| 140 | Pramusaji |
| 141 | Presiden |
| 142 | Programer |
| 143 | Psikiater |
| 144 | Psikolog |
| 145 | Pustakawan |
| 146 | Resepsionis |
| 147 | Sekretaris |
| 148 | Seniman/Artis |
| 149 | Sopir |
| 150 | Supervisor/Mandor |
| 151 | Tabib |
| 152 | Teknisi |
| 153 | Teller Bank |
| 154 | Tenaga Cuci |
| 155 | Tenaga Humas |
| 156 | Tenaga Kebersihan |
| 157 | Tenaga Tata Usaha |
| 158 | Tentara Nasional Indonesia (TNI) |
| 159 | Tukang Bangunan |
| 160 | Tukang Cat |
| 161 | Tukang Cukur |
| 162 | Tukang Fotokopi |
| 163 | Tukang Gigi |
| 164 | Tukang Kaca |
| 165 | Tukang Kayu |
| 166 | Tukang Kunci |
| 167 | Tukang Las/Pandai Besi |
| 168 | Tukang Listrik |
| 169 | Tukang Pijat |
| 170 | Tukang Pipa |
| 171 | Tukang Sablon |
| 172 | Tukang Sol Sepatu |
| 173 | Tukang Tambal Ban |
| 174 | Tukang Tebang Kayu |
| 175 | Uskup |
| 176 | Ustaz/Mubalig |
| 177 | Wakil Bupati |
| 178 | Wakil Gubernur |
| 179 | Wakil Presiden |
| 180 | Wakil Walikota |
| 181 | Walikota |
| 182 | Wartawan |
| 183 | Wenshi |
| 184 | Xueshi |
| 185 | Lainnya |
| 999 | Tidak Tahu |
```

## Contoh Pemetaan

| Input Pengguna | Kode | Profesi |
|----------------|-------|----------|
| Software Developer | 142 | Programer |
| Web Developer | 142 | Programer |
| Frontend Developer | 142 | Programer |
| Backend Developer | 142 | Programer |
| Fullstack Developer | 142 | Programer |
| Content Creator TikTok | 056 | Kreator Konten |
| Barista | 093 | Pembuat Minuman |
| Pemilik Toko Kelontong | 075 | Pedagang |
| Driver Gojek | 110 | Pengemudi Ojek Online |
| Guru SD | 041 | Guru |
| Dosen Universitas | 035 | Dosen |

