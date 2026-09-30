// Client-side compress: HP photo 4-6MB -> <1MB before upload. Server 2MB is backstop.
document.getElementById('bukti')?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size <= 1024 * 1024) return; // already small
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((res) => canvas.convertToBlob
      ? canvas.convertToBlob((b) => res(b), 'image/jpeg', 0.8)
      : canvas.toBlob((b) => res(b), 'image/jpeg', 0.8));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
    e.target.files = dt.files;
    document.getElementById('compressNote').textContent = 'Foto dikompres otomatis agar cepat diupload.';
  } catch {
    document.getElementById('compressNote').textContent = 'Gagal kompres, file asli dikirim (maks 2MB).';
  }
});

document.getElementById('laporForm')?.addEventListener('submit', (e) => {
  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Mengirim…';
});
