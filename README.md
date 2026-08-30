# ds-mobile-skin

[![CI](https://github.com/wenyixiaoqingnian/ds-mobile-skin/actions/workflows/build.yml/badge.svg)](https://github.com/wenyixiaoqingnian/ds-mobile-skin/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![DSH Plugin](https://img.shields.io/badge/DSH-client%20plugin-4D6BFE)](https://github.com/wenyixiaoqingnian/ds-mobile-skin)
[![Mobile First](https://img.shields.io/badge/mobile-first-4D6BFE)](#)

> **让 DSH Web GUI 在手机端拥有 DeepSeek 官方 App 一样的体验。**
> 干净的深蓝品牌色、扁平化界面、底部输入、悬浮菜单球、附件上传——加上一个「今日」计费面板。

![Mobile home](docs/screenshot-mobile-home.png)

---

## 📱 预览

**主页**（带 ☰ 悬浮菜单球 + 底部 composer + 品牌蓝 #4D6BFE）：

![home](docs/screenshot-mobile-home.png)

> 纯前端（浏览器侧）改动，**不触碰**任何聊天会话、模型配置、密钥等数据。
> 截图仅展示 UI 风格，不含真实数据。

---

## ✨ 功能

### 📱 手机端 App 化（`plugin/`，独立插件包）

- **品牌化视觉**：品牌蓝 `#4D6BFE`、扁平化、app 质感；桌面端不受影响
- **悬浮菜单球 ☰**：可拖拽、自动贴边、位置记忆（localStorage）；抽屉打开时自动隐藏
- **上传附件**：在输入工具栏注入上传按钮，复用产品自身上传通道
- **自动收起键盘**：切换会话时主动 blur 输入框，避免手机键盘弹起
- **弹层定位**：菜单/下拉/弹窗自动锚定在触发按钮上方

### 💰 计费功能增强（`patches/`，对 `dsh-token-viewer` 的补丁）

- **「今日」面板**：侧栏统计**今天零点至今**的消费（本地午夜自动归零）
- **总成本保留两位小数**
- **日志排序**：按花费降序、最多 10 条
- **移动端布局**：详情面板全屏、双列迷你统计、窄屏适配
- **NaN 修复**：侧栏「未缓存输入」字段使用正确来源

---

## 🚀 安装

### 1. 安装插件（手机端 App 化）

```bash
# 从本仓库目录安装到 web profile
dsh plugin --profile web add /path/to/ds-mobile-skin/plugin

# 或作为本地依赖加入 profile
cd ~/.dsh/profiles/web
pnpm add file:/path/to/ds-mobile-skin/plugin
pnpm install
```

**硬刷新浏览器**（Ctrl/Cmd+Shift+R）即可生效 —— 客户端代码每次请求都从磁盘读取，无需重启服务。

> ⚠️ **插件包名必须保持 `ds-mobile-skin`**，以便环境识别、卸载与升级（请勿改名为其他包名后安装）。

### 2. 应用计费补丁（可选）

```bash
cd patches/dsh-token-viewer
./apply-patch.sh          # 自动定位 ~/.dsh/profiles/web/node_modules/dsh-token-viewer/lib/client.js
```

脚本行为：自动备份、幂等、校验标记。每次 `pnpm install` 后需重跑。

---

## 📦 仓库结构

```
ds-mobile-skin/
├── plugin/                          # 可安装的插件包
│   ├── package.json
│   ├── cordis.patch.yml
│   └── lib/{index.js,client.js}
├── patches/
│   └── dsh-token-viewer/
│       ├── client.js.diff
│       └── apply-patch.sh
├── docs/                            # 截图
├── .github/
│   ├── scripts/validate-diff.py
│   └── workflows/build.yml
├── LICENSE                          # MIT
└── README.md
```

---

## 🔒 隐私

- **不包含**任何聊天会话、模型配置、API 密钥
- 仅在浏览器侧注入 CSS 与少量交互 JS
- `localStorage` 仅用于记忆悬浮球位置

---

## 🛠 开发

硬刷新浏览器即可看到效果（服务端每次请求都重新读取 `client.js`）。重新生成补丁（用 `--label` 避免把本机路径写进 diff）：

```bash
diff -u --label a/dsh-token-viewer/lib/client.js --label b/dsh-token-viewer/lib/client.js \
  <原始 client.js> <当前 client.js> > patches/dsh-token-viewer/client.js.diff
```

生成后跑一次校验器确认 hunk 头行数与正文一致：

```bash
python3 .github/scripts/validate-diff.py
```

---

## ⚠️ 已知限制与兼容性

- **CSS 类名依赖**：皮肤层针对产品构建产物的 CSS Modules hash（如 `.hHd-Xa_root`、`.pI_x6G_frame`）编写，上游**任何一次重新构建都可能换名**，导致部分样式失效（表现为皮肤半生效）。已验证范围见插件 `package.json` 的版本记录；升级 DSH 后如发现错乱，先确认 hash 是否变化。
- **补丁版本绑定**：`patches/dsh-token-viewer/client.js.diff` 针对 `dsh-token-viewer@0.2.0` 生成。`apply-patch.sh` 会读取已装版本并**拒绝**不匹配的版本，避免静默损坏。升级该插件后请重新生成 diff。
- **只影响手机视口**：所有覆盖都在 `@media (max-width: 768px)` 内，桌面端不受影响。

## 🧯 Troubleshooting

| 现象 | 处理 |
|---|---|
| 刷新后无变化 | 硬刷新（Ctrl/Cmd+Shift+R）；确认插件在 profile bundles 中：`dsh plugin ls --profile web` |
| 皮肤半生效/错乱 | 见上「已知限制」——检查 hash 类名是否仍存在（DevTools 搜 `.hHd-Xa_root`） |
| 补丁应用失败 | 先看报错：版本不匹配就装对应版本；行号漂移就重新生成 diff |
| 想回滚补丁 | 脚本每次应用前生成 `client.js.bak-<时间戳>`（保留最近 3 个），恢复：`cp client.js.bak-<时间戳> client.js` |
| 想卸载插件 | `dsh plugin --profile web remove ds-mobile-skin` 后硬刷新 |

---

## 📄 许可证

[MIT](LICENSE)
