// Áudio do Wooper: efeitos via Web Audio API, cries da PokéAPI e música via YouTube.
const MUTE_KEY = 'wooper-muted';
const BATTLE_MUSIC_VIDEO_ID = '3VHvOeuy_Ak';
const BATTLE_MUSIC_VOLUME = 18;

let ctx = null;
let musicGain = null;
let sfxGain = null;
let muted = localStorage.getItem(MUTE_KEY) === '1';
let musicFrame = null;
let musicGestureHooked = false;
let currentCry = null;

function ensureCtx() {
    if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        musicGain = ctx.createGain();
        musicGain.gain.value = muted ? 0 : 0.14;
        musicGain.connect(ctx.destination);
        sfxGain = ctx.createGain();
        sfxGain.gain.value = muted ? 0 : 0.3;
        sfxGain.connect(ctx.destination);
        // Política de autoplay: retoma o contexto no próximo gesto do usuário
        const resume = () => { if (ctx.state === 'suspended') ctx.resume(); };
        document.addEventListener('pointerdown', resume);
        document.addEventListener('keydown', resume);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

export function isMuted() {
    return muted;
}

export function toggleMute() {
    muted = !muted;
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    if (ctx) {
        musicGain.gain.value = muted ? 0 : 0.14;
        sfxGain.gain.value = muted ? 0 : 0.3;
    }
    syncMusicMute();
    return muted;
}

// ---- Sintetizadores básicos ----

function tone({ wave = 'square', from = 440, to = null, dur = 0.15, vol = 1, at = 0, dest = null }) {
    if (!ensureCtx()) return;
    const t0 = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(from, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(dest || sfxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
}

let noiseBuffer = null;

function noise({ dur = 0.2, vol = 1, at = 0, filter = null, from = 1000, to = null, dest = null }) {
    if (!ensureCtx()) return;
    if (!noiseBuffer) {
        noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const t0 = ctx.currentTime + at;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    let node = src;
    if (filter) {
        const f = ctx.createBiquadFilter();
        f.type = filter;
        f.frequency.setValueAtTime(from, t0);
        if (to) f.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur);
        node.connect(f);
        node = f;
    }
    node.connect(gain).connect(dest || sfxGain);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
}

// ---- Efeitos sonoros ----

// Cada família de tipo tem um timbre próprio.
const TYPE_SFX = {
    fire: () => { noise({ dur: 0.35, vol: 0.9, filter: 'lowpass', from: 3000, to: 300 }); tone({ wave: 'sawtooth', from: 180, to: 60, dur: 0.3, vol: 0.4 }); },
    water: () => noise({ dur: 0.35, vol: 0.8, filter: 'bandpass', from: 400, to: 2400 }),
    ice: () => { tone({ wave: 'sine', from: 2200, dur: 0.08, vol: 0.6 }); tone({ wave: 'sine', from: 2900, dur: 0.1, vol: 0.5, at: 0.07 }); tone({ wave: 'sine', from: 3600, dur: 0.14, vol: 0.4, at: 0.14 }); },
    electric: () => { for (let i = 0; i < 6; i++) tone({ wave: 'square', from: 800 + Math.random() * 2400, dur: 0.04, vol: 0.5, at: i * 0.04 }); },
    grass: () => { tone({ wave: 'sawtooth', from: 500, to: 1400, dur: 0.12, vol: 0.5 }); tone({ wave: 'sawtooth', from: 600, to: 1700, dur: 0.12, vol: 0.4, at: 0.09 }); },
    bug: () => { tone({ wave: 'sawtooth', from: 900, to: 1200, dur: 0.07, vol: 0.5 }); tone({ wave: 'sawtooth', from: 900, to: 1200, dur: 0.07, vol: 0.5, at: 0.09 }); tone({ wave: 'sawtooth', from: 900, to: 1200, dur: 0.07, vol: 0.5, at: 0.18 }); },
    rock: () => noise({ dur: 0.25, vol: 1, filter: 'lowpass', from: 500, to: 120 }),
    ground: () => noise({ dur: 0.35, vol: 1, filter: 'lowpass', from: 300, to: 60 }),
    steel: () => { tone({ wave: 'square', from: 1200, to: 700, dur: 0.12, vol: 0.6 }); noise({ dur: 0.12, vol: 0.5, filter: 'highpass', from: 3000 }); },
    fighting: () => { noise({ dur: 0.12, vol: 0.9, filter: 'lowpass', from: 900, to: 200 }); noise({ dur: 0.12, vol: 0.8, at: 0.12, filter: 'lowpass', from: 900, to: 200 }); },
    psychic: () => tone({ wave: 'sine', from: 500, to: 1800, dur: 0.4, vol: 0.5 }),
    ghost: () => tone({ wave: 'sine', from: 900, to: 200, dur: 0.45, vol: 0.5 }),
    dark: () => tone({ wave: 'sawtooth', from: 300, to: 80, dur: 0.3, vol: 0.5 }),
    fairy: () => { tone({ wave: 'sine', from: 1400, dur: 0.09, vol: 0.5 }); tone({ wave: 'sine', from: 1900, dur: 0.09, vol: 0.5, at: 0.08 }); tone({ wave: 'sine', from: 2500, dur: 0.12, vol: 0.4, at: 0.16 }); },
    dragon: () => { tone({ wave: 'sawtooth', from: 100, to: 500, dur: 0.3, vol: 0.6 }); noise({ dur: 0.3, vol: 0.4, filter: 'bandpass', from: 800, to: 2000 }); },
    poison: () => noise({ dur: 0.3, vol: 0.6, filter: 'bandpass', from: 300, to: 900 }),
    flying: () => noise({ dur: 0.25, vol: 0.6, filter: 'bandpass', from: 1200, to: 3500 }),
    normal: () => noise({ dur: 0.15, vol: 0.8, filter: 'lowpass', from: 1200, to: 400 }),
};

export const sfx = {
    click: () => tone({ wave: 'square', from: 900, dur: 0.05, vol: 0.3 }),
    move: (type) => (TYPE_SFX[type] || TYPE_SFX.normal)(),
    hit: (effectiveness) => {
        if (effectiveness === 0) return;
        if (effectiveness > 1) {
            noise({ dur: 0.2, vol: 1, filter: 'highpass', from: 1500 });
            tone({ wave: 'square', from: 1600, to: 400, dur: 0.2, vol: 0.6 });
        } else if (effectiveness < 1) {
            noise({ dur: 0.18, vol: 0.6, filter: 'lowpass', from: 500, to: 150 });
        } else {
            noise({ dur: 0.16, vol: 0.9, filter: 'lowpass', from: 1000, to: 250 });
            tone({ wave: 'square', from: 700, to: 250, dur: 0.12, vol: 0.4 });
        }
    },
    miss: () => noise({ dur: 0.2, vol: 0.4, filter: 'bandpass', from: 2500, to: 600 }),
    faint: () => tone({ wave: 'square', from: 600, to: 60, dur: 0.5, vol: 0.6 }),
    switchIn: () => { tone({ wave: 'square', from: 400, to: 900, dur: 0.1, vol: 0.4 }); tone({ wave: 'square', from: 900, to: 1400, dur: 0.12, vol: 0.4, at: 0.09 }); },
    win: () => {
        [523, 659, 784, 1047].forEach((f, i) => tone({ wave: 'square', from: f, dur: i === 3 ? 0.5 : 0.16, vol: 0.5, at: i * 0.16 }));
    },
    lose: () => {
        [392, 330, 262, 196].forEach((f, i) => tone({ wave: 'triangle', from: f, dur: i === 3 ? 0.6 : 0.22, vol: 0.6, at: i * 0.22 }));
    },
};

// ---- Cries (PokéAPI, mesmo repositório dos sprites) ----

export function playCry(pokedexId) {
    if (muted) return;
    try {
        if (currentCry) currentCry.pause();
        const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokedexId}.ogg`);
        audio.volume = 0.25;
        currentCry = audio;
        audio.play().catch(() => { /* formato não suportado / autoplay: segue sem cry */ });
    } catch {
        /* sem suporte a Audio */
    }
}

// ---- Música de batalha (YouTube) ----

function postMusicCommand(func, args = []) {
    if (!musicFrame?.contentWindow) return;
    musicFrame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func,
        args,
    }), '*');
}

function syncMusicMute() {
    postMusicCommand(muted ? 'mute' : 'unMute');
    postMusicCommand('setVolume', [muted ? 0 : BATTLE_MUSIC_VOLUME]);
}

function ensureMusicFrame() {
    if (musicFrame) return musicFrame;
    if (!musicGestureHooked) {
        const resumeMusic = () => {
            if (!musicFrame) return;
            syncMusicMute();
            postMusicCommand('playVideo');
        };
        document.addEventListener('pointerdown', resumeMusic);
        document.addEventListener('keydown', resumeMusic);
        musicGestureHooked = true;
    }
    const params = new URLSearchParams({
        autoplay: '1',
        controls: '0',
        disablekb: '1',
        enablejsapi: '1',
        fs: '0',
        iv_load_policy: '3',
        loop: '1',
        modestbranding: '1',
        mute: '1',
        playlist: BATTLE_MUSIC_VIDEO_ID,
        playsinline: '1',
        rel: '0',
        origin: window.location.origin,
    });
    musicFrame = document.createElement('iframe');
    musicFrame.title = 'Wooper battle music';
    musicFrame.allow = 'autoplay; encrypted-media';
    musicFrame.src = `https://www.youtube.com/embed/${BATTLE_MUSIC_VIDEO_ID}?${params}`;
    Object.assign(musicFrame.style, {
        border: '0',
        height: '1px',
        left: '-9999px',
        opacity: '0',
        pointerEvents: 'none',
        position: 'fixed',
        top: '0',
        width: '1px',
    });
    document.body.appendChild(musicFrame);
    musicFrame.addEventListener('load', () => {
        syncMusicMute();
        postMusicCommand('playVideo');
    });
    return musicFrame;
}

export function startBattleMusic() {
    ensureCtx();
    ensureMusicFrame();
    syncMusicMute();
    postMusicCommand('seekTo', [0, true]);
    postMusicCommand('playVideo');
}

export function stopMusic() {
    postMusicCommand('stopVideo');
    if (ctx && musicGain) {
        musicGain.gain.cancelScheduledValues(ctx.currentTime);
        musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    }
}
