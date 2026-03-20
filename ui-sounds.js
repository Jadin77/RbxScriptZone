(() => {
	const MUTE_KEY = "ui_sounds_muted";
	const PRESET_KEY = "ui_sounds_preset";
	const MASTER_VOL_KEY = "ui_sounds_master_volume";

	const PRESETS = {
		soft: {
			label: "Soft Neon",
			files: {
				click: "sounds/ui/presets/soft/click.wav",
				hover: "sounds/ui/presets/soft/hover.wav",
				open: "sounds/ui/presets/soft/open.wav",
			},
			volume: { click: 0.2, hover: 0.04, open: 0.14 },
		},
		arcade: {
			label: "Arcade Pop",
			files: {
				click: "sounds/ui/presets/arcade/click.wav",
				hover: "sounds/ui/presets/arcade/hover.wav",
				open: "sounds/ui/presets/arcade/open.wav",
			},
			volume: { click: 0.16, hover: 0.08, open: 0.12 },
		},
		glass: {
			label: "Glass Pulse",
			files: {
				click: "sounds/ui/presets/glass/click.wav",
				hover: "sounds/ui/presets/glass/hover.wav",
				open: "sounds/ui/presets/glass/open.wav",
			},
			volume: { click: 0.13, hover: 0.025, open: 0.1 },
		},
	};

	let muted = false;
	let presetId = "soft";
	let masterVolume = 0.5;
	const sounds = {};

	try {
		muted = localStorage.getItem(MUTE_KEY) === "1";
		const storedPreset = localStorage.getItem(PRESET_KEY);
		if (storedPreset && PRESETS[storedPreset]) presetId = storedPreset;
		const storedMaster = Number.parseFloat(
			localStorage.getItem(MASTER_VOL_KEY) || "",
		);
		if (!Number.isNaN(storedMaster))
			masterVolume = Math.max(0, Math.min(1, storedMaster));
	} catch (_) {}

	function refreshVolumes() {
		const preset = PRESETS[presetId] || PRESETS.soft;
		["click", "hover", "open"].forEach((key) => {
			if (sounds[key])
				sounds[key].volume = Math.max(
					0,
					Math.min(1, preset.volume[key] * masterVolume),
				);
		});
	}

	function loadPreset(id) {
		const preset = PRESETS[id] || PRESETS.soft;
		["click", "hover", "open"].forEach((key) => {
			const a = new Audio(preset.files[key]);
			a.preload = "auto";
			sounds[key] = a;
		});
		presetId = id;
		refreshVolumes();
	}

	loadPreset(presetId);

	function play(key) {
		if (muted) return;
		const base = sounds[key];
		if (!base) return;
		try {
			const a = base.cloneNode();
			a.volume = base.volume;
			const p = a.play();
			if (p && typeof p.catch === "function") p.catch(() => {});
		} catch (_) {}
	}

	function markHover(el) {
		if (!el) return;
		if (el.dataset && el.dataset.soundHoverBound === "1") return;
		if (el.dataset) el.dataset.soundHoverBound = "1";
		el.addEventListener(
			"pointerenter",
			() => {
				play("hover");
			},
			{ passive: true },
		);
	}

	document.addEventListener(
		"pointerdown",
		(e) => {
			const t = e.target;
			if (!t) return;
			if (t.closest("a, button, .filter-tab, .card-link, .btn")) {
				play("click");
			}
		},
		{ passive: true },
	);

	document.addEventListener(
		"click",
		(e) => {
			const t = e.target;
			if (!t) return;
			if (t.closest("#open-settings, #open-help, [id^='tab-']")) {
				play("open");
			}
		},
		{ passive: true },
	);

	function bindHovers() {
		document
			.querySelectorAll("a, button, .filter-tab, .card-link, .btn")
			.forEach(markHover);
	}

	bindHovers();
	const mo = new MutationObserver(() => {
		bindHovers();
	});
	mo.observe(document.documentElement, { childList: true, subtree: true });

	window.UISounds = {
		listPresets: () =>
			Object.keys(PRESETS).map((id) => ({ id: id, label: PRESETS[id].label })),
		getPreset: () => presetId,
		setPreset: (id) => {
			if (!PRESETS[id]) return false;
			loadPreset(id);
			try {
				localStorage.setItem(PRESET_KEY, id);
			} catch (_) {}
			return true;
		},
		getMasterVolume: () => masterVolume,
		setMasterVolume: (value) => {
			const v = Math.max(0, Math.min(1, Number(value) || 0));
			masterVolume = v;
			refreshVolumes();
			try {
				localStorage.setItem(MASTER_VOL_KEY, String(v));
			} catch (_) {}
			return masterVolume;
		},
		mute: () => {
			muted = true;
			try {
				localStorage.setItem(MUTE_KEY, "1");
			} catch (_) {}
		},
		unmute: () => {
			muted = false;
			try {
				localStorage.setItem(MUTE_KEY, "0");
			} catch (_) {}
		},
		toggle: function () {
			if (muted) this.unmute();
			else this.mute();
			return !muted;
		},
		isMuted: () => muted,
	};
})();
