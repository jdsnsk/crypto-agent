### Task 1: 项目初始化与 Vercel 配置

**Files:**
- Create: `vercel.json`
- Create: `api/package.json`
- Create: `README.md`

**Interfaces:**
- Produces: 项目骨架 + Vercel 部署配置

- [ ] **Step 1: 创建项目目录**

```bash
mkdir -p "C:\Users\26850\crypto-agent\api"
```

- [ ] **Step 2: 编写 vercel.json**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "builds": [
    { "src": "api/*.js", "use": "@vercel/node" }
  ]
}
```

- [ ] **Step 3: 编写 api/package.json**

```json
{
  "name": "crypto-agent-api",
  "version": "1.0.0",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0"
  }
}
```

- [ ] **Step 4: 编写 README.md**

```markdown
# 虚拟币 AI 分析助手

实时行情看板 + AI 市场分析。

## 部署到 Vercel

1. Fork 或下载本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 部署完成即可使用

## 使用说明

1. 打开网页，在底部设置区输入 Claude API Key
2. 顶部行情栏显示主流币种实时行情
3. 点击币种可查看 K 线图
4. 右侧 AI 对话区可提问分析市场
```

- [ ] **Step 5: 初始化 git 并提交**

```bash
cd "C:\Users\26850\crypto-agent"
git init
git add vercel.json api/package.json README.md
git commit -m "chore: 项目初始化 + Vercel 部署配置"
```

---

