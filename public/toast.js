// Toast: small top-right notification that fades automatically.
// Usage: toast('Laporan terkirim') or toast('Gagal', 'err').
function toast(msg, type = 'ok') {
  const box = document.getElementById('toasts');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'err' ? 'toast-err' : 'toast-ok');
  el.textContent = msg;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 350);
  }, 3200);
}
