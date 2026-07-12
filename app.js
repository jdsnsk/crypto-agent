// ===== 配置 =====
const DEFAULT_COINS = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX']
const INTERVALS = { '15m': '15m', '1h': '1h', '4h': '4h', '1d': '1d' }

let state = {
  coins: [...DEFAULT_COINS],
  currentCoin: 'BTC',
  interval: '1h',
  prices: {},
  chart: null,
  candleSeries: null,
  apiKey: ''
}

// ===== DOM 引用 =====
const $ = id => document.getElementById(id)
const tickerTrack = $('tickerTrack')
const coinTabs = $('coinTabs')
const priceOverview = $('priceOverview')
const chartContainer = $('chart')
const dataCards = $('dataCards')
const chatMessages = $('chatMessages')
const chatInput = $('chatInput')
const sendBtn = $('sendBtn')
const apiKeyInput = $('apiKeyInput')
const saveKeyBtn = $('saveKeyBtn')
const addCoinInput = $('addCoinInput')
const addCoinBtn = $('addCoinBtn')
const coinList = $('coinList')
const reportList = $('reportList')
const refreshReport = $('refreshReport')
const quickQuestions = $('quickQuestions')

// ===== 工具函数 =====
function formatPrice(price) {
  const n = parseFloat(price)
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return n.toFixed(6)
}

function formatPercent(p) {
  const n = parseFloat(p)
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
}

function getChangeClass(percent) {
  return parseFloat(percent) >= 0 ? 'up' : 'down'
}

// ===== 币安 API 调用 =====
async function fetch24hTickers() {
  const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=' +
    JSON.stringify(state.coins.map(c => c + 'USDT')))
  return res.json()
}

async function fetchKlines(symbol, interval, limit = 200) {
  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`)
  return res.json()
}

async function fetchPrice(symbol) {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`)
  return res.json()
}

// ===== 顶部行情栏 =====
function renderTicker(dataArray) {
  // 双倍数据实现无缝滚动
  const items = [...dataArray, ...dataArray].map(d => `
    <div class="ticker-item">
      <span class="ticker-symbol">${d.symbol.replace('USDT', '')}</span>
      <span class="ticker-price">$${formatPrice(d.lastPrice)}</span>
      <span class="ticker-change ${getChangeClass(d.priceChangePercent)}">${formatPercent(d.priceChangePercent)}</span>
    </div>
  `).join('')
  tickerTrack.innerHTML = items
}

// ===== 币种标签 =====
function renderCoinTabs() {
  let html = state.coins.map(c => `
    <div class="coin-tab ${c === state.currentCoin ? 'active' : ''}" data-coin="${c}">${c}/USDT</div>
  `).join('')
  html += `<div class="coin-tab add-tab" id="showAddCoin">+ 添加</div>`
  coinTabs.innerHTML = html

  coinTabs.querySelectorAll('.coin-tab[data-coin]').forEach(el => {
    el.addEventListener('click', () => switchCoin(el.dataset.coin))
  })
  const addBtn = coinTabs.querySelector('#showAddCoin')
  if (addBtn) addBtn.addEventListener('click', () => addCoinInput.focus())
}

// ===== 价格概览 =====
function renderPriceOverview(data) {
  const change = parseFloat(data.priceChangePercent)
  priceOverview.innerHTML = `
    <span class="price-current">$${formatPrice(data.lastPrice)}</span>
    <span class="price-change ${getChangeClass(data.priceChangePercent)}">${formatPercent(data.priceChangePercent)}</span>
    <span class="price-detail">高 $${formatPrice(data.highPrice)} / 低 $${formatPrice(data.lowPrice)}</span>
  `
}

// ===== K 线图 =====
function initChart() {
  if (state.chart) {
    state.chart.remove()
  }
  state.chart = LightweightCharts.createChart(chartContainer, {
    layout: {
      background: { color: '#1A1D24' },
      textColor: '#9CA3AF',
    },
    grid: {
      vertLines: { color: '#2D3139' },
      horzLines: { color: '#2D3139' },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
      borderColor: '#2D3139',
    },
    timeScale: {
      borderColor: '#2D3139',
      timeVisible: true,
    },
  })

  state.candleSeries = state.chart.addCandlestickSeries({
    upColor: '#22C55E',
    downColor: '#EF4444',
    borderDownColor: '#EF4444',
    borderUpColor: '#22C55E',
    wickDownColor: '#EF4444',
    wickUpColor: '#22C55E',
  })

  state.chart.timeScale().fitContent()
}

async function loadChartData() {
  if (!state.candleSeries) initChart()
  const data = await fetchKlines(state.currentCoin, state.interval)
  const chartData = data.map(k => ({
    time: Math.floor(k[0] / 1000),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
  }))
  state.candleSeries.setData(chartData)
  state.chart.timeScale().fitContent()
}

