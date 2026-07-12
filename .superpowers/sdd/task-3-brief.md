### Task 3: 全部样式（深色主题）

**Files:**
- Create: `style.css`

- [ ] **Step 1: 编写完整样式**

```css
/* ===== 全局重置 ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bg-primary: #0D1117;
  --bg-card: #1A1D24;
  --bg-card-hover: #22262E;
  --bg-input: #22262E;
  --border: #2D3139;
  --text-primary: #E5E7EB;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;
  --green: #22C55E;
  --red: #EF4444;
  --blue: #3B82F6;
  --blue-hover: #2563EB;
  --shadow: 0 2px 8px rgba(0,0,0,0.3);
  --radius: 8px;
  --radius-lg: 12px;
}
html, body { height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
}

/* ===== 顶部导航 ===== */
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 24px; background: var(--bg-card); border-bottom: 1px solid var(--border);
}
.logo { font-size: 20px; font-weight: 700; }
.header-status { font-size: 12px; color: var(--green); padding: 4px 12px; border-radius: 999px; background: rgba(34,197,94,0.1); }

/* ===== 行情滚动条 ===== */
.ticker-bar { overflow: hidden; background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 8px 0; }
.ticker-track { display: flex; gap: 24px; white-space: nowrap; animation: tickerScroll 30s linear infinite; }
.ticker-track:hover { animation-play-state: paused; }
@keyframes tickerScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ticker-item { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; padding: 0 8px; }
.ticker-symbol { font-weight: 600; color: var(--text-primary); }
.ticker-price { font-family: 'SF Mono', monospace; }
.ticker-change { font-weight: 500; }
.ticker-change.up { color: var(--green); }
.ticker-change.down { color: var(--red); }

/* ===== 主布局 ===== */
.main { display: flex; gap: 16px; padding: 16px 24px; height: calc(100vh - 120px); }
.chart-section { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.ai-section { width: 380px; display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; }

/* ===== 币种切换标签 ===== */
.coin-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.coin-tab {
  padding: 6px 16px; border-radius: 999px; background: var(--bg-card);
  border: 1px solid var(--border); color: var(--text-secondary);
  cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;
}
.coin-tab:hover { background: var(--bg-card-hover); }
.coin-tab.active { background: var(--blue); color: #fff; border-color: var(--blue); }
.coin-tab.add-tab { border-style: dashed; color: var(--text-muted); }

/* ===== 价格概览 ===== */
.price-overview { display: flex; align-items: baseline; gap: 16px; padding: 4px 0; }
.price-current { font-size: 32px; font-weight: 700; font-family: 'SF Mono', monospace; }
.price-change { font-size: 18px; font-weight: 600; }
.price-change.up { color: var(--green); }
.price-change.down { color: var(--red); }
.price-detail { font-size: 12px; color: var(--text-muted); }

/* ===== K 线图 ===== */
.chart-container { background: var(--bg-card); border-radius: var(--radius-lg); padding: 16px; border: 1px solid var(--border); flex: 1; min-height: 0; }
.chart-toolbar { display: flex; gap: 4px; margin-bottom: 12px; }
.interval-btn {
  padding: 4px 14px; border-radius: 4px; background: transparent;
  border: 1px solid var(--border); color: var(--text-secondary); cursor: pointer;
  font-size: 12px; transition: all 0.15s;
}
.interval-btn:hover { background: var(--bg-card-hover); }
.interval-btn.active { background: var(--blue); color: #fff; border-color: var(--blue); }
#chart { width: 100%; height: calc(100% - 40px); }

/* ===== 数据卡片 ===== */
.data-cards { display: flex; gap: 12px; flex-wrap: wrap; }
.data-card {
  flex: 1; min-width: 100px; background: var(--bg-card);
  border-radius: var(--radius); padding: 12px 16px;
  border: 1px solid var(--border);
}
.data-card-label { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; }
.data-card-value { font-size: 16px; font-weight: 600; font-family: 'SF Mono', monospace; }

/* ===== AI 区块 ===== */
.auto-report { background: var(--bg-card); border-radius: var(--radius-lg); padding: 16px; border: 1px solid var(--border); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-header h3 { font-size: 14px; font-weight: 600; }
.btn-sm {
  padding: 4px 12px; border-radius: 4px; border: 1px solid var(--border);
  background: transparent; color: var(--text-secondary); cursor: pointer;
  font-size: 12px; transition: all 0.15s;
}
.btn-sm:hover { background: var(--bg-card-hover); color: var(--text-primary); }
.report-item {
  padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px;
  display: flex; justify-content: space-between; align-items: center;
}
.report-item:last-child { border-bottom: none; }
.report-symbol { font-weight: 600; }
.report-summary { color: var(--text-secondary); font-size: 12px; }
.report-time { font-size: 11px; color: var(--text-muted); }

/* ===== AI 对话 ===== */
.ai-chat { flex: 1; background: var(--bg-card); border-radius: var(--radius-lg); display: flex; flex-direction: column; border: 1px solid var(--border); }
.chat-messages { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
.message { display: flex; gap: 10px; max-width: 100%; }
.message.user { flex-direction: row-reverse; }
.msg-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-input); font-size: 16px; flex-shrink: 0; }
.msg-content {
  padding: 10px 14px; border-radius: var(--radius); font-size: 13px;
  line-height: 1.6; max-width: 85%; word-break: break-word;
}
.message.ai .msg-content { background: var(--bg-input); }
.message.user .msg-content { background: var(--blue); color: #fff; }
.chat-input-area { padding: 12px 16px; border-top: 1px solid var(--border); }
.quick-questions { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
.quick-q {
  padding: 4px 12px; border-radius: 999px; background: var(--bg-input);
  color: var(--text-secondary); font-size: 12px; cursor: pointer;
  border: 1px solid var(--border); transition: all 0.15s;
}
.quick-q:hover { background: var(--bg-card-hover); color: var(--text-primary); }
.input-row { display: flex; gap: 8px; }
.input-row input {
  flex: 1; padding: 10px 14px; border-radius: var(--radius);
  border: 1px solid var(--border); background: var(--bg-input);
  color: var(--text-primary); font-size: 13px; outline: none;
}
.input-row input:focus { border-color: var(--blue); }
.input-row button {
  padding: 10px 20px; border-radius: var(--radius); border: none;
  background: var(--blue); color: #fff; cursor: pointer;
  font-size: 13px; font-weight: 500; transition: background 0.15s;
}
.input-row button:hover { background: var(--blue-hover); }
.input-row button:disabled { opacity: 0.5; cursor: not-allowed; }

/* ===== 底部设置 ===== */
.footer { padding: 16px 24px; background: var(--bg-card); border-top: 1px solid var(--border); }
.settings { display: flex; gap: 32px; flex-wrap: wrap; margin-bottom: 12px; }
.setting-item { display: flex; flex-direction: column; gap: 6px; }
.setting-item label { font-size: 12px; color: var(--text-muted); }
.input-group { display: flex; gap: 6px; }
.input-group input {
  padding: 8px 12px; border-radius: 4px; border: 1px solid var(--border);
  background: var(--bg-input); color: var(--text-primary); font-size: 12px; outline: none;
  width: 240px;
}
.input-group input:focus { border-color: var(--blue); }
.coin-list { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
.coin-tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 999px; background: var(--bg-input);
  border: 1px solid var(--border); font-size: 12px; color: var(--text-secondary);
}
.coin-tag .remove { cursor: pointer; font-size: 14px; color: var(--text-muted); }
.coin-tag .remove:hover { color: var(--red); }
.footer-note { font-size: 11px; color: var(--text-muted); text-align: center; }

/* ===== 加载动画 ===== */
.typing-dots { display: flex; gap: 4px; padding: 4px 0; }
.typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: typing 1.4s infinite both; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .main { flex-direction: column; height: auto; }
  .ai-section { width: 100%; }
  .chart-container { min-height: 400px; }
  .settings { flex-direction: column; gap: 16px; }
  .input-group input { width: 100%; }
}
```

- [ ] **Step 2: 提交**

```bash
git add style.css
git commit -m "feat: 深色主题完整样式"
```

---

