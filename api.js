// Dán URL Web App của Apps Script vào đây (kết thúc bằng /exec)
const API_URL = 'https://script.google.com/macros/s/AKfycbyqKd9iyKTr_CFUm8SuN_lNjl669a9j9pP_byKTmXWDThqCOKqIdksHsoE1-76xjw_P/exec';

// Lỗi mạng / Google trả trang lỗi thay vì JSON (Apps Script free thỉnh thoảng bị) — khác lỗi nghiệp vụ từ server
class NetError extends Error {}

async function call(action, body) {
  let txt;
  try {
    // text/plain để tránh CORS preflight — Apps Script không hỗ trợ OPTIONS
    const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action, ...body }) });
    txt = await res.text();
  } catch { throw new NetError('Mất kết nối mạng. Kiểm tra wifi/4G rồi thử lại.'); }
  let j;
  try { j = JSON.parse(txt); } catch { throw new NetError('Máy chủ Google đang bận. Thử lại sau vài giây.'); }
  if (!j.ok) throw new Error(j.error);
  return j.data;
}

// Chỉ tự thử lại các lệnh đọc; lệnh ghi (chấm công, sửa, xoá) thử lại có thể bị ghi 2 lần
const READS = ['board', 'names', 'admin_list'];
async function api(action, body = {}) {
  for (let i = 0; ; i++) {
    try { return await call(action, body); }
    catch (e) {
      if (!(e instanceof NetError) || !READS.includes(action) || i >= 2) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const initial = name => esc(String(name).trim().split(/\s+/).pop().slice(0, 2) || '?'); // Trang → Tr, Thảo → Th
// 4.25 → "4g15p"
const hm = h => { const m = Math.round((Number(h) || 0) * 60); return `${Math.floor(m / 60)}g${m % 60 ? String(m % 60).padStart(2, '0') + 'p' : ''}`; };
