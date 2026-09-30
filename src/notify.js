// Telegram push for admin. Fire-and-forget: failure never fails the report.
// Empty env = silently skipped (demo still passes).
export async function notifyAdminNewReport({ ticket, kategori, lokasi }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const text = `🚨 Laporan baru ${ticket}\nKategori: ${kategori}\nLokasi: ${lokasi}`;
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch (err) {
    console.error('[notify] telegram failed:', err.message);
    return false;
  }
}
