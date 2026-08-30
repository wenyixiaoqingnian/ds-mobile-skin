# 国内社区帖子草稿（掘金 / 少数派 / 知乎）

**标题**（多版本）：

- 掘金：「开源」让 DSH Web 手机端变成 DeepSeek 官方 App 的样子
- 少数派：DSH Harness 手机端美化：从 maid 主题到 DeepSeek App 风的完整记录
- 知乎：如何把 DSH (DeepSeek Harness) Web 端的手机体验做成官方 App 的样子？

**正文**：

## 起因
我日常用 [DSH (DeepSeek Harness)](https://github.com) 跑本地大模型。桌面端没问题，但手机端那个 maid-atelier 主题 + 桌面 UI 直接缩放过来实在太丑——字号不对、按钮位置错位、抽屉透明、归档面板打不开。所以动手做了一个客户端插件 + 几个补丁。

## 效果

![手机主页](https://raw.githubusercontent.com/wenyixiaoqingnian/ds-mobile-skin/main/docs/screenshot-mobile-home.png)

| 主页 | 抽屉 | 归档面板 |
|---|---|---|
| ☰ 悬浮球 / 品牌蓝 / 底部 composer | 会话列表 / 用量详情 | 归档会话 / 恢复 / 永久删除 |

## 做了什么

**1. 手机端视觉层（`plugin/`，独立 DSH 客户端插件）**
- 品牌色统一为 `#4D6BFE`
- 抹掉 maid 主题的装饰元素（人物、壁纸、边角）
- 抽屉展开时设置不透明背景
- 把桌面端"悬浮按钮""图标按钮"在窄屏下的尺寸/间距规整
- 顶栏 chip（workspace / standard mode）改扁平

**2. 交互层（仍在 `plugin/`）**
- 自定义 ☰ 悬浮菜单球：可拖拽、松手贴边、位置 localStorage 记忆
- 抽屉打开时悬浮球自动隐藏（避免拦截点击）
- 注入「上传附件」按钮：点击选文件 → 触发产品自带的 drop 事件
- 切换会话时主动 blur 输入框，避免手机键盘自动弹起
- 弹窗/下拉自动锚定到触发按钮上方

**3. 计费补丁（`patches/`，对 `dsh-token-viewer` 的统一 diff）**
- 侧栏统计改为「今日」（本地 0 点自动归零）
- 总成本统一两位小数（之前 4/6 位都有）
- 日志按花费降序，最多 10 条
- 详情面板移动端全屏、双列迷你统计
- 修了一个 NaN 显示 bug
- 修了一个 backdrop 渲染 bug（之前 backdrop 被移到 `<body>`，导致 React 事件失效）

## 怎么用

**装插件：**
```bash
dsh plugin --profile web add /path/to/plugin
```

**装补丁：**
```bash
./patches/dsh-token-viewer/apply-patch.sh
```

**注意**：
- 插件包名必须叫 `ds-mobile-skin`（环境的 `dsh-profile-guard` 会按名删除旧插件）
- 补丁每次 `pnpm install` 后要重跑（因为 `node_modules` 会被覆盖）
- 硬刷新浏览器就能看到效果，不用重启服务

## 关于技术栈

- 纯客户端 CSS + JS，不动产品代码
- 补丁是 unified diff，配合 `apply-patch.sh` 一键应用（自动备份、幂等、校验）
- GitHub Actions 自动打包 + 校验补丁

## 仓库

**https://github.com/wenyixiaoqingnian/ds-mobile-skin**

MIT 协议，欢迎 PR / Issue / Star。

---

**作者**：wenyixiaoqingnian
**目标读者**：DSH 用户 / DeepSeek 桌面+移动体验差别的强迫症患者
