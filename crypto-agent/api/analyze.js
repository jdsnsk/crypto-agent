const Anthropic = require('@anthropic-ai/sdk')

exports.handler = async (event) => {
  try {
    const { symbol, question, priceData, recentKlines, apiKey, shortMode } = JSON.parse(event.body)

    if (!apiKey) {
      return { statusCode: 400, body: JSON.stringify({ error: 'API Key 不能为空' }) }
    }

    const anthropic = new Anthropic({ apiKey })

    // 构建行情摘要
    let marketContext = `## 当前行情数据\n`
    marketContext += `- 币种: ${symbol}/USDT\n`
    marketContext += `- 当前价格: $${parseFloat(priceData.price).toLocaleString()}\n`
    marketContext += `- 24h涨跌: ${parseFloat(priceData.change24h) >= 0 ? '+' : ''}${parseFloat(priceData.change24h).toFixed(2)}%\n`
    marketContext += `- 24h最高: $${parseFloat(priceData.high24h).toLocaleString()}\n`
    marketContext += `- 24h最低: $${parseFloat(priceData.low24h).toLocaleString()}\n`
    marketContext += `- 24h成交量: ${(parseFloat(priceData.volume) / 1000000).toFixed(2)}M ${symbol}\n`

    if (recentKlines && recentKlines.length > 0) {
      marketContext += `\n最近5根K线(1h):\n`
      recentKlines.forEach(k => {
        marketContext += `- ${k.time} O:${k.open} H:${k.high} L:${k.low} C:${k.close} Vol:${parseFloat(k.vol).toFixed(0)}\n`
      })
    }

    const systemPrompt = shortMode
      ? `你是一个加密货币分析师。基于给定数据给出极简分析（1-2句话概括趋势和关键位）。保持客观，提示风险。回复用中文。`
      : `你是一个专业的加密货币分析师。请基于实时数据进行专业分析。

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

    const userMessage = shortMode
      ? `${marketContext}\n\n用户问题：${question}\n\n请用 1-2 句话简要分析。`
      : `${marketContext}\n\n用户问题：${question}\n\n请按分析框架给出详细分析。`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: shortMode ? 300 : 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })

    const reply = response.content[0].text

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    }
  } catch (e) {
    console.error('analyze error:', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '分析失败: ' + e.message })
    }
  }
}
