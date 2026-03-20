(() => {
	/* ── CSS ──────────────────────────────────────────────────────── */
	const css = document.createElement("style");
	css.textContent = `
    .help-discord-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid rgba(88,101,242,0.55);
      background: linear-gradient(135deg, rgba(88,101,242,0.28), rgba(88,101,242,0.14));
      color: #fff;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      transition: transform 0.16s ease, box-shadow 0.18s ease, background 0.18s ease;
      box-shadow: 0 0 0 1px rgba(88,101,242,0.18) inset;
      cursor: pointer;
    }
    .help-discord-btn:hover {
      transform: translateY(-2px);
      background: linear-gradient(135deg, rgba(88,101,242,0.42), rgba(88,101,242,0.24));
      box-shadow: 0 0 0 1px rgba(88,101,242,0.3) inset, 0 8px 22px rgba(88,101,242,0.26);
    }
    .help-discord-logo {
      width: 32px;
      height: 32px;
      flex: 0 0 32px;
      filter: drop-shadow(0 0 6px rgba(88,101,242,0.55));
    }
    .help-discord-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .help-discord-label {
      font-size: 15px;
      font-weight: 700;
    }
    .help-discord-sub {
      font-size: 11px;
      color: var(--muted);
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .help-divider {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 16px 0 14px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .help-divider::before,
    .help-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--border);
    }
    .help-form-area {
      width: 100%;
      min-height: 90px;
      max-height: 180px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.16);
      background: rgba(255,255,255,0.06);
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      outline: none;
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }
    .help-form-area::placeholder {
      color: rgba(199,210,224,0.72);
    }
    .help-form-area:focus {
      border-color: rgba(126,245,255,0.45);
      box-shadow: 0 0 0 2px rgba(126,245,255,0.12) inset;
    }
    .help-char-count {
      text-align: right;
      font-size: 11px;
      color: var(--muted);
      margin: 4px 2px 10px;
      font-weight: 600;
    }
    .help-char-count.over {
      color: #ff6b6b;
    }
    .help-send-btn {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(126,245,255,0.45);
      background: linear-gradient(135deg, rgba(126,245,255,0.24), rgba(33,212,253,0.14));
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: transform 0.16s ease, box-shadow 0.18s ease, background 0.18s ease, opacity 0.18s ease;
      box-shadow: 0 0 0 1px rgba(126,245,255,0.14) inset;
    }
    .help-send-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      background: linear-gradient(135deg, rgba(126,245,255,0.38), rgba(33,212,253,0.24));
      box-shadow: 0 0 0 1px rgba(126,245,255,0.28) inset, 0 6px 18px rgba(33,212,253,0.22);
    }
    .help-send-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }
    .help-send-btn.cooldown {
      border-color: rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
    }
    .help-send-btn.success {
      border-color: rgba(124,255,107,0.55);
      background: linear-gradient(135deg, rgba(124,255,107,0.28), rgba(46,209,107,0.18));
    }
    .help-send-btn.error {
      border-color: rgba(255,107,107,0.55);
      background: linear-gradient(135deg, rgba(255,107,107,0.22), rgba(255,80,80,0.12));
    }
    .help-status-toast {
      margin-top: 8px;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      display: none;
    }
    .help-status-toast.show {
      display: block;
    }
    .help-status-toast.toast-ok {
      background: rgba(124,255,107,0.14);
      border: 1px solid rgba(124,255,107,0.35);
      color: #b8ffa8;
    }
    .help-status-toast.toast-err {
      background: rgba(255,107,107,0.14);
      border: 1px solid rgba(255,107,107,0.35);
      color: #ffb8b8;
    }
  `;
	document.head.appendChild(css);

	/* ── Config ───────────────────────────────────────────────────── */
	const WEBHOOK_URL =
		"https://discord.com/api/webhooks/1483978714298716273/W1ftWkxFVGv2a55ZMLq70-5CSFIhdu2TuzS_11YRl8zWsetFTflXBND7uPXQ3ztBXX2V";
	const DISCORD_INVITE = "https://discord.gg/TybFD4Sm2C";
	const COOLDOWN_MS = 60000;
	const COOLDOWN_KEY = "help_webhook_cooldown_ts";
	const MAX_CHARS = 500;

	/* ── Helpers ──────────────────────────────────────────────────── */
	function getCooldownRemaining() {
		try {
			var ts = Number.parseInt(localStorage.getItem(COOLDOWN_KEY) || "0", 10);
			if (!Number.isFinite(ts) || ts <= 0) return 0;
			var diff = ts + COOLDOWN_MS - Date.now();
			return diff > 0 ? diff : 0;
		} catch (_) {
			return 0;
		}
	}

	function setCooldownNow() {
		try {
			localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
		} catch (_) {}
	}

	/* ── Build Modal Content ──────────────────────────────────────── */
	function buildHelpContent(panel) {
		var head = panel.querySelector(".settings-head");
		if (!head) return;

		/* Update title */
		var titleEl = head.querySelector("h2");
		if (titleEl) titleEl.textContent = "\uD83D\uDCEC Help & Contact";

		/* Remove all existing body content after the header */
		while (head.nextSibling) {
			head.nextSibling.remove();
		}

		/* Body container */
		var body = document.createElement("div");
		body.className = "settings-body";

		/* ── Discord Button ─── */
		var discordBtn = document.createElement("a");
		discordBtn.className = "help-discord-btn";
		discordBtn.href = DISCORD_INVITE;
		discordBtn.target = "_blank";
		discordBtn.rel = "noopener noreferrer";
		discordBtn.innerHTML =
			'<img class="help-discord-logo" src="images/socials/discord.svg" alt="Discord">' +
			'<div class="help-discord-text">' +
			'<span class="help-discord-label">Join Our Discord</span>' +
			'<span class="help-discord-sub">discord.gg/TybFD4Sm2C</span>' +
			"</div>";
		body.appendChild(discordBtn);

		/* ── Divider ─── */
		var divider = document.createElement("div");
		divider.className = "help-divider";
		divider.textContent = "Send a Message";
		body.appendChild(divider);

		/* ── Textarea ─── */
		var textarea = document.createElement("textarea");
		textarea.className = "help-form-area";
		textarea.placeholder = "Type your message here...";
		textarea.maxLength = MAX_CHARS;
		textarea.setAttribute("aria-label", "Contact message");
		body.appendChild(textarea);

		/* ── Char counter ─── */
		var charCount = document.createElement("div");
		charCount.className = "help-char-count";
		charCount.textContent = "0 / " + MAX_CHARS;
		body.appendChild(charCount);

		textarea.addEventListener("input", () => {
			var len = textarea.value.length;
			charCount.textContent = len + " / " + MAX_CHARS;
			charCount.classList.toggle("over", len >= MAX_CHARS);
		});

		/* ── Send Button ─── */
		var sendBtn = document.createElement("button");
		sendBtn.type = "button";
		sendBtn.className = "help-send-btn";
		sendBtn.textContent = "\uD83D\uDE80 Send Message";
		body.appendChild(sendBtn);

		/* ── Status Toast ─── */
		var toast = document.createElement("div");
		toast.className = "help-status-toast";
		body.appendChild(toast);

		/* ── Cooldown Timer ─── */
		var cooldownTimer = null;

		function updateCooldownUI() {
			var remaining = getCooldownRemaining();
			if (remaining <= 0) {
				sendBtn.disabled = false;
				sendBtn.classList.remove("cooldown");
				sendBtn.textContent = "\uD83D\uDE80 Send Message";
				if (cooldownTimer) {
					clearInterval(cooldownTimer);
					cooldownTimer = null;
				}
				return;
			}
			sendBtn.disabled = true;
			sendBtn.classList.add("cooldown");
			var secs = Math.ceil(remaining / 1000);
			sendBtn.textContent = "\u23F3 Wait " + secs + "s";
		}

		function startCooldownTick() {
			updateCooldownUI();
			if (cooldownTimer) clearInterval(cooldownTimer);
			cooldownTimer = setInterval(updateCooldownUI, 1000);
		}

		function showToast(msg, type) {
			toast.textContent = msg;
			toast.className =
				"help-status-toast show " + (type === "ok" ? "toast-ok" : "toast-err");
			setTimeout(() => {
				toast.classList.remove("show");
			}, 4000);
		}

		function showCooldownToast() {
			showToast("You on cooldown. Please wait 60 seconds.", "err");
		}

		/* ── Send Logic ─── */
		sendBtn.addEventListener("click", () => {
			if (sendBtn.disabled) return;
			var msg = textarea.value.trim();
			if (!msg) {
				showToast("Please type a message first.", "err");
				return;
			}
			if (getCooldownRemaining() > 0) {
				showCooldownToast();
				startCooldownTick();
				return;
			}

			sendBtn.disabled = true;
			sendBtn.textContent = "Sending...";

			var page = location.pathname.split("/").pop() || "index.html";
			var payload = JSON.stringify({
				embeds: [
					{
						title: "\uD83D\uDCEC Website Contact",
						description: msg,
						color: 5814783,
						footer: {
							text: "From: " + page + " \u2022 " + new Date().toLocaleString(),
						},
						timestamp: new Date().toISOString(),
					},
				],
			});

			fetch(WEBHOOK_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: payload,
			})
				.then((res) => {
					if (res.ok || res.status === 204) {
						setCooldownNow();
						textarea.value = "";
						charCount.textContent = "0 / " + MAX_CHARS;
						charCount.classList.remove("over");
						sendBtn.classList.add("success");
						sendBtn.textContent = "\u2714 Sent!";
						showToast("Message sent successfully!", "ok");
						setTimeout(() => {
							sendBtn.classList.remove("success");
							startCooldownTick();
						}, 1500);
					} else {
						throw new Error("HTTP " + res.status);
					}
				})
				.catch(() => {
					sendBtn.disabled = false;
					sendBtn.classList.add("error");
					sendBtn.textContent = "\uD83D\uDE80 Send Message";
					showToast("Failed to send. Try again in a moment.", "err");
					setTimeout(() => {
						sendBtn.classList.remove("error");
					}, 2000);
				});
		});

		/* ── Init cooldown state ─── */
		startCooldownTick();

		panel.appendChild(body);
	}

	/* ── Boot ──────────────────────────────────────────────────────── */
	function init() {
		var modal = document.getElementById("help-modal");
		if (!modal) return;

		var panel = modal.querySelector(".settings-panel");
		if (!panel) return;

		/* Build the dynamic content */
		buildHelpContent(panel);

		/* ── Event Delegation for Open Trigger ── */
		/* site-ui.js rebuilds the navbar, so we must delegate to document */
		document.addEventListener("click", function (e) {
			var trigger = e.target.closest("#open-help");
			if (trigger) {
				e.preventDefault();
				modal.classList.add("open");
				modal.setAttribute("aria-hidden", "false");
				if (getCooldownRemaining() > 0) {
					var toast = modal.querySelector(".help-status-toast");
					if (toast) {
						toast.textContent = "You on cooldown. Please wait 60 seconds.";
						toast.className = "help-status-toast show toast-err";
						setTimeout(() => {
							toast.classList.remove("show");
						}, 4000);
					}
				}
			}
		});

		/* ── Standard Listeners for elements inside the modal ── */
		var closeBtn = document.getElementById("close-help");
		if (closeBtn) {
			closeBtn.addEventListener("click", function () {
				modal.classList.remove("open");
				modal.setAttribute("aria-hidden", "true");
			});
		}

		modal.addEventListener("click", function (e) {
			if (e.target === modal && closeBtn) closeBtn.click();
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init, { once: true });
	} else {
		init();
	}
})();
