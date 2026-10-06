// Dán URL Web App của Apps Script vào đây (kết thúc bằng /exec)
const API_URL = 'https://script.google.com/macros/s/AKfycbyqKd9iyKTr_CFUm8SuN_lNjl669a9j9pP_byKTmXWDThqCOKqIdksHsoE1-76xjw_P/exec';

async function api(action, body = {}) {
  // text/plain để tránh CORS preflight — Apps Script không hỗ trợ OPTIONS
  const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action, ...body }) });
  const j = await res.json();
  if (!j.ok) throw new Error(j.error);
  return j.data;
}

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const initial = name => esc(String(name).trim().split(/\s+/).pop().slice(0, 2) || '?'); // Trang → Tr, Thảo → Th
// 4.25 → "4g15p"
const hm = h => { const m = Math.round((Number(h) || 0) * 60); return `${Math.floor(m / 60)}g${m % 60 ? String(m % 60).padStart(2, '0') + 'p' : ''}`; };
