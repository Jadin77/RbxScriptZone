(() => {
	const page = (
		location.pathname.split("/").pop() || "index.html"
	).toLowerCase();
	const map = {
		"index.html": "content/home.json",
		"roblox-scripts.html": "content/roblox-scripts.json",
		"programs.html": "content/programs.json",
		"socials.html": "content/socials.json",
	};
	const HOME_PULSE_SOURCE = "content/home-pulse.json";

	const source = map[page];
	if (!source) return;

	function esc(s) {
		return String(s || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	async function getJson(url) {
		const r = await fetch(url + "?v=" + Date.now(), { cache: "no-store" });
		if (!r.ok) throw new Error("HTTP " + r.status);
		return r.json();
	}

	function shuffle(list) {
		const copy = Array.from(list || []);
		for (let i = copy.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			const tmp = copy[i];
			copy[i] = copy[j];
			copy[j] = tmp;
		}
		return copy;
	}

	function isPlaceholderText(value) {
		const text = String(value || "").toLowerCase();
		return (
			!text ||
			text.includes("coming soon") ||
			text.includes("add details") ||
			text.includes("proof, and feature list") ||
			text === "coming soon."
		);
	}

	function scoreHomeItem(item) {
		let score = 0;
		if (item.image) score += 4;
		if (item.href && item.href !== "#") score += 2;
		if (!isPlaceholderText(item.text)) score += 3;
		if (item.page !== "Studio") score += 1;
		if (item.comingSoon) score -= 3;
		return score;
	}

	async function buildHomePool() {
		const sources = [
			{ page: "Scripts", href: "roblox-scripts.html", source: map["roblox-scripts.html"] },
			{ page: "Executors", href: "programs.html", source: map["programs.html"] },
			{ page: "Free Picks", href: "free-scripts.html", source: null },
		];
		const results = await Promise.all(
			sources.map((entry) =>
				entry.source === null
					? Promise.resolve({ entry, json: { items: [] } })
					:
				getJson(entry.source)
					.then((json) => ({ entry, json }))
					.catch(() => null),
			),
		);
		const items = [];
		results.forEach((result) => {
			if (!result || !Array.isArray(result.json.items)) return;
			result.json.items.forEach((item) => {
				const showcase = item.showcase || {};
				const text = showcase.description || item.description || "";
				const image =
					item.image ||
					(Array.isArray(showcase.gallery) && showcase.gallery[0]) ||
					"";
				const href =
					result.entry.page === "Executors"
						? result.entry.href
						: item.link && item.link !== "#"
							? item.link
							: result.entry.href;
				items.push({
					title: item.title || result.entry.page,
					kicker: item.tab ? result.entry.page + " â€¢ " + item.tab : result.entry.page + " â€¢ Featured",
					text,
					cta:
						result.entry.page === "Executors" ? "Open Executors Page" : "View Details",
					href,
					image,
					imageLabel: item.title || result.entry.page,
					tags: [result.entry.page, item.tab || (item.showcase ? "Showcase" : "Featured")],
					page: result.entry.page,
					comingSoon: isPlaceholderText(text) || isPlaceholderText(item.title),
				});
			});
		});
		return items.sort((a, b) => scoreHomeItem(b) - scoreHomeItem(a));
	}

	function renderHero(data) {
		const hero = data.hero || {};
		const title = document.getElementById("home-hero-title");
		const badge = document.getElementById("home-hero-badge");
		const text = document.getElementById("home-hero-text");
		const primary = document.getElementById("home-cta-primary");
		const secondary = document.getElementById("home-cta-secondary");
		const chips = document.getElementById("home-hero-chips");
		const stats = document.getElementById("home-stats");

		if (title && hero.title) title.textContent = hero.title;
		if (badge && hero.badge) badge.textContent = hero.badge;
		if (text && hero.text) text.textContent = hero.text;
		if (primary && hero.primaryCta) {
			primary.textContent = hero.primaryCta.label || "Open";
			primary.href = hero.primaryCta.href || "#";
		}
		if (secondary && hero.secondaryCta) {
			secondary.textContent = hero.secondaryCta.label || "Open";
			secondary.href = hero.secondaryCta.href || "#";
		}
		if (chips && Array.isArray(hero.chips) && hero.chips.length) {
			chips.innerHTML = hero.chips
				.map(
					(chip) =>
						'<div class="hero-chip"><strong>' +
						esc(chip.title || "") +
						"</strong>" +
						esc(chip.text || "") +
						"</div>",
				)
				.join("");
		}
		if (stats && Array.isArray(data.stats) && data.stats.length) {
			stats.innerHTML = data.stats
				.map(
					(stat) =>
						'<div class="stat-card"><strong>' +
						esc(stat.value || "") +
						"</strong><span>" +
						esc(stat.label || "") +
						"</span></div>",
				)
				.join("");
		}
	}

	function formatVisitCount(value) {
		const n = Number.parseInt(value, 10);
		if (!Number.isFinite(n) || n < 0) return "0";
		return new Intl.NumberFormat("en-US").format(n);
	}

	function formatUpdatedText(stamp) {
		if (!stamp) return "Updated today";
		let ts = null;
		try {
			ts = new Date(stamp);
		} catch (_) {
			ts = null;
		}
		if (!ts || Number.isNaN(ts.getTime())) return "Updated today";

		const diffMs = Date.now() - ts.getTime();
		if (!Number.isFinite(diffMs) || diffMs < 0) return "Updated today";
		const diffMinutes = Math.floor(diffMs / 60000);
		if (diffMinutes < 1) return "Updated just now";
		if (diffMinutes < 60) return "Updated " + diffMinutes + " mins ago";
		const diffHours = Math.floor(diffMinutes / 60);
		if (diffHours < 24) return "Updated " + diffHours + " hrs ago";
		return "Updated today";
	}

	function formatEasternTime(stamp) {
		if (!stamp) return "Eastern Time";
		let ts = null;
		try {
			ts = new Date(stamp);
		} catch (_) {
			ts = null;
		}
		if (!ts || Number.isNaN(ts.getTime())) return "Eastern Time";
		return new Intl.DateTimeFormat("en-US", {
			timeZone: "America/New_York",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			month: "short",
			day: "numeric",
		}).format(ts) + " ET";
	}

	function renderPulseStats(data, pulse) {
		const stats = document.getElementById("home-stats");
		if (!stats) return;

		const fallback = Array.isArray(data.stats) ? data.stats : [];
		const visitFallback = fallback[0] || { value: "0", label: "Visits" };
		const updatedFallback = fallback[1] || { value: "Updated today", label: "Updated" };
		const trendingFallback = fallback[2] || { value: "Scripts", label: "Trending now" };

		const visitValue = pulse ? formatVisitCount(pulse.visitCount) : esc(visitFallback.value || "0");
		const updatedValue = pulse
			? formatUpdatedText(pulse.lastContentUpdateAt || pulse.lastPulseUpdateAt)
			: esc(updatedFallback.value || "Updated today");
		const updatedLabel = pulse
			? esc(formatEasternTime(pulse.lastContentUpdateAt || pulse.lastPulseUpdateAt))
			: "Updated";
		const trendingValue = pulse && pulse.trendingLabel
			? esc(pulse.trendingLabel)
			: esc(trendingFallback.value || "Scripts");
		const trendingHrefMap = {
			"Scripts": "roblox-scripts.html",
			"Executors": "programs.html",
			"Free Picks": "free-scripts.html",
		};
		const trendingHref = pulse && pulse.trendingLabel && trendingHrefMap[pulse.trendingLabel]
			? trendingHrefMap[pulse.trendingLabel]
			: "roblox-scripts.html";

		stats.innerHTML = [
			'<div class="stat-card"><strong>' + visitValue + "</strong><span>Visits</span></div>",
			'<div class="stat-card"><strong>' + updatedValue + "</strong><span>" + updatedLabel + "</span></div>",
			'<a class="stat-card stat-link" href="' + esc(trendingHref) + '"><strong>' + trendingValue + "</strong><span>Trending now</span></a>",
		].join("");
	}

	function renderWhyUse(data) {
		const grid = document.getElementById("home-quick-grid");
		const section = data && data.whyUseSection;
		if (!grid || !section || !Array.isArray(section.items) || !section.items.length) return;
		const title = document.getElementById("home-why-title");
		const text = document.getElementById("home-why-text");
		if (title && section.title) title.textContent = section.title;
		if (text && section.text) text.textContent = section.text;
		grid.innerHTML = section.items
			.map(
				(item) =>
					'<article class="quick-card why-card"><div class="quick-content"><span class="quick-badge">' +
					esc(item.badge || "") +
					"</span><h3>" +
					esc(item.title || "") +
					"</h3><p>" +
					esc(item.text || "") +
					"</p></div></article>",
			)
			.join("");
	}

	function renderSpotlights(items) {
		const grid = document.getElementById("home-spotlights");
		if (!grid) return;
		grid.innerHTML = items
			.map(
				(item) =>
					'<a class="spotlight-card" href="' +
					esc(item.href || "#") +
					'"><div class="spotlight-media" style="background-image:url(\'' +
					esc(item.image || "") +
					'\');"></div><div class="spotlight-content"><span class="spotlight-badge">' +
					esc(item.page || "Featured") +
					"</span><h3>" +
					esc(item.title || "") +
					"</h3><p>" +
					esc(item.text || "") +
					'</p><span class="spotlight-meta">' +
					esc((item.tags && item.tags[1]) || "Open") +
					"</span></div></a>",
			)
			.join("");
	}

	function renderPills(data) {
		const list = document.getElementById("home-pill-list");
		if (!list || !Array.isArray(data.pillItems)) return;
		list.innerHTML = data.pillItems
			.map((item) => '<span class="home-pill">' + esc(item) + "</span>")
			.join("");
	}

	function renderComingSoon(data, pool) {
		const grid = document.getElementById("home-coming-grid");
		if (!grid) return;
		const items = Array.isArray(data.comingSoon) ? data.comingSoon.slice(0, 3) : [];
		if (items.length < 3) {
			pool
				.filter((item) => item.comingSoon)
				.slice(0, 3 - items.length)
				.forEach((item) => {
					items.push({
						title: item.title,
						text: item.text || "More details are still being filled in.",
					});
				});
		}
		grid.innerHTML = items
			.map(
				(item) =>
					'<article class="coming-card"><strong>' +
					esc(item.title || "") +
					"</strong><p>" +
					esc(item.text || "") +
					"</p></article>",
			)
			.join("");
	}

	function renderSlides(slidesData) {
		const slidesWrap = document.getElementById("slides");
		if (!slidesWrap || !Array.isArray(slidesData) || !slidesData.length) return;
		const existingSlides = Array.from(slidesWrap.querySelectorAll(".slide"));
		if (existingSlides.length !== slidesData.length) return;
		slidesData.forEach((s, i) => {
			const slide = existingSlides[i];
			if (!slide) return;
			const href = esc(s.href || "#");
			const title = esc(s.title || "Featured");
			const kicker = esc(s.kicker || "FEATURED");
			const text = esc(s.text || "");
			const cta = esc(s.cta || "Open");
			const img = esc(s.image || "");
			const label = esc(s.imageLabel || title);
			const tags = Array.isArray(s.tags) ? s.tags : [];

			slide.setAttribute("href", href);
			slide.setAttribute("data-index", String(i));
			slide.classList.toggle("active", i === 0);

			const imageEl = slide.querySelector(".slide-image");
			if (imageEl) {
				imageEl.textContent = label;
				imageEl.style.backgroundImage = img ? "url('" + img + "')" : "";
				imageEl.style.backgroundSize = img ? "cover" : "";
				imageEl.style.backgroundPosition = img ? "center" : "";
				imageEl.style.border = "1px solid var(--border)";
			}

			const kickerEl = slide.querySelector(".slide-kicker");
			const titleEl = slide.querySelector("h2");
			const textEl = slide.querySelector("p");
			const ctaEl = slide.querySelector(".slide-cta");
			const tagsEl = slide.querySelector(".slide-tags");
			if (kickerEl) kickerEl.textContent = kicker;
			if (titleEl) titleEl.textContent = title;
			if (textEl) textEl.textContent = text;
			if (ctaEl) ctaEl.textContent = cta;
			if (tagsEl) {
				tagsEl.innerHTML = tags
					.map((tag) => '<span class="slide-tag">' + esc(tag) + "</span>")
					.join("");
			}
		});
	}

	async function renderHome(data) {
		renderHero(data);
		let pulse = null;
		try {
			pulse = await getJson(HOME_PULSE_SOURCE);
		} catch (_) {
			pulse = null;
		}
		renderPulseStats(data, pulse);
		renderWhyUse(data);
		renderPills(data);

		let pool = [];
		try {
			pool = await buildHomePool();
		} catch (_) {
			pool = [];
		}

		const strong = pool.filter((item) => !item.comingSoon);
		const backup = pool.filter((item) => item.comingSoon);
		const randomizedStrong = shuffle(strong);
		const randomizedBackup = shuffle(backup);
		const homeSlides = randomizedStrong.slice(0, 3);
		while (homeSlides.length < 3 && randomizedBackup.length) {
			homeSlides.push(randomizedBackup.shift());
		}
		while (homeSlides.length < 3 && Array.isArray(data.slides) && data.slides[homeSlides.length]) {
			homeSlides.push(data.slides[homeSlides.length]);
		}

		renderSlides(homeSlides);
		renderSpotlights(randomizedStrong.slice(3, 6));
		renderComingSoon(data, randomizedBackup);
	}

	function renderGridPage(data) {
		const heroText = document.querySelector(".hero p");
		if (heroText && data.heroDescription)
			heroText.textContent = data.heroDescription;

		const grid = document.querySelector("main .grid");
		if (!grid || !Array.isArray(data.items) || !data.items.length) return;

		// Inject showcase modal if not exists
		if (!document.getElementById("showcase-modal")) {
			const modalHtml = `
        <div id="showcase-modal" class="settings-modal" aria-hidden="true">
          <section class="settings-panel" style="max-width: 800px;">
            <div class="settings-head">
              <h2 id="showcase-title" style="margin:0;">Product</h2>
              <button id="close-showcase" class="btn ghost" type="button">Close</button>
            </div>
            <div id="showcase-scroll-body" style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px; max-height: 65vh; overflow-y: scroll; overflow-x: hidden; padding-right: 8px; scrollbar-width: thick; scrollbar-color: rgba(255,255,255,0.4) rgba(0,0,0,0.2);">
              <div id="showcase-gallery" style="width: 100%; flex-shrink: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: rgba(0,0,0,0.2);"></div>
              <p id="showcase-desc" style="color: var(--muted); line-height: 1.5; margin: 0;"></p>
              <div id="showcase-features" style="display: flex; flex-direction: column; gap: 8px;"></div>
              <div id="showcase-script-container" style="display: none; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: 700; color: var(--text); font-size: 14px;">Script Here</span>
                  <button id="showcase-copy-btn" class="btn" style="padding: 5px 12px; font-size: 12px; cursor: pointer;">Copy</button>
                </div>
                <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 6px; overflow-x: auto;">
                  <code id="showcase-script-code" style="color: #a7ff92; font-family: monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;"></code>
                </div>
              </div>
              <a id="showcase-buy" class="btn" href="#" target="_blank" style="text-align: center; margin-top: 8px; font-size: 16px; padding: 12px; background: linear-gradient(135deg, var(--accent-3), #2bdc7e); color: #000; box-shadow: 0 0 15px rgba(124, 255, 107, 0.4);">Get It Now</a>
            </div>
          </section>
        </div>
      `;
			document.body.insertAdjacentHTML("beforeend", modalHtml);

			const modal = document.getElementById("showcase-modal");
			const closeBtn = document.getElementById("close-showcase");

			closeBtn.addEventListener("click", () => {
				modal.classList.remove("open");
				modal.setAttribute("aria-hidden", "true");
			});
			modal.addEventListener("click", (e) => {
				if (e.target === modal) closeBtn.click();
			});
		}

		// Inject tab bar if tabs defined
		if (Array.isArray(data.tabs) && data.tabs.length > 0) {
			let tabBar = document.getElementById("sc-tab-bar");
			if (!tabBar) {
				tabBar = document.createElement("div");
				tabBar.id = "sc-tab-bar";
				tabBar.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;";
				grid.parentNode.insertBefore(tabBar, grid);
			}
			tabBar.innerHTML = data.tabs.map((t, i) => {
				const active = i === 0 ? "sc-tab-active" : "";
				return '<button class="sc-tab ' + active + '" data-tab="' + esc(t) + '" style="' +
					'padding:8px 20px;border-radius:999px;border:1.5px solid ' +
					(i === 0 ? "var(--accent)" : "rgba(255,255,255,0.15)") +
					';background:' + (i === 0 ? "rgba(255,122,0,0.12)" : "rgba(255,255,255,0.04)") +
					';color:' + (i === 0 ? "var(--accent)" : "var(--muted)") +
					';font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;">' +
					esc(t) + '</button>';
			}).join("");

			tabBar.querySelectorAll(".sc-tab").forEach(btn => {
				btn.addEventListener("click", function () {
					tabBar.querySelectorAll(".sc-tab").forEach(b => {
						b.style.borderColor = "rgba(255,255,255,0.15)";
						b.style.background = "rgba(255,255,255,0.04)";
						b.style.color = "var(--muted)";
					});
					this.style.borderColor = "var(--accent)";
					this.style.background = "rgba(255,122,0,0.12)";
					this.style.color = "var(--accent)";
					const activeTab = this.getAttribute("data-tab");
					grid.querySelectorAll(".card").forEach(card => {
						card.style.display = card.getAttribute("data-tab") === activeTab ? "" : "none";
					});
				});
			});
		}

		const firstTab = (Array.isArray(data.tabs) && data.tabs.length > 0) ? data.tabs[0] : null;

		function socialCoverMarkup(item, title, img) {
			const coverType = String(item.coverType || "").toLowerCase();
			if (img) {
				return '<div class="social-cover ' + esc(coverType || "video") + '"><img src="' + img + '" alt="' + title + '" loading="lazy"></div>';
			}

			let icon =
				'<span class="social-cover-icon social-symbol">&#128279;</span>';
			let badge = "Link";
			let coverTitle = title;
			let subtitle = "";
			if (coverType === "discord") {
				icon = '<span class="social-cover-icon discord-icon"><img src="images/socials/discord.svg" alt=""></span>';
				badge = "Discord";
				coverTitle = "Join Up";
				subtitle = "Server access, updates, and direct support";
			} else if (coverType === "youtube") {
				icon =
					'<span class="social-cover-icon social-symbol youtube-symbol">&#9654;</span>';
				badge = "YouTube";
				coverTitle = "Watch";
				subtitle = "Uploads, showcases, and future tutorials";
			} else if (coverType === "key") {
				icon =
					'<span class="social-cover-icon social-symbol key-symbol">&#128273;</span>';
				badge = "Key Link";
				coverTitle = "Direct Key";
				subtitle = "Fast access to the script key page";
			}

			return (
				'<div class="social-cover ' + esc(coverType) + '">' +
				'<div class="social-cover-fallback">' +
				'<span class="social-cover-badge">' + esc(badge) + '</span>' +
				(typeof icon === "string" && icon.startsWith("<") ? icon : '<div class="social-cover-icon">' + esc(icon) + '</div>') +
				'<div class="social-cover-title">' + esc(coverTitle) + '</div>' +
				'<div class="social-cover-subtitle">' + esc(subtitle) + '</div>' +
				"</div></div>"
			);
		}

		grid.innerHTML = data.items
			.map((it, i) => {
				const title = esc(it.title || "Item");
				const desc = esc(it.description || "");
				const img = esc(it.image || "");
				const link = esc(it.link || "#");
				const buttonLabel = esc(it.buttonLabel || "View Details");
				const openInNewTab = !!it.openInNewTab;
				const hasShowcase = it.showcase ? "true" : "false";
				const tabAttr = it.tab ? esc(it.tab) : "";
				const hidden = (firstTab && it.tab && it.tab !== firstTab) ? ' style="display:none"' : '';

				// Store showcase data safely in a global map
				window.__showcaseData = window.__showcaseData || {};
				window.__showcaseData[i] = it.showcase;

				// Special layout for Executors (programs.html)
				if (page === "programs.html") {
					const siteLink = esc(it.siteLink || "#");
					const discordLink = esc(it.discordLink || "#");
					return (
						'<article class="card" data-tab="' + tabAttr + '"' + hidden + '>' +
						'<div class="thumb"><img src="' + img + '" alt="' + title + '" loading="lazy"></div>' +
						'<h3>' + title + '</h3>' +
						'<p>' + desc + '</p>' +
						'<div class="card-actions">' +
						'<a class="btn" href="' + siteLink + '" target="_blank">Site Link</a>' +
						'<a class="btn btn-discord" href="' + discordLink + '" target="_blank">' +
						'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.156 2.419 0 1.334-.946 2.419-2.156 2.419zm7.974 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.156 2.419 0 1.334-.946 2.419-2.156 2.419z"/></svg> Discord</a>' +
						'</div>' +
						'</article>'
					);
				}

				if (page === "socials.html") {
					const classes = "card social-card" + (String(it.coverType || "").toLowerCase() === "video" ? " video-card" : "");
					return (
						'<article class="' + classes + '" data-tab="' + tabAttr + '"' + hidden + '>' +
						socialCoverMarkup(it, title, img) +
						'<div class="social-body"><h3>' + title + '</h3><p>' + desc + '</p>' +
						'<a class="btn showcase-trigger" href="' + link +
						(openInNewTab ? '" target="_blank" rel="noopener noreferrer' : "") +
						'" data-index="' + i +
						'" data-has-showcase="' + hasShowcase + '">' + buttonLabel + '</a></div>' +
						'</article>'
					);
				}

				return (
					'<article class="card" data-tab="' + tabAttr + '"' + hidden + '>' +
					'<div class="thumb"><img src="' + img + '" alt="' + title + '" loading="lazy"></div>' +
					'<h3>' + title + '</h3>' +
					'<p>' + desc + '</p>' +
					'<a class="btn showcase-trigger" href="' + link +
					(openInNewTab ? '" target="_blank" rel="noopener noreferrer' : "") +
					'" data-index="' + i +
					'" data-has-showcase="' + hasShowcase + '">' + buttonLabel + '</a>' +
					'</article>'
				);
			})
			.join("");

		grid.querySelectorAll(".showcase-trigger").forEach((btn) => {
			btn.addEventListener("click", function (e) {
				const hasShowcase = this.getAttribute("data-has-showcase") === "true";
				if (hasShowcase) {
					e.preventDefault();
					const idx = this.getAttribute("data-index");
					const showcase = window.__showcaseData[idx];
					if (showcase) {
						document.getElementById("showcase-title").textContent =
							showcase.title || "Product";
						document.getElementById("showcase-desc").textContent =
							showcase.description || "";

						const gallery = document.getElementById("showcase-gallery");
						gallery.innerHTML = "";
						
						if (showcase.video) {
							let videoId = "";
							if (showcase.video.includes("youtu.be/")) {
								videoId = showcase.video.split("youtu.be/")[1].split("?")[0];
							} else if (showcase.video.includes("youtube.com/watch")) {
								try { videoId = new URL(showcase.video).searchParams.get("v"); } catch(e) {}
							}
							
							if (videoId) {
								gallery.innerHTML = '<iframe width="100%" src="https://www.youtube.com/embed/' + esc(videoId) + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="display: block; aspect-ratio: 16/9; min-height: 240px; border: none;"></iframe>';
								gallery.style.display = "block";
							} else {
								gallery.style.display = "none";
							}
						} else if (showcase.gallery && showcase.gallery.length > 0) {
							gallery.innerHTML =
								'<img src="' +
								esc(showcase.gallery[0]) +
								'" style="width: 100%; height: 240px; display: block; object-fit: cover; color: transparent; background: #0c182a;" alt="Product Image Placeholder" onerror="this.onerror=null; this.src=\'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23081220%22%2F%3E%3Cpath%20d%3D%22M40%2035%20A%205%205%200%200%201%2045%2030%20L%2075%2030%20A%205%205%200%200%201%2080%2035%20L%2080%2065%20A%205%205%200%200%201%2075%2070%20L%2045%2070%20A%205%205%200%200%201%2040%2065%20Z%22%20fill%3D%22none%22%20stroke%3D%22%23445%22%20stroke-width%3D%222%22%2F%3E%3Cpath%20d%3D%22M40%2055%20L%2055%2045%20L%2080%2060%22%20fill%3D%22none%22%20stroke%3D%22%23445%22%20stroke-width%3D%222%22%20stroke-linejoin%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2252%22%20cy%3D%2240%22%20r%3D%223%22%20fill%3D%22%23445%22%2F%3E%3C%2Fsvg%3E\';" />';
							gallery.style.display = "block";
						} else {
							gallery.style.display = "none";
						}

						const featuresWrap = document.getElementById("showcase-features");
						if (showcase.features && showcase.features.length > 0) {
							featuresWrap.innerHTML =
								'<h3 style="margin: 0; font-size: 16px; color: var(--text);">Features</h3><ul style="margin: 0; padding-left: 20px; color: var(--muted);">' +
								showcase.features
									.map((f) => "<li>" + esc(f) + "</li>")
									.join("") +
								"</ul>";
							featuresWrap.style.display = "flex";
						} else {
							featuresWrap.style.display = "none";
						}

						const scriptContainer = document.getElementById("showcase-script-container");
						const scriptCode = document.getElementById("showcase-script-code");
						const copyBtn = document.getElementById("showcase-copy-btn");
						
						if (showcase.scriptCode) {
							scriptCode.textContent = showcase.scriptCode;
							scriptContainer.style.display = "block";
							
							const newCopyBtn = copyBtn.cloneNode(true);
							copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
							
							newCopyBtn.addEventListener("click", () => {
								navigator.clipboard.writeText(showcase.scriptCode).then(() => {
									newCopyBtn.textContent = "Copied!";
									newCopyBtn.style.background = "#2bdc7e";
									setTimeout(() => {
										newCopyBtn.textContent = "Copy";
										newCopyBtn.style.background = "var(--accent)";
									}, 2000);
								});
							});
						} else {
							scriptContainer.style.display = "none";
						}

						const buyBtn = document.getElementById("showcase-buy");
						if (showcase.buyLink && showcase.buyLink !== "#") {
							buyBtn.href = showcase.buyLink;
							buyBtn.target = "_blank";
							buyBtn.rel = "noopener noreferrer";
							buyBtn.textContent = showcase.buyLabel || "Get It Now";
							buyBtn.style.display = "block";
						} else {
							buyBtn.style.display = "none";
						}

						const modal = document.getElementById("showcase-modal");
						modal.classList.add("open");
						modal.setAttribute("aria-hidden", "false");
					}
				}
			});
		});
	}

	function run() {
		getJson(source)
			.then((data) => {
				if (page === "index.html") renderHome(data);
				else renderGridPage(data);
			})
			.catch(() => {
				// Keep fallback HTML if JSON is unavailable.
			});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", run, { once: true });
	} else {
		run();
	}
})();

