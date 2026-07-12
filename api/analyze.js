module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const { symbol, question, priceData, recentKlines, apiKey, shortMode } = req.body

    let context = `## ${symbol}/USDT 行情数据\n`
    context += `当前价格: $${parseFloat(priceData.price).toLocaleString()}\n`
    context += `24h涨跌: ${parseFloat(priceData.change24h) >= 0 ? '+' : ''}${parseFloat(priceData.change24h).toFixed(2)}%\n`
    context += `24h最高: $${parseFloat(priceData.high24h).toLocaleString()}\n`
    context += `24h最低: $${parseFloat(priceData.low24h).toLocaleString()}\n`

    const sysPrompt = shortMode
      ? '你是一个加密货币分析师。基于数据给出1-2句极简分析。回复用中文。'
      : '你是一个专业的加密货币分析师。分析框架：1)短期趋势 2)支撑/阻力位 3)风险提示 4)操作建议(仅供参考)。回复用中文markdown。'

    const msg = shortMode
      ? context + '\n请简要分析。'
      : context + '\n\n用户问：' + question + '\n\n请按框架给出详细分析。'

    const resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'deepseek-chat', max_tokens: shortMode ? 200 : 1000, messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: msg }] })
    })
    const data = await resp.json()
    if (!resp.ok) return res.status(500).json({ error: data.error?.message || 'API Error' })
    res.json({ reply: data.choices[0].message.content })
  } catch (e) { res.status(500).json({ error: e.message }) }
}