// ===== 数据卡片 =====
function renderDataCards(d) {
  dataCards.innerHTML = `
    <div class="data-card">
      <div class="data-card-label">24h 最高</div>
      <div class="data-card-value">$${formatPrice(d.highPrice)}</div>
    </div>
    <div class="data-card">
      <div class="data-card-label">24h 最低</div>
      <div class="data-card-value">$${formatPrice(d.lowPrice)}</div>
    </div>
    <div class="data-card">
      <div class="data-card-label">24h 成交量</div>
      <div class="data-card-value">${(parseFloat(d.volume) / 1000000).toFixed(2)}M</div>
    </div>
    <div class="data-card">
      <div class="data-card-label">24h 成交额</div>
      <div class="data-card-value">$${(parseFloat(d.quoteVolume) / 1000000000).toFixed(2)}B</div>
    </div>
  `
}

// ===== 自选币种管理 =====
function renderCoinList() {
  coinList.innerHTML = state.coins.map(c => `
    <span class="coin-tag">
      ${c}
      <span class="remove" data-coin="${c}">×</span>
    </span>
  `).join('')
  coinList.querySelectorAll('.remove').forEach(el => {
    el.addEventListener('click', () => removeCoin(el.dataset.coin))
  })
  saveState()
}

function addCoin(name) {
  const upper = name.toUpperCase()
  if (state.coins.includes(upper)) return
  state.coins.push(upper)
  renderCoinList()
  renderCoinTabs()
  switchCoin(upper)
}

function removeCoin(name) {
  if (state.coins.length <= 1) return
  state.coins = state.coins.filter(c => c !== name)
  if (state.currentCoin === name) {
    switchCoin(state.coins[0])
  }
  renderCoinList()
  renderCoinTabs()
  saveState()
}

// ===== 状态持久化 =====
function saveState() {
  try {
    localStorage.setItem('crypto_coins', JSON.stringify(state.coins))
  } catch (e) {}
}

function loadState() {
  try {
    const saved = localStorage.getItem('crypto_coins')
    if (saved) state.coins = JSON.parse(saved)
    const savedKey = localStorage.getItem('crypto_api_key')
    if (savedKey) { state.apiKey = savedKey; apiKeyInput.value = savedKey }
  } catch (e) {}
}

// ===== 切换币种 =====
async function switchCoin(coin) {
  state.currentCoin = coin
  renderCoinTabs()
  await refreshPriceData()
}

async function refreshPriceData() {
  try {
    const tickers = await fetch24hTickers()
    const myData = tickers.find(t => t.symbol === state.currentCoin + 'USDT')
    if (myData) {
      renderPriceOverview(myData)
      renderDataCards(myData)
    }
    renderTicker(tickers)
    await loadChartData()
  } catch (e) {
    console.error('refresh error:', e)
  }
}

// ===== 定时刷新 =====
let tickerInterval

function startTicker() {
  tickerInterval = setInterval(async () => {
    try {
      const tickers = await fetch24hTickers()
      renderTicker(tickers)
    } catch (e) {}
  }, 30000)
}

// ===== 周期切换 =====
function setupIntervalButtons() {
  document.querySelectorAll('.interval-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.interval-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.interval = btn.dataset.interval
      await loadChartData()
    })
  })
}

