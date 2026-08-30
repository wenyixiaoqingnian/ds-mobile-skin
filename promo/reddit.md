# Reddit 帖子草稿（英文）

**Subreddits**: r/DeepSeek, r/selfhosted, r/LocalLLaMA, r/SideProject

---

## Post for r/DeepSeek / r/selfhosted

**Title**: [Open source] I made DSH Web's mobile UI look like the official DeepSeek app

**Body**:

I run DSH (DeepSeek Harness) on my server and access it from my phone. The stock mobile UI is a bit rough, so I wrote a CSS plugin that makes it look and feel like the official DeepSeek app — same brand blue (#4D6BFE), flat surfaces, bottom composer, draggable floating menu ball, attachment button, and a fixed archive overlay that the stock mobile-fix was clobbering.

Bonus: a small unified-diff patch for `dsh-token-viewer` that adds a "today" billing panel (resets at local midnight), 2-decimal cost formatting, sorted request log, and proper mobile layout. Includes a one-liner `apply-patch.sh` that backs up, applies, and verifies.

![mobile home](https://raw.githubusercontent.com/wenyixiaoqingnian/ds-mobile-skin/main/docs/screenshot-mobile-home.png)

**Install:**
```bash
dsh plugin --profile web add <repo>/plugin
./patches/dsh-token-viewer/apply-patch.sh
```

**Repo:** https://github.com/wenyixiaoqingnian/ds-mobile-skin
**MIT licensed.** PRs welcome.

---

## Notes per subreddit

- **r/DeepSeek**: emphasize it makes the DSH web experience match the app
- **r/selfhosted**: emphasize it's a selfhost-friendly theme/plugin for DSH
- **r/LocalLLaMA**: emphasize it works with any model you run through DSH
- **r/SideProject**: emphasize CI / clean repo / screenshots / first-time publishing
