# V2EX 帖子草稿（中文）

**标题**：[开源] 让 DSH Web 手机端变成 DeepSeek 官方 App 的样子 — 顺手做了个插件

**正文**：

```
日常用 [DSH (DeepSeek Harness)](https://github.com/) 跑本地大模型，桌面端没问题，手机端那个 maid-atelier 主题实在看不下去。
把手机端做成 DeepSeek 官方 App 的样子：品牌蓝 #4D6BFE、扁平化、底部输入、悬浮 ☰ 菜单球、可拖拽贴边、附件上传、归档面板正常显示。顺手把 dsh-token-viewer 的侧栏改成「今日」消费（每天 0 点自动归零），总成本统一两位小数。

[截图：手机主页 / 抽屉 / 归档]
（图片见仓库 README）

**安装（两行搞定）：**
    dsh plugin --profile web add <repo>/plugin
    ./patches/dsh-token-viewer/apply-patch.sh  # 可选，计费面板

**关键点：**
- 纯前端 CSS 覆盖，不动产品代码，不改聊天数据
- 5 分钟装好，硬刷新就能用
- 桌面端完全不受影响
- 包名必须叫 ds-mobile-skin（环境的 dsh-profile-guard 会删旧名）

**链接：**
- 仓库：https://github.com/wenyixiaoqingnian/ds-mobile-skin
- 含 CI 打包校验 + 一键应用脚本
- MIT 开源，欢迎 PR

反馈 / bug / 想要的功能直接提 issue。
```

**话题节点**：`程序员` `分享创造` `开源` `DeepSeek` `前端`
