let ctx;
let analyser;
let source;
let stream;
let raf;

const button = document.getElementById("toggle");
const statusEl = document.getElementById("status");
const canvas = document.getElementById("scope");
const c = canvas.getContext("2d");
const fill = document.getElementById("fill");
const levelEl = document.getElementById("level");
const sampleRateEl = document.getElementById("sampleRate");

function setStatus(text, cls = "") {
  statusEl.textContent = text;
  statusEl.className = `status ${cls}`;
}

async function startMic() {
  button.disabled = true;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    ctx = new (window.AudioContext || window.webkitAudioContext)();

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    source = ctx.createMediaStreamSource(stream);

    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.15;

    source.connect(analyser);

    sampleRateEl.textContent = `${ctx.sampleRate.toLocaleString()} Hz`;
    button.textContent = "Stop microphone";

    setStatus("Microphone active.", "ok");

    draw();
  } catch (err) {
    console.error(err);

    setStatus(
      `Could not start microphone: ${err.name || ""} ${err.message || err}`,
      "error"
    );
  } finally {
    button.disabled = false;
  }
}

function stopMic() {
  cancelAnimationFrame(raf);

  stream?.getTracks().forEach((track) => track.stop());
  ctx?.close();

  stream = null;
  ctx = null;
  analyser = null;
  source = null;

  fill.style.width = "0%";
  levelEl.textContent = "0.0%";
  sampleRateEl.textContent = "—";

  c.clearRect(0, 0, canvas.width, canvas.height);

  button.textContent = "Start microphone";

  setStatus("Microphone stopped.");
}

function draw() {
  const data = new Uint8Array(analyser.fftSize);

  analyser.getByteTimeDomainData(data);

  let sum = 0;

  for (const value of data) {
    const x = (value - 128) / 128;
    sum += x * x;
  }

  const rms = Math.sqrt(sum / data.length);
  const pct = Math.min(100, rms * 500);

  fill.style.width = `${pct}%`;
  levelEl.textContent = `${pct.toFixed(1)}%`;

  c.clearRect(0, 0, canvas.width, canvas.height);

  c.strokeStyle = "#38bdf8";
  c.lineWidth = 4;

  c.beginPath();

  const slice = canvas.width / (data.length - 1);

  for (let i = 0; i < data.length; i++) {
    const x = i * slice;
    const y = (data[i] / 255) * canvas.height;

    if (i === 0) {
      c.moveTo(x, y);
    } else {
      c.lineTo(x, y);
    }
  }

  c.stroke();

  raf = requestAnimationFrame(draw);
}

button.addEventListener("click", () => {
  if (stream) {
    stopMic();
  } else {
    startMic();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

if (!navigator.mediaDevices?.getUserMedia) {
  button.disabled = true;

  setStatus(
    "This browser does not expose microphone capture.",
    "error"
  );
}