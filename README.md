# ds-mobile-skin

让 **DeepSeek Harness Web GUI（DSH Web）** 在手机端拥有 DeepSeek 官方 App 一样的体验：干净的深蓝色主视觉（品牌蓝 `#4D6BFE`）、扁平化界面、底部输入、悬浮菜单球、附件上传，以及一个「今日」计费面板。

> 纯前端（浏览器侧）改动，**不触碰**任何聊天会话、模型配置、密钥等数据 —— 所有逻辑只在页面 DOM/CSS 层运行。

---

## ✨ 功能一览

### 📱 手机端 App 化（`plugin/`，独立插件包）
- **品牌化视觉**：中和原皮肤（maid-atelier）的装饰元素，套用 DeepSeek 品牌蓝 `#4D6BFE` 与扁平 App 质感；桌面端完全不受影响。
- **悬浮菜单球**：可拖拽的 ☰ 球，松手自动贴边（左/右）；位置记忆（localStorage）；抽屉打开时自动隐藏。
- **上传附件**：在输入工具栏注入上传按钮，点击选择文件后直接复用产品自身的上传通道（拖放事件）。
- **自动收起键盘**：切换会话等程序化聚焦时主动 blur 输入框，避免手机键盘弹起。
- **弹层定位**：菜单 / 下拉 / 弹窗自动锚定在触发按钮上方，而不是居中挡内容。

### 💰 计费功能增强（`patches/`，对 `dsh-token-viewer` 的补丁）
`dsh-token-viewer` 是环境管理的第三方插件，我们不 fork 它，而是提供**统一补丁 + 一键应用脚本**：
- **「今日」面板**：侧栏统计改为统计**今天零点至今**的消费（本地午夜自动归零），含请求数、会话数、总花费。
- **总成本保留两位小数**：所有金额显示统一 `formatCostExact(..., 2)`。
- **日志排序**：会话日志按花费降序、最多 10 条（当日排行）。
- **日志日期**：显示创建日期（MM/DD），不再只有时间。
- **移动端布局**：详情面板全屏、双列迷你统计、图例/表格字号与留白适配窄屏；修复了面板背景/遮罩的挂载问题（不再把遮罩移到 `<body>` 导致 React 事件失效）。
- **NaN 修复**：侧栏「未缓存输入」字段使用正确来源，不再显示 `NaN`。

---

## 📦 仓库结构

```
ds-mobile-skin/
├── plugin/                          # 可安装的插件包（ds-mobile-skin）
│   ├── package.json                 # npm 包元数据 + dsh 插件声明
│   ├── cordis.patch.yml             # 挂载插件行到 web profile 的 bundle
│   └── lib/
│       ├── index.js                 # 宿主侧空 apply（占位）
│       └── client.js                # 浏览器侧：CSS + JS（全部改动在此）
├── patches/
│   └── dsh-token-viewer/
│       ├── client.js.diff           # 对 token-viewer 的统一 diff
│       └── apply-patch.sh           # 一键应用脚本（备份/幂等/校验）
├── .github/workflows/build.yml      # 打包产物 CI
├── LICENSE                          # MIT
└── README.md
```

---

## 🚀 安装

### 前置
- DSH Web 环境，Web profile 使用 **pnpm** 管理（`nodeLinker: hoisted`）。
- 手机端优化只作用于 ≤768px 的视口；桌面端不变。

### 1. 安装插件（手机端 App 化）

```bash
# 从本仓库目录安装插件到 web profile
dsh plugin --profile web add /path/to/ds-mobile-skin/plugin

# 或作为本地路径依赖加入 profile 的 package.json 后执行
cd ~/.dsh/profiles/web
pnpm add file:/path/to/ds-mobile-skin/plugin
pnpm install
```

之后**硬刷新**浏览器（Ctrl/Cmd+Shift+R）即可生效 —— 客户端代码每次请求都会从磁盘重新读取，无需重启 `dsh web` 服务。

> ⚠️ **重要**：插件包名**必须保持 `ds-mobile-skin`**。部分部署环境的 `dsh-profile-guard` 会按名字删除特定插件（例如旧名 `dsh-web-deepseek-mobile`），改名即可绕过该名单。

### 2. 应用计费补丁（可选，推荐）

```bash
cd patches/dsh-token-viewer
./apply-patch.sh          # 自动定位 ~/.dsh/profiles/web/node_modules/dsh-token-viewer/lib/client.js
# 或指定路径：
./apply-patch.sh /custom/path/to/dsh-token-viewer/lib/client.js
```

脚本行为：
- 应用前自动备份 `client.js.bak-<时间戳>`；
- 已应用时直接跳过（幂等）；
- 应用后校验标记存在。

> ⚠️ **每次 pnpm install / dsh plugin 重装后需重跑** `apply-patch.sh`，因为 node_modules 中的文件会被覆盖。

### 3. 卸载 / 还原

- 移除插件：`dsh plugin --profile web remove ds-mobile-skin`（或从 profile `package.json` 的 bundles 列表移除该包并 `pnpm install`）。
- 还原计费补丁：用脚本生成的 `client.js.bak-*` 覆盖回 `client.js`，或直接重装 `dsh-token-viewer`。

---

## 🔒 隐私与安全

- 本仓库**不包含**任何聊天会话内容、模型配置、API 密钥或用户数据。
- 插件只在浏览器侧注入 CSS 与少量交互 JS；不发起任何网络请求，不上传任何数据。
- `localStorage` 仅用于记忆悬浮球的位置（键 `ds-mobile-menu-pos`）。

---

## 🛠 开发

改动浏览器侧代码后无需重启服务，硬刷新浏览器即可看到效果（服务端每次请求都重新读取 `client.js`）。

### 重新生成 token-viewer 补丁

```bash
# 用备份的原始文件对比当前（已打补丁）版本
diff -u <原始 client.js> <当前 client.js> > patches/dsh-token-viewer/client.js.diff
```

---

## 📄 许可证

MIT — 详见 [LICENSE](LICENSE)。
