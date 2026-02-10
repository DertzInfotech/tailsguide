'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const VALID_QR_REGEX = /\/pet\/\d+\/scan$/;
const RESUME_DELAY = 1800;

export default function ScanQRPage() {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  const [isMobile, setIsMobile] = useState(true);
  const [error, setError] = useState('');
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  /* ---------- DEVICE CHECK ---------- */
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;
    setIsMobile(/android|iphone|ipad|ipod/i.test(ua));
  }, []);

  /* ---------- FEEDBACK ---------- */
  const vibrate = (pattern) => navigator.vibrate?.(pattern);
  const beep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 900;
      gain.gain.value = 0.15;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 120);
    } catch {}
  };

  /* ---------- SAFE STOP ---------- */
  const safeStop = async () => {
    if (!scannerRef.current || !isRunningRef.current) return;
    try {
      await scannerRef.current.stop();
    } catch {}
    isRunningRef.current = false;
  };

  /* ---------- START SCANNER ---------- */
  const startScanner = async () => {
    if (isRunningRef.current) return;

    try {
      setError('');
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 260 },
        async (decodedText) => {
          // INVALID QR
          if (!VALID_QR_REGEX.test(decodedText)) {
            vibrate([60, 40, 60]);
            beep();
            setError('Invalid QR code. Please scan a TailsGuide pet QR.');
            await safeStop();
            setTimeout(startScanner, RESUME_DELAY);
            return;
          }

          // SUCCESS
          vibrate([120]);
          beep();
          await safeStop();
          window.location.href = decodedText;
        }
      );

      isRunningRef.current = true;

      // Torch support
      const track = scanner.getRunningTrack?.();
      if (track?.getCapabilities?.().torch) {
        setTorchSupported(true);
      }
    } catch (e) {
      console.error(e);
      setError('Camera access failed. Please allow camera permission.');
      await safeStop();
    }
  };

  /* ---------- INIT ---------- */
  useEffect(() => {
    if (!isMobile) return;
    startScanner();
    return () => {
      safeStop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  /* ---------- TORCH ---------- */
  const toggleTorch = async () => {
    try {
      const track = scannerRef.current?.getRunningTrack?.();
      if (!track) return;
      await track.applyConstraints({
        advanced: [{ torch: !torchOn }],
      });
      setTorchOn(!torchOn);
    } catch {
      setError('Flashlight not supported on this device.');
    }
  };

  /* ---------- DESKTOP ---------- */
  if (!isMobile) {
    const link =
      typeof window !== 'undefined'
        ? `${window.location.origin}/scan`
        : '/scan';

    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2>Scan QR Code</h2>
          <p>QR scanning works on mobile devices only.</p>
          <p style={styles.helper}>
            Open this link on your phone:
          </p>
          <a href={link} style={styles.link}>{link}</a>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Scan Pet QR</h2>
        <p style={styles.sub}>Point your camera at the pet’s collar</p>

        <div id="qr-reader" style={styles.scanner} />

        {torchSupported && (
          <button onClick={toggleTorch} style={styles.torch}>
            {torchOn ? '🔦 Turn Flashlight Off' : '🔦 Turn Flashlight On'}
          </button>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f6f7fb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 18,
    padding: 20,
    textAlign: 'center',
    boxShadow: '0 12px 30px rgba(0,0,0,.12)',
  },
  sub: { fontSize: 14, color: '#666', marginBottom: 12 },
  scanner: { maxWidth: 320, margin: '0 auto 12px' },
  torch: {
    padding: '10px 14px',
    borderRadius: 10,
    background: '#ff9800',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: { color: '#d9534f', marginTop: 10 },
  helper: { fontSize: 14, color: '#777' },
  link: { color: '#007bff', textDecoration: 'underline' },
};
