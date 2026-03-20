(() => {
	const style = document.createElement("style");
	style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');
    body {
      position: relative;
      font-family: var(--ui-font, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif) !important;
      font-size: calc(16px * var(--ui-text-scale, 1));
      background-size: 160% 160%, 180% 180%, 180% 180%;
      animation: rtBgFlow var(--theme-motion-speed, 24s) ease-in-out infinite alternate;
    }
    body::before {
      content: "";
      position: fixed;
      inset: -18%;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(600px 420px at 18% 12%, var(--accent-2), transparent 70%),
        radial-gradient(720px 520px at 86% 22%, var(--accent-4), transparent 72%),
        radial-gradient(680px 460px at 48% 90%, var(--accent-3), transparent 72%);
      opacity: calc(0.12 + (var(--theme-glow-strength, 1) * 0.22));
      filter: blur(calc(28px + (var(--theme-glow-strength, 1) * 42px))) saturate(1.08);
      animation: rtGlowDrift var(--theme-motion-speed, 24s) ease-in-out infinite alternate;
      transform: translateZ(0);
    }
    body > * {
      position: relative;
      z-index: 1;
    }
    .settings-subtitle {
      margin: 14px 0 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 800;
    }
    .font-btn {
      border: 1px solid var(--border);
      border-radius: 12px;
      background: rgba(255,255,255,0.06);
      color: var(--text);
      cursor: pointer;
      text-align: left;
      padding: 10px 12px;
      font-weight: 600;
    }
    .font-btn.active {
      border-color: rgba(255,214,92,0.65);
      box-shadow: 0 0 0 2px rgba(255,214,92,0.16) inset;
    }
    .settings-toggle-btn,
    .settings-reset-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: rgba(255,255,255,0.06);
      color: var(--text);
      cursor: pointer;
      text-align: left;
      padding: 12px 14px;
      font-weight: 700;
    }
    .settings-toggle-btn.active {
      border-color: rgba(255,214,92,0.65);
      box-shadow: 0 0 0 2px rgba(255,214,92,0.16) inset;
    }
    .settings-toggle-copy,
    .settings-reset-copy {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .settings-toggle-note,
    .settings-reset-note {
      font-size: 12px;
      color: var(--muted);
      font-weight: 600;
    }
    .settings-toggle-state {
      flex: 0 0 auto;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.04em;
    }
    .settings-reset-btn {
      justify-content: center;
      background: rgba(255, 132, 132, 0.08);
    }
    .settings-reset-btn:hover {
      border-color: rgba(255, 168, 168, 0.45);
    }
    .nav {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex-wrap: nowrap !important;
      gap: 8px !important;
      overflow: hidden !important;
      white-space: nowrap !important;
    }
    .nav-left,
    .nav-right {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      flex-wrap: nowrap;
      white-space: nowrap;
    }
    .nav-left {
      flex: 1 1 auto;
      overflow: hidden;
    }
    .nav-right {
      flex: 1 1 auto;
      min-width: 0;
      justify-content: flex-end;
      overflow: hidden;
    }
    .nav .spacer {
      display: none !important;
    }
    .nav a {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      height: 2.5rem !important;
      min-width: fit-content !important;
      max-width: 100%;
      width: auto !important;
      padding: 6px 10px !important;
      border-radius: 999px !important;
      white-space: nowrap;
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(255,255,255,0.14) !important;
      color: var(--text) !important;
      font-size: 0.85rem !important;
      line-height: 1.1;
      flex: 1 1 auto;
      flex-shrink: 1 !important;
      overflow: hidden;
    }
    .nav a .icon {
      flex: 0 0 auto;
      font-size: 14px;
      line-height: 1;
    }
    .nav a .label {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    @keyframes rtBgFlow {
      0% { background-position: 0% 0%, 100% 0%, 0% 50%; }
      50% { background-position: 60% 35%, 20% 95%, 70% 38%; }
      100% { background-position: 100% 20%, 0% 100%, 100% 65%; }
    }
    @keyframes rtGlowDrift {
      0% { transform: translate3d(-1.5%, -1%, 0) scale(1); }
      50% { transform: translate3d(1.2%, 1.6%, 0) scale(1.05); }
      100% { transform: translate3d(2%, -0.8%, 0) scale(1.08); }
    }
    .nav a.active {
      animation: rtActivePulse var(--theme-pulse-speed, 2.8s) ease-in-out infinite;
    }
    @keyframes rtActivePulse {
      0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.22) inset, 0 0 0 rgba(0,0,0,0); }
      50% { box-shadow: 0 0 0 1px rgba(255,255,255,0.3) inset, 0 0 18px rgba(126,245,255,0.26); }
    }
    .rt-reveal {
      opacity: 0;
      transform: translateY(10px);
      animation: rtReveal .45s ease forwards;
    }
    @keyframes rtReveal {
      to { opacity: 1; transform: translateY(0); }
    }
    body.page-leaving main {
      opacity: 0;
      transform: translateY(8px);
      transition: opacity .16s ease, transform .16s ease;
    }
    :root[data-reduced-motion="1"] body,
    :root[data-reduced-motion="1"] body::before,
    :root[data-reduced-motion="1"] .nav a.active,
    :root[data-reduced-motion="1"] .rt-reveal {
      animation: none !important;
    }
    :root[data-reduced-motion="1"] body.page-leaving main,
    :root[data-reduced-motion="1"] .store-nudge,
    :root[data-reduced-motion="1"] * {
      scroll-behavior: auto !important;
    }
    :root[data-reduced-motion="1"] body.page-leaving main,
    :root[data-reduced-motion="1"] .store-nudge,
    :root[data-reduced-motion="1"] .nav a,
    :root[data-reduced-motion="1"] .btn,
    :root[data-reduced-motion="1"] .card,
    :root[data-reduced-motion="1"] .card-link {
      transition-duration: 0.01ms !important;
    }
    .theme-glow-wrap .volume-slider { accent-color: var(--accent-4); }
    .tab-shop {
      background: linear-gradient(135deg, rgba(80, 226, 255, 0.36), rgba(88, 255, 170, 0.34)) !important;
      border: 1px solid rgba(160, 245, 255, 0.55) !important;
      color: #e8fbff !important;
      box-shadow: 0 0 0 1px rgba(160, 245, 255, 0.18) inset, 0 0 18px rgba(68, 206, 255, 0.24);
      font-weight: 700 !important;
    }
    .tab-shop:hover {
      background: linear-gradient(135deg, rgba(95, 236, 255, 0.42), rgba(102, 255, 182, 0.4)) !important;
      box-shadow: 0 0 0 1px rgba(186, 249, 255, 0.35) inset, 0 0 24px rgba(68, 206, 255, 0.3);
    }
    .store-nudge {
      position: fixed;
      z-index: 130;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid rgba(132, 255, 186, 0.62);
      background:
        linear-gradient(145deg, rgba(8, 24, 30, 0.95), rgba(9, 20, 36, 0.94));
      color: #ffffff;
      font-size: 12px;
      font-weight: 800;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      pointer-events: none;
      opacity: 0;
      transform: translateY(8px) scale(0.98);
      box-shadow:
        0 10px 28px rgba(0, 0, 0, 0.42),
        0 0 0 1px rgba(140, 255, 190, 0.16) inset,
        0 0 26px rgba(72, 255, 168, 0.28);
      transition: opacity 0.22s ease, transform 0.22s ease;
      white-space: nowrap;
      backdrop-filter: blur(8px);
    }
    .store-nudge.show {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .store-nudge::after {
      content: "";
      position: absolute;
      right: 20px;
      bottom: 100%;
      border: 7px solid transparent;
      border-bottom-color: rgba(9, 20, 36, 0.94);
    }
    .settings-modal {
      align-items: flex-start !important;
      overflow: hidden !important;
      padding-top: 14px !important;
      padding-bottom: 14px !important;
    }
    .settings-panel {
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 28px) !important;
      overflow: hidden !important;
      margin: 0 auto !important;
      scrollbar-width: thin;
      scroll-padding-top: 64px;
      position: relative;
    }
    .settings-body {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 2px;
    }
    .settings-head {
      position: relative;
      z-index: 12;
      background: var(--card);
      padding-top: 2px;
      padding-bottom: 8px;
      margin-bottom: 12px !important;
      border-bottom: 1px solid var(--border);
    }
    .settings-head h2 {
      margin: 0 !important;
      line-height: 1.2;
    }
    @media (max-width: 760px) {
      .nav {
        padding-left: 10px !important;
        padding-right: 10px !important;
        gap: 6px !important;
      }
      .nav-left,
      .nav-right {
        gap: 6px !important;
      }
      .nav a {
        min-width: 0 !important;
        width: auto !important;
        padding: 6px 10px !important;
        height: 2.25rem !important;
        font-size: 0.85rem !important;
        flex-shrink: 1 !important;
      }
      .settings-modal {
        padding: 8px !important;
      }
      .settings-panel {
        max-height: calc(100vh - 16px) !important;
        border-radius: 14px !important;
      }
    }
  `;
	document.head.appendChild(style);

	function normalizeActiveNav() {
		const page = (
			location.pathname.split("/").pop() || "index.html"
		).toLowerCase();
		document.querySelectorAll(".nav a").forEach((a) => {
			const href = (a.getAttribute("href") || "").toLowerCase();
			if (!href || href.startsWith("http") || href.startsWith("#")) return;
			if (href === page) a.classList.add("active");
			else if (a.id !== "open-settings" && a.id !== "open-help")
				a.classList.remove("active");
		});
		const storeBtn = document.querySelector(".nav a.tab-shop");
		if (storeBtn) storeBtn.textContent = "\u{1F6D2} Store";
	}

	function splitIconLabel(a) {
		if (!a || a.querySelector(".icon")) return;
		const raw = (a.textContent || "").trim().replace(/\s+/g, " ");
		if (!raw) return;
		const parts = raw.split(" ");
		const first = parts[0] || "";
		const hasEmoji = /[\u2190-\u2BFF\u{1F000}-\u{1FAFF}]/u.test(first);
		const icon = hasEmoji ? first : "";
		let label = hasEmoji ? parts.slice(1).join(" ") : raw;

		a.textContent = "";
		const i = document.createElement("span");
		i.className = "icon";
		i.textContent = icon || "\u2022";
		const l = document.createElement("span");
		l.className = "label";
		l.textContent = label;
		a.appendChild(i);
		a.appendChild(l);
	}

	function enhanceNavLayout() {
		const nav = document.querySelector("header .nav");
		if (!nav) return;

		if (!nav.querySelector(".nav-left") || !nav.querySelector(".nav-right")) {
			const left = document.createElement("div");
			left.className = "nav-left";
			const right = document.createElement("div");
			right.className = "nav-right";

			const brand = nav.querySelector(".brand");
			if (brand) left.appendChild(brand);

			const anchors = Array.from(nav.querySelectorAll("a"));
			anchors.forEach((a) => {
				const cls = a.className || "";
				if (
					cls.includes("tab-settings") ||
					cls.includes("tab-help") ||
					cls.includes("tab-shop")
				) {
					right.appendChild(a);
				} else {
					left.appendChild(a);
				}
			});

			nav.innerHTML = "";
			nav.appendChild(left);
			nav.appendChild(right);
		}

		nav.querySelectorAll("a").forEach(splitIconLabel);
	}

	function staggerReveal() {
		const items = Array.from(
			document.querySelectorAll(".hero, .card, .card-link"),
		);
		items.forEach((el, idx) => {
			if (el.classList.contains("rt-reveal")) return;
			el.classList.add("rt-reveal");
			el.style.animationDelay = Math.min(idx * 0.045, 0.65) + "s";
		});
	}

	function wirePageTransition() {
		document.addEventListener(
			"click",
			(e) => {
				const a = e.target.closest("a[href]");
				if (!a) return;
				if (a.target && a.target !== "_self") return;
				if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
					return;
				const raw = a.getAttribute("href") || "";
				if (
					!raw ||
					raw.startsWith("#") ||
					raw.startsWith("http") ||
					raw.startsWith("mailto:") ||
					raw.startsWith("tel:")
				)
					return;
				if (raw.includes(".gg/@")) return;
				const to = new URL(raw, location.href);
				if (to.origin !== location.origin) return;
				e.preventDefault();
				document.body.classList.add("page-leaving");
				setTimeout(() => {
					location.href = to.href;
				}, 140);
			},
			true,
		);
	}

	function enhanceHomeCarousel() {
		const slides = Array.from(document.querySelectorAll("#slides .slide"));
		const prev = document.getElementById("slide-prev");
		const next = document.getElementById("slide-next");
		if (!slides.length || !prev || !next) return;

		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft") prev.click();
			else if (e.key === "ArrowRight") next.click();
		});

		let touchStartX = 0;
		let touchStartY = 0;
		const zone = document.getElementById("slides");
		zone.addEventListener(
			"touchstart",
			(e) => {
				const t = e.changedTouches[0];
				touchStartX = t.clientX;
				touchStartY = t.clientY;
			},
			{ passive: true },
		);
		zone.addEventListener(
			"touchend",
			(e) => {
				const t = e.changedTouches[0];
				const dx = t.clientX - touchStartX;
				const dy = t.clientY - touchStartY;
				if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
					if (dx > 0) prev.click();
					else next.click();
				}
			},
			{ passive: true },
		);
	}

	function enhanceStoreNudge() {
		const storeBtn = document.querySelector(".nav a.tab-shop");
		if (storeBtn) storeBtn.textContent = "\u{1F6D2} Store";
		const nudge = document.getElementById("store-nudge");
		if (nudge) nudge.remove();
	}

	function enhanceSettings() {
		const panel = document.querySelector("#settings-modal .settings-panel");
		if (!panel || panel.querySelector("#theme-glow")) return;
		const tm = window.ThemeManager;
		if (!tm || typeof tm.getGlowIntensity !== "function") return;
		const title = panel.querySelector(".settings-head h2");
		if (title) title.textContent = "\u{1F39B}\uFE0F Theme Studio";
		const head = panel.querySelector(".settings-head");
		let body = panel.querySelector(".settings-body");
		if (!body) {
			body = document.createElement("div");
			body.className = "settings-body";
			if (head) {
				while (head.nextSibling) body.appendChild(head.nextSibling);
			} else {
				while (panel.firstChild) body.appendChild(panel.firstChild);
			}
			panel.appendChild(body);
		}
		const soundTitle = Array.from(body.querySelectorAll("h3")).find((h) =>
			/sound preset/i.test(h.textContent || ""),
		);
		if (soundTitle) soundTitle.innerHTML = "\u{1F3B5} Sound Preset";

		const wrap = document.createElement("div");
		wrap.className = "volume-wrap theme-glow-wrap";
		wrap.innerHTML =
			'<div class="volume-head"><span>&#10024; Theme Glow</span><span id="theme-glow-value">100%</span></div><input id="theme-glow" class="volume-slider" type="range" min="30" max="200" step="1" value="100" aria-label="Theme Glow Intensity">';
		body.appendChild(wrap);

		const slider = wrap.querySelector("#theme-glow");
		const out = wrap.querySelector("#theme-glow-value");
		const current = Math.round(
			(tm.getGlowIntensity ? tm.getGlowIntensity() : 1) * 100,
		);
		slider.value = String(current);
		out.textContent = current + "%";

		slider.addEventListener("input", () => {
			const next = Math.max(
				30,
				Math.min(200, Number.parseInt(slider.value || "100", 10)),
			);
			out.textContent = next + "%";
			if (tm.setGlowIntensity) tm.setGlowIntensity(next / 100);
		});

		if (!body.querySelector("#font-grid") && tm.fonts) {
			const fontHead = document.createElement("h3");
			fontHead.className = "settings-subtitle";
			fontHead.textContent = "\u{1F170}\uFE0F Text Font";
			body.appendChild(fontHead);

			const fontGrid = document.createElement("div");
			fontGrid.id = "font-grid";
			fontGrid.className = "settings-grid";
			body.appendChild(fontGrid);

			function setFontActive(id) {
				fontGrid.querySelectorAll(".font-btn").forEach((el) => {
					el.classList.toggle("active", el.getAttribute("data-font-id") === id);
				});
			}

			Object.keys(tm.fonts).forEach((id) => {
				const f = tm.fonts[id];
				const b = document.createElement("button");
				b.type = "button";
				b.className = "font-btn";
				b.setAttribute("data-font-id", id);
				b.textContent = f.label;
				b.style.fontFamily = f.stack;
				b.addEventListener("click", () => {
					if (tm.setFont) tm.setFont(id);
					setFontActive(id);
				});
				fontGrid.appendChild(b);
			});
			setFontActive(tm.getCurrentFont ? tm.getCurrentFont() : "modern");
		}

		if (!body.querySelector("#text-scale")) {
			const scaleWrap = document.createElement("div");
			scaleWrap.className = "volume-wrap";
			scaleWrap.innerHTML =
				'<div class="volume-head"><span>&#128270; Text Scale</span><span id="text-scale-value">85%</span></div><input id="text-scale" class="volume-slider" type="range" min="75" max="105" step="1" value="85" aria-label="Text Scale">';
			body.appendChild(scaleWrap);

			const scaleSlider = scaleWrap.querySelector("#text-scale");
			const scaleValue = scaleWrap.querySelector("#text-scale-value");
			const startScale = Math.round(
				(tm.getTextScale ? tm.getTextScale() : 0.85) * 100,
			);
			scaleSlider.value = String(startScale);
			scaleValue.textContent = startScale + "%";
			scaleSlider.addEventListener("input", () => {
				const next = Math.max(
					75,
					Math.min(105, Number.parseInt(scaleSlider.value || "85", 10)),
				);
				scaleValue.textContent = next + "%";
				if (tm.setTextScale) tm.setTextScale(next / 100);
			});
		}

		if (!body.querySelector("#reduced-motion-toggle")) {
			const motionHead = document.createElement("h3");
			motionHead.className = "settings-subtitle";
			motionHead.textContent = "\u26A1 Motion";
			body.appendChild(motionHead);

			const motionBtn = document.createElement("button");
			motionBtn.type = "button";
			motionBtn.id = "reduced-motion-toggle";
			motionBtn.className = "settings-toggle-btn";
			body.appendChild(motionBtn);

			function renderReducedMotionButton() {
				const enabled = tm.getReducedMotion ? tm.getReducedMotion() : false;
				motionBtn.classList.toggle("active", enabled);
				motionBtn.innerHTML = `
					<span class="settings-toggle-copy">
						<span>Reduce Motion</span>
						<span class="settings-toggle-note">Turns down animated backgrounds and motion-heavy effects.</span>
					</span>
					<span class="settings-toggle-state">${enabled ? "ON" : "OFF"}</span>
				`;
			}

			motionBtn.addEventListener("click", () => {
				if (tm.setReducedMotion) tm.setReducedMotion(!(tm.getReducedMotion && tm.getReducedMotion()));
				renderReducedMotionButton();
			});

			renderReducedMotionButton();
		}

		if (!body.querySelector("#settings-reset-btn")) {
			const resetBtn = document.createElement("button");
			resetBtn.type = "button";
			resetBtn.id = "settings-reset-btn";
			resetBtn.className = "settings-reset-btn";
			resetBtn.innerHTML = `
				<span class="settings-reset-copy">
					<span>Reset Settings</span>
					<span class="settings-reset-note">Restore theme, sound, motion, font, and text size defaults on this browser.</span>
				</span>
			`;
			resetBtn.addEventListener("click", () => {
				if (tm.resetSettings) tm.resetSettings();
				if (window.UISounds) {
					if (window.UISounds.setPreset) window.UISounds.setPreset("soft");
					if (window.UISounds.setMasterVolume) window.UISounds.setMasterVolume(0.5);
					if (window.UISounds.unmute) window.UISounds.unmute();
				}
				const glowSlider = body.querySelector("#theme-glow");
				const glowValue = body.querySelector("#theme-glow-value");
				if (glowSlider) glowSlider.value = "100";
				if (glowValue) glowValue.textContent = "100%";
				const scaleSlider = body.querySelector("#text-scale");
				const scaleValue = body.querySelector("#text-scale-value");
				if (scaleSlider) scaleSlider.value = "85";
				if (scaleValue) scaleValue.textContent = "85%";
				const soundVolume = body.querySelector("#sound-volume");
				const soundVolumeValue = body.querySelector("#sound-volume-value");
				if (soundVolume) soundVolume.value = "50";
				if (soundVolumeValue) soundVolumeValue.textContent = "50%";
				const soundGrid = body.querySelector("#sound-grid");
				if (soundGrid) {
					soundGrid.querySelectorAll(".sound-btn").forEach((el) => {
						el.classList.toggle("active", el.getAttribute("data-sound-id") === "soft");
					});
				}
				const fontGrid = body.querySelector("#font-grid");
				if (fontGrid) {
					fontGrid.querySelectorAll(".font-btn").forEach((el) => {
						el.classList.toggle("active", el.getAttribute("data-font-id") === "modern");
					});
				}
				const motionBtn = body.querySelector("#reduced-motion-toggle");
				if (motionBtn && tm.getReducedMotion) {
					motionBtn.classList.toggle("active", tm.getReducedMotion());
					const state = motionBtn.querySelector(".settings-toggle-state");
					if (state) state.textContent = tm.getReducedMotion() ? "ON" : "OFF";
				}
			});
			body.appendChild(resetBtn);
		}
	}

	function run() {
		enhanceNavLayout();
		normalizeActiveNav();
		staggerReveal();
		wirePageTransition();
		enhanceHomeCarousel();
		enhanceSettings();
		enhanceStoreNudge();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", run, { once: true });
	} else {
		run();
	}
})();
