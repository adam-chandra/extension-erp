# Docker Setup untuk fe-extension-erp

## Daftar File yang Dibuat

1. **Dockerfile** - Multi-stage Dockerfile untuk build dan production
2. **.dockerignore** - File untuk mengabaikan file yang tidak perlu di build
3. **docker-compose.yml** - Docker Compose configuration untuk kemudahan setup
4. **.env.docker** - Environment template untuk Docker

## Cara Menggunakan

### Option 1: Menggunakan Docker Compose (Recommended)

```bash
# Build dan jalankan container
docker-compose up --build

# atau untuk background
docker-compose up -d --build

# Stop container
docker-compose down
```

Aplikasi akan dapat diakses di: `http://localhost:3000`

### Option 2: Menggunakan Docker (Manual)

```bash
# Build image
docker build -t fe-extension-erp .

# Jalankan container
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=http://localhost:8080/api \
  fe-extension-erp

# atau dengan environment file
docker run -p 3000:3000 \
  --env-file .env.docker \
  fe-extension-erp
```

## Keterangan Dockerfile

### Stage 1: Builder
- Menggunakan `node:20-alpine` (lebih ringan)
- Install dependencies (production + development)
- Build project dengan: `npm run build`
- Output di folder `dist/`

### Stage 2: Production
- Menggunakan image yang lebih ringan
- Menggunakan `serve` untuk melayani static files
- Menjalankan aplikasi di port 3000
- Includes health check untuk monitoring

## Environment Variables

Konfigurasi API base URL dapat diubah melalui:

```bash
docker-compose run -e VITE_API_BASE_URL=http://api.example.com/api fe-extension-erp
```

atau edit di `.env.docker`:

```env
VITE_API_BASE_URL=http://api.extension-erp.local:8080/api
```

## Build Size Optimization

Multi-stage build memastikan:
- ✅ Hanya production dependencies di final image
- ✅ Build tools tidak included di production image
- ✅ Ukuran image lebih kecil (~200-300MB)

## Troubleshooting

### Container tidak jalan
```bash
# Check logs
docker-compose logs fe-extension-erp

# Rebuild
docker-compose up --build
```

### Port 3000 sudah digunakan
```bash
# Ubah port di docker-compose.yml
# Ubah "3000:3000" menjadi "3001:3000"
```

### Health check gagal
```bash
# Container masih starting, tunggu beberapa detik
docker-compose ps
```

## Production Recommendations

Untuk production, pertimbangkan:

1. Gunakan reverse proxy (Nginx) di depan aplikasi
2. Set proper resource limits
3. Gunakan environment-specific config
4. Implement proper logging dan monitoring
5. Consider using docker secrets untuk sensitive data

## Next Steps

1. Jalankan: `docker-compose up --build`
2. Akses aplikasi: `http://localhost:3000`
3. Sesuaikan API_BASE_URL sesuai kebutuhan