// ===== AI 对话 =====
function addMessage(role, content, isTyping = false) {
  const div = document.createElement('div')
  div.className = `message ${role}`
  if (isTyping) {
    div.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    `
  } else {
    div.innerHTML = `
      <div class="msg-avatar">${role === 'ai' ? '🤖' : '👤'}</div>
      <div class="msg-content">${content.replace(/\n/g, '<br>')}</div>
    `
  }
  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
  return div
}

async function sendMessage(question) {
  if (!question.trim() || !state.apiKey) {
    if (!state.apiKey) addMessage('ai', '⚠️ 请先在底部设置 DeepSeek API Key')
    return
  }

  addMessage('user', question)
  chatInput.value = ''
  sendBtn.disabled = true

  const typingMsg = addMessage('ai', '', true)

  try {
    // 获取当前行情数据
    const priceRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${state.currentCoin}USDT`)
    const priceData = await priceRes.json()
    const klineRes = await fetchKlines(state.currentCoin, '1h', 48)
    const recentKlines = klineRes.slice(-5).map(k => ({
      time: new Date(k[0]).toLocaleString(), open: k[1], high: k[2], low: k[3], close: k[4], vol: k[5]
    }))

    // 调用 DeepSeek API（直接从前端调用）
    const marketData =
`## 当前行情数据
- 币种: ${state.currentCoin}/USDT
- 当前价格: $${parseFloat(priceData.lastPrice).toLocaleString()}
- 24h涨跌: ${parseFloat(priceData.priceChangePercent) >= 0 ? '+' : ''}${parseFloat(priceData.priceChangePercent).toFixed(2)}%
- 24h最高: $${parseFloat(priceData.highPrice).toLocaleString()}
- 24h最低: $${parseFloat(priceData.lowPrice).toLocaleString()}
${recentKlines.length ? '\n最近5根K线(1h):\n' + recentKlines.map(k => '- ' + k.time + ' O:' + k.open + ' H:' + k.high + ' L:' + k.low + ' C:' + k.close).join('\n') : ''}`

    const systemPrompt = `你是一个专业的加密货币分析师。请基于实时数据进行专业分析。

## 分析框架
1. **短期趋势判断** — 当前处于上涨/下跌/震荡？关键信号是什么？
2. **关键价位** — 最近的支撑位和阻力位在哪？
3. **风险提示** — 当前市场有哪些需要注意的风险？
4. **操作建议** — 基于分析的参考建议（仅供参考，不构成投资建议）

## 要求
- 分析要具体，给出明确的价位参考
- 保持客观，不夸大收益
- 提示风险
- 回复用中文，简洁专业
- 格式用 markdown，适当使用粗体`

const corsProxy = 'https://api.allorigins.win/raw?url='
// ...
    const aiRes = await fetch(corsProxy + encodeURIComponent('https://api.deepseek.com/chat/completions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: marketData + '\n\n用户问题：' + question + '\n\n请按分析框架给出详细分析。' }
        ]
      })
    })
    const aiData = await aiRes.json()
    if (!aiRes.ok) {
      typingMsg.remove()
      addMessage('ai', '⚠️ API 错误: ' + (aiData.error?.message || JSON.stringify(aiData)))
    } else {
      typingMsg.remove()
      addMessage('ai', aiData.choices[0].message.content)
    }
  } catch (e) {
    typingMsg.remove()
    console.error('sendMessage error:', e)
    addMessage('ai', '⚠️ 请求失败: ' + e.message + '。请检查控制台获取详情。')
  } finally {
    sendBtn.disabled = false
  }
}

// ===== 自动分析报告 =====
async function generateReports() {
  if (!state.apiKey) return
  reportList.innerHTML = '<div class="report-item" style="justify-content:center;color:var(--text-muted)">分析中...</div>'

  try {
    const reports = []
    for (const coin of state.coins.slice(0, 5)) {
      const priceRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${coin}USDT`)
      const priceData = await priceRes.json()

      const aiRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: coin,
          question: '当前市场状况如何？给出简要分析。',
          priceData: {
            price: priceData.lastPrice,
            change24h: priceData.priceChangePercent,
            high24h: priceData.highPrice,
            low24h: priceData.lowPrice,
            volume: priceData.volume
          },
          recentKlines: [],
          apiKey: state.apiKey,
          shortMode: true
        })
      })
      const aiData = await aiRes.json()

      const summary = aiData.reply.length > 60 ? aiData.reply.substring(0, 60) + '...' : aiData.reply
      reportList.innerHTML += `
        <div class="report-item">
          <div>
            <div class="report-symbol">${coin}</div>
            <div class="report-summary">${summary}</div>
          </div>
          <div class="report-time">${new Date().toLocaleTimeString()}</div>
        </div>
      `
    }
  } catch (e) {
    reportList.innerHTML = '<div class="report-item" style="justify-content:center;color:var(--text-muted)">分析失败，请检查 API Key</div>'
  }
}

// ===== 初始化 =====
async function init() {
  loadState()

  // 设置
  saveKeyBtn.addEventListener('click', () => {
    state.apiKey = apiKeyInput.value.trim()
    localStorage.setItem('crypto_api_key', state.apiKey)
    addMessage('ai', '✅ API Key 已保存')
  })
  addCoinBtn.addEventListener('click', () => {
    if (addCoinInput.value.trim()) {
      addCoin(addCoinInput.value.trim())
      addCoinInput.value = ''
    }
  })
  addCoinInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') addCoinBtn.click()
  })
  refreshReport.addEventListener('click', generateReports)

  // 图表周期
  setupIntervalButtons()

  // 快速问题
  quickQuestions.addEventListener('click', e => {
    const q = e.target.closest('.quick-q')
    if (q) sendMessage(q.dataset.q)
  })

  // 发送
  sendBtn.addEventListener('click', () => sendMessage(chatInput.value))
  chatInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') sendBtn.click()
  })

  // 渲染
  renderCoinTabs()
  renderCoinList()
  initChart()
  await refreshPriceData()
  startTicker()

  // 初始分析
  setTimeout(generateReports, 2000)
}

document.addEventListener('DOMContentLoaded', init)
