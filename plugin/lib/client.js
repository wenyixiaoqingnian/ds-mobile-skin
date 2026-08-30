window.__ModuleLoader__.load({
  id: "ds-mobile-skin",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    var CSS = `/* ============================================================================
   DeepSeek-official-app look for the DSH Web UI on mobile (<=768px).
   Pure overlay — no product source touched. Scoped to mobile so desktop is
   unchanged. v2: neutralize the maid-atelier skin chrome (wallpaper, characters,
   rail, composer lace frame), apply brand blue #4D6BFE and flat surfaces.
   ========================================================================== */

@media (max-width: 768px) {
  /* 0. Brand palette ----------------------------------------------------- */
  :root {
    --ds-brand: #4d6bfe;
    --ds-brand-hover: #3d5afe;
    --ds-brand-soft: rgba(77, 107, 254, 0.12);
  }

  body {
    background: var(--dsw-alias-bg-base, #ffffff) !important;
    /* Surface/text vars defined here so they inherit the theme tokens,
       which are set on the body/theme scope, not on :root. */
    --ds-surface: var(--dsw-alias-bg-layer-1, #ffffff);
    --ds-surface-2: var(--dsw-alias-bg-layer-2, #f5f6f8);
    --ds-border: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
    --ds-text: var(--dsw-alias-label-primary, #1f2329);
    --ds-text-2: var(--dsw-alias-label-secondary, #5b616e);
  }

  /* 1. Neutralize the maid-atelier decorative skin chrome on mobile ------- */
  [data-skin-owner="maid-atelier"][data-skin-chrome="character-stage"],
  [data-skin-owner="maid-atelier"][data-skin-chrome="sidebar-mascot"],
  [data-skin-owner="maid-atelier"][data-skin-chrome="sidebar-corners"],
  [data-skin-owner="maid-atelier"][data-skin-chrome="top-trim"],
  [data-skin-owner="maid-atelier"][data-skin-chrome="bottom-trim"],
  img[data-maid-character] {
    display: none !important;
  }

  .pI_x6G_frame,
  .pI_x6G_centerCol {
    background: transparent !important;
  }

  /* 2. Sidebar rail: flat, minimal brand nav ----------------------------- */
  .pI_x6G_sidebarCol {
    background: var(--dsw-alias-bg-base, #ffffff) !important;
  }
  .hHd-Xa_root {
    box-shadow: none !important;
    border-right: 1px solid var(--ds-border) !important;
  }
  /* The expanded sidebar drawer must be OPAQUE so it covers the chat instead of
     letting the message text bleed through (the stock rule leaves it transparent
     once the chrome is flattened). Restore a solid surface only while the
     sidebar is open (frame not collapsed). */
  .pI_x6G_frame:not([data-sidebar-collapsed]) .hHd-Xa_root {
    background: var(--dsw-alias-bg-layer-1, #ffffff) !important;
    box-shadow: 0 0 28px rgba(0, 0, 0, 0.16) !important;
  }
  .pXSMma_fishHitbox,
  [class*="fishHitbox"] {
    display: none !important;
  }
  .pI_x6G_sidebarCol [class*="iconButton"],
  .pI_x6G_sidebarCol [class*="newSession"],
  .pI_x6G_sidebarCol [class*="toggle"],
  .pI_x6G_sidebarCol [class*="searchButton"],
  .pI_x6G_sidebarCol [class*="trigger"],
  .hHd-Xa_root [class*="iconButton"],
  .hHd-Xa_root [class*="newSession"],
  .hHd-Xa_root [class*="toggle"],
  .hHd-Xa_root [class*="trigger"] {
    background: transparent !important;
    border-color: transparent !important;
    border-radius: 12px !important;
    color: var(--ds-text-2) !important;
  }
  .pI_x6G_sidebarCol [class*="iconButton"]:hover,
  .pI_x6G_sidebarCol [class*="newSession"]:hover,
  .pI_x6G_sidebarCol [class*="toggle"]:hover,
  .hHd-Xa_root [class*="iconButton"]:hover,
  .hHd-Xa_root [class*="newSession"]:hover,
  .hHd-Xa_root [class*="toggle"]:hover {
    background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06)) !important;
  }
  .pI_x6G_sidebarCol svg,
  .hHd-Xa_root svg {
    color: var(--ds-text-2) !important;
  }

  /* 3. Hero chips (workspace / standard mode / preview) ------------------- */
  .pXSMma_previewBadge,
  .pXSMma_workspace,
  .cubgiG_seat {
    background: var(--ds-surface-2) !important;
    border: 1px solid var(--ds-border) !important;
    color: var(--ds-text-2) !important;
    border-radius: 10px !important;
    box-shadow: none !important;
  }

  /* 4. Composer: DeepSeek-style rounded input + brand-blue send ---------- */
  .uV2eYG_card {
    background: var(--ds-surface) !important;
    border: 1px solid var(--ds-border) !important;
    border-radius: 18px !important;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12) !important;
  }
  /* Kill the skin's ornate lace frame around the card. */
  .uV2eYG_card::before {
    content: none !important;
    display: none !important;
    border: 0 !important;
    background: none !important;
  }
  .uV2eYG_card::after {
    background: none !important;
    border: 0 !important;
    box-shadow: none !important;
  }
  .uV2eYG_backdrop {
    background: transparent !important;
    backdrop-filter: none !important;
  }
  .uV2eYG_input {
    color: var(--ds-text) !important;
    caret-color: var(--ds-brand) !important;
  }
  .uV2eYG_primary {
    background: var(--ds-brand) !important;
    box-shadow: 0 4px 14px var(--ds-brand-soft) !important;
    color: #ffffff !important;
    border: 0 !important;
  }
  .uV2eYG_primary:hover {
    background: var(--ds-brand-hover) !important;
  }
  .uV2eYG_add,
  .Sh0Q9G_trigger {
    background: var(--ds-surface-2) !important;
    border: 1px solid var(--ds-border) !important;
    border-radius: 12px !important;
    color: var(--ds-text-2) !important;
  }

  /* 5. Hide the persistent left rail on mobile (DeepSeek-app look).
        The rail column collapses to 0 when the sidebar is collapsed (the
        default); the sidebar drawer stays reachable via the floating menu
        button added by this plugin. When expanded the product expands the
        sidebar column and the drawer overlays the chat. */
  .pI_x6G_frame[data-sidebar-collapsed="true"] {
    grid-template-columns: 0 minmax(0, 1fr) 0 !important;
  }

  /* Show the per-row "..." actions (rename/fork/archive/delete) on the mobile
     drawer. The product hides them on narrow screens (display:none); showing
     them lets users tap the button directly — and tapping it opens the product
     menu WITHOUT closing the drawer (the auto-close only fires on outside taps
     now). */
  .YDXeBa_rowActions {
    display: inline-flex !important;
    gap: 4px !important;
  }
  .YDXeBa_rowActions button,
  .YDXeBa_rowActions [class*="iconButton"] {
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    display: grid !important;
    place-items: center;
    border-radius: 50%;
  }
  .YDXeBa_rowActions svg {
    width: 16px !important;
    height: 16px !important;
  }

  /* 6. Floating menu button that opens the sidebar drawer. */
  .ds-deepseek-menu {
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 2000;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.35)));
    border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
    color: var(--dsw-alias-label-primary, #1f2329);
    display: grid;
    place-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition: left 0.18s ease, top 0.18s ease;
  }
  .ds-deepseek-menu.dragging {
    cursor: grabbing;
    opacity: 0.85;
    transition: none !important;
  }
  .ds-deepseek-menu svg {
    width: 18px;
    height: 18px;
    pointer-events: none;
  }
  .ds-deepseek-menu:active {
    background: var(--dsw-alias-interactive-bg-active, rgba(0, 0, 0, 0.1));
  }
  /* Hide the floating menu button while the sidebar drawer is open; it
     reappears once the drawer is closed. */
  body.ds-drawer-open .ds-deepseek-menu {
    display: none !important;
  }

  /* 7. Floating back button for full-screen modal dialogs on mobile (e.g.
        Settings), which otherwise have no close affordance and cannot be
        dismissed by tapping outside. */
  .ds-deepseek-close {
    position: fixed;
    top: 12px;
    right: 12px;
    z-index: 2100;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.35)));
    border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
    color: var(--dsw-alias-label-primary, #1f2329);
    display: grid;
    place-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .ds-deepseek-close svg {
    width: 18px;
    height: 18px;
    pointer-events: none;
  }
  .ds-deepseek-close:active {
    background: var(--dsw-alias-interactive-bg-active, rgba(0, 0, 0, 0.1));
  }
}
`;
    var POS_KEY = 'ds-mobile-menu-pos';

    var UPLOAD_ICON = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 1.333v9.333" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4.6 7.4 8 4l3.4 3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11.4v1.1A1.5 1.5 0 0 0 4.5 14h7A1.5 1.5 0 0 0 13 12.5v-1.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    var MENU_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

    function mobileOnly() { return window.innerWidth <= 768; }
    function toggleSidebar() { var t = document.querySelector('.hHd-Xa_toggle'); if (t) t.click(); }
    function sidebarOpen() { var f = document.querySelector('.pI_x6G_frame'); return !!f && !f.hasAttribute('data-sidebar-collapsed'); }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    /* Snap the floating button flush to the nearest screen edge (0 margin). */
    function applySnap(btn) {
      var w = btn.offsetWidth || 38, h = btn.offsetHeight || 38, margin = 0;
      var r = btn.getBoundingClientRect();
      var cx = r.left, cy = r.top;
      var dLeft = cx, dRight = window.innerWidth - cx - w, dTop = cy, dBottom = window.innerHeight - cy - h;
      var m = Math.min(dLeft, dRight, dTop, dBottom);
      var nx = cx, ny = cy;
      if (m === dLeft) nx = margin;
      else if (m === dRight) nx = window.innerWidth - w - margin;
      else if (m === dTop) ny = margin;
      else ny = window.innerHeight - h - margin;
      nx = clamp(nx, 0, window.innerWidth - w);
      ny = clamp(ny, 0, window.innerHeight - h);
      btn.style.left = nx + 'px';
      btn.style.top = ny + 'px';
      return { x: btn.style.left, y: btn.style.top };
    }

    function makeDraggable(btn) {
      var drag = { active: false, moved: false, wasOpen: false, sx: 0, sy: 0, lx: 0, ly: 0 };
      btn.addEventListener('pointerdown', function (e) {
        drag.active = true; drag.moved = false; drag.wasOpen = sidebarOpen();
        drag.sx = e.clientX; drag.sy = e.clientY;
        var r = btn.getBoundingClientRect(); drag.lx = r.left; drag.ly = r.top;
        try { btn.setPointerCapture(e.pointerId); } catch (err) {}
        btn.classList.add('dragging');
      });
      btn.addEventListener('pointermove', function (e) {
        if (!drag.active) return;
        var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
        if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
        if (!drag.moved) return;
        btn.style.left = clamp(drag.lx + dx, 0, window.innerWidth - btn.offsetWidth) + 'px';
        btn.style.top = clamp(drag.ly + dy, 0, window.innerHeight - btn.offsetHeight) + 'px';
      });
      var endMove = function () {
        if (!drag.active) return;
        drag.active = false;
        btn.classList.remove('dragging');
        if (drag.moved) {
          var pos = applySnap(btn);
          try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch (err) {}
        }
      };
      btn.addEventListener('pointerup', endMove);
      btn.addEventListener('pointercancel', endMove);
      btn.addEventListener('click', function (e) {
        if (drag.moved) { drag.moved = false; e.preventDefault(); e.stopImmediatePropagation(); return; }
        if (!drag.wasOpen) toggleSidebar();
      });
    }

    function ensureMenuButton() {
      if (!mobileOnly()) return;
      if (document.querySelector('.ds-deepseek-menu')) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ds-deepseek-menu'; b.setAttribute('aria-label', 'Open sidebar');
      b.innerHTML = MENU_ICON; makeDraggable(b);
      try { var p = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); if (p && p.x && p.y) { b.style.left = p.x; b.style.top = p.y; } } catch (err) {}
      document.body.appendChild(b);
      applySnap(b);
    }

    function syncMenuVisibility() {
      var open = sidebarOpen();
      document.body.classList.toggle('ds-drawer-open', open);
      /* Defensive: if the CSS rule ever fails (e.g. dark mode override or a
         competing selector wins), force-hide the button ourselves so it can
         never intercept pointer events behind the drawer. */
      var btn = document.querySelector('.ds-deepseek-menu');
      if (btn) btn.style.setProperty('display', open ? 'none' : 'grid', 'important');
    }

    function ensureUploadButton() {
      if (!mobileOnly()) return;
      var host = document.querySelector('.uV2eYG_row .uV2eYG_tools');
      if (!host || host.querySelector('[data-ds-deepseek-attach]')) return;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.dataset.dsDeepseekAttach = "true"; btn.className = 'uV2eYG_add';
      btn.setAttribute('aria-label', 'Upload file'); btn.title = '上传文件'; btn.innerHTML = UPLOAD_ICON;
      btn.addEventListener('click', function () {
        var input = document.createElement('input'); input.type = 'file'; input.multiple = true; input.accept = 'image/*'; input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('change', function () {
          var files = Array.prototype.slice.call(input.files || []); input.remove(); if (!files.length) return;
          var dt = new DataTransfer(); files.forEach(function (f) { dt.items.add(f); });
          document.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
        });
        input.click();
      });
      host.prepend(btn);
    }

    /* Prevent the on-screen keyboard from popping when the composer auto-focuses
       on a conversation switch (the product focuses the input on sessionId
       change). On mobile, blur the input unless the user actually tapped it. */
    var lastInputTap = 0;
    function onPointerDown(ev) {
      var t = ev.target;
      if (t && t.classList && t.classList.contains('uV2eYG_input')) lastInputTap = Date.now();
    }
    function onFocusIn() {
      if (!mobileOnly()) return;
      var input = document.activeElement;
      if (input && input.classList && input.classList.contains('uV2eYG_input')) {
        if (Date.now() - lastInputTap > 600) input.blur();
      }
    }

    /* Anchor small button popovers (menu / listbox) above their trigger instead
       of letting the mobile-fix center them on screen. We DO NOT touch
       [role="dialog"]: dialogs are sheets / side panels / archive overlays /
       confirmations that the product positions on its own. Resizing/relocating
       a full-height archive sheet with this rule pinned it to the top of the
       viewport and rendered it non-interactive (rect 0x0 / clipped). */
    var lastPopupTrigger = null;
    function onButtonPointerDown(e) {
      if (!mobileOnly()) return;
      var t = e.target && e.target.closest ? e.target.closest('button') : null;
      if (t) lastPopupTrigger = t;
    }
    function positionOpenPopup() {
      if (!mobileOnly()) return;
      var popup = document.querySelector('[role="menu"], [role="listbox"]');
      if (!popup) return;   /* don't clobber lastPopupTrigger here — it may be set
                                just before the popup mounts; a stale trigger is
                                only ever overwritten by a new button pointerdown */
      if (!lastPopupTrigger || !lastPopupTrigger.isConnected) return;
      var vw = window.innerWidth, vh = window.innerHeight;
      /* Skip naturally full-screen panels (e.g. menu/listbox wrapped by a sheet
         wrapper) — they must NOT be squeezed into a card above the button. */
      if (popup.offsetWidth >= vw * 0.9 && popup.offsetHeight >= vh * 0.9) return;
      var br = lastPopupTrigger.getBoundingClientRect();
      var avail = Math.max(140, vh - br.top - 16);   /* bounded height above button */
      var w = Math.min(360, vw - 16);
      var bottomPx = Math.max(0, vh - br.top + 8);
      var leftPx = Math.max(4, Math.min(br.left, vw - w - 4));
      popup.style.setProperty('position', 'fixed', 'important');
      popup.style.setProperty('left', leftPx + 'px', 'important');
      popup.style.setProperty('top', 'auto', 'important');
      popup.style.setProperty('bottom', bottomPx + 'px', 'important');
      popup.style.setProperty('right', 'auto', 'important');
      popup.style.setProperty('transform', 'none', 'important');
      popup.style.setProperty('z-index', '1300', 'important');
      popup.style.setProperty('min-width', w + 'px', 'important');
      popup.style.setProperty('width', w + 'px', 'important');
      popup.style.setProperty('max-height', avail + 'px', 'important');
      popup.style.setProperty('overflow-y', 'auto', 'important');
      popup.style.setProperty('box-sizing', 'border-box', 'important');
    }
    function schedulePopupPosition() {
      positionOpenPopup();
      setTimeout(positionOpenPopup, 120);
    }

    /* (dsh-token-viewer's backdrop-move bug is now fixed at the source: the
       plugin no longer reparents its backdrop, so this workaround is removed.) */

    function sync() { ensureMenuButton(); ensureUploadButton(); syncMenuVisibility(); schedulePopupPosition(); }

    function apply(ctx) {
      var tag = document.createElement('style');
      tag.dataset.plugin = "ds-mobile-skin"; tag.textContent = CSS; document.head.append(tag);
      var observer = new MutationObserver(sync);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-sidebar-collapsed'] });
      sync();
      document.addEventListener('pointerdown', onPointerDown, true);
      document.addEventListener('pointerdown', onButtonPointerDown, true);
      document.addEventListener('focusin', onFocusIn, true);
      ctx.effect(function () {
        return function () {
          tag.remove();
          observer.disconnect();
          document.removeEventListener('pointerdown', onPointerDown, true);
          document.removeEventListener('pointerdown', onButtonPointerDown, true);
          document.removeEventListener('focusin', onFocusIn, true);
        };
      });
    }

    exports.apply = apply;
    return module.exports;
  }
});
