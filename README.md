# ProfesiAI - Klasifikasi Pekerjaan Utama

Aplikasi web fullstack modern untuk mengklasifikasi pekerjaan menjadi Kode Profesi standar sesuai referensi. Dibuat menggunakan Next.js App Router dan Anthropic Claude.

## Fitur Utama

- **Chat Interface Modern**: Antarmuka mirip ChatGPT dengan desain premium (Glassmorphism, Dark mode).
- **Streaming Response**: Jawaban dari AI muncul seketika secara real-time.
- **Context Retrieval**: Menggunakan referensi lokal `context.md` sebagai Knowledge Base untuk Claude.
- **Caching Cerdas**:
  - `Context Cache`: Memuat file `context.md` di memory (tidak dibaca setiap request).
  - `Response Cache`: Menyimpan hasil pencarian sebelumnya (TTL 24 jam) menggunakan LRU Cache untuk menghemat API Call.
- **Type Safety**: Output Claude divalidasi dan diurai (parsed) menjadi JSON untuk tampilan interaktif.

## Teknologi

- **Frontend**: Next.js 15, React 19, TailwindCSS v4, shadcn/ui, Framer Motion
- **Backend**: Next.js Route Handlers, Anthropic SDK
- **AI Model**: `claude-3-7-sonnet-latest` (pengganti sonnet 3.5/4.6 di sisi Anthropic)

## Persyaratan Sistem

- Node.js >= 20.x
- Kunci API Anthropic (`ANTHROPIC_API_KEY`)

## Cara Menjalankan

1. **Install Dependensi**
   \`\`\`bash
   npm install
   \`\`\`

2. **Pengaturan Environment**
   Salin file contoh ke `.env.local`:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   Edit `.env.local` dan masukkan API Key Anthropic Anda.

3. **Jalankan Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Buka \`http://localhost:3000\` dengan browser Anda.

## Arsitektur Berkas

- \`src/app/page.tsx\`: Antarmuka utama aplikasi (Chat UI)
- \`src/app/api/chat/route.ts\`: Endpoint backend untuk memproses pesan dan streaming Anthropic
- \`src/lib/anthropic.ts\`: Inisialisasi klien Anthropic
- \`src/lib/context-loader.ts\`: Pengelola cache untuk \`context.md\`
- \`src/lib/cache.ts\`: Setup LRU Cache untuk Response dan Prompt
- \`src/lib/prompts.ts\`: Pembuat System Prompt 
- \`src/types/index.ts\`: Skema Zod dan TypeScript types

## Keamanan

- **API Key** tidak pernah terekspos ke klien. Panggilan Anthropic murni berjalan di sisi Server (Route Handler).
- Validasi strict terhadap skema menggunakan TypeScript.
