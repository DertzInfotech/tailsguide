'use client';

/**
 * Cartoon / anime style animated pets for dashboard cards.
 * Each variant has a distinct character and pose.
 * @param { 'reports' | 'alerts' | 'success' } variant
 * @param { string } className
 */
export default function CartoonCardPet({ variant = 'reports', className = '' }) {
  const baseClass = 'pointer-events-none select-none w-14 h-14 sm:w-16 sm:h-16 text-white/90 shrink-0 ' + className;

  if (variant === 'reports') {
    return (
      <div className={`${baseClass} animate-pet-bounce`} aria-hidden>
        <CartoonDogWithClipboard />
      </div>
    );
  }
  if (variant === 'alerts') {
    return (
      <div className={`${baseClass} animate-pet-float`} aria-hidden>
        <CartoonCatAlert />
      </div>
    );
  }
  return (
    <div className={`${baseClass} animate-pet-bounce`} aria-hidden>
      <CartoonDogSuccess />
    </div>
  );
}

/* Reports: curious dog with clipboard (lost/found theme) */
function CartoonDogWithClipboard() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="dog-reports-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
        </linearGradient>
      </defs>
      {/* Tail - wiggling */}
      <g style={{ transformOrigin: '28px 52px' }} className="animate-pet-tail-wiggle">
        <path d="M28 52 Q18 48 14 56 Q16 62 24 58 Q28 54 28 52" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Body */}
      <ellipse cx="50" cy="62" rx="22" ry="18" fill="url(#dog-reports-body)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      {/* Chest / front */}
      <ellipse cx="50" cy="58" rx="14" ry="10" fill="rgba(255,255,255,0.7)" />
      {/* Legs */}
      <ellipse cx="34" cy="78" rx="6" ry="5" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <ellipse cx="66" cy="78" rx="6" ry="5" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="32" r="20" fill="url(#dog-reports-body)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      {/* Ears - floppy */}
      <ellipse cx="32" cy="22" rx="8" ry="14" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" transform="rotate(-25 32 22)" />
      <ellipse cx="68" cy="22" rx="8" ry="14" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" transform="rotate(25 68 22)" />
      {/* Muzzle */}
      <ellipse cx="50" cy="38" rx="10" ry="8" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Anime eyes - big with highlight */}
      <ellipse cx="42" cy="28" rx="5" ry="6" fill="rgba(40,25,10,0.9)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <circle cx="43" cy="26" r="1.5" fill="white" />
      <ellipse cx="58" cy="28" rx="5" ry="6" fill="rgba(40,25,10,0.9)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <circle cx="59" cy="26" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="36" rx="3" ry="2.5" fill="rgba(40,25,10,0.8)" />
      {/* Clipboard */}
      <g transform="translate(62 42)">
        <rect x="0" y="0" width="14" height="18" rx="2" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
        <line x1="3" y1="5" x2="11" y2="5" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
        <line x1="3" y1="9" x2="11" y2="9" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
        <line x1="3" y1="13" x2="8" y2="13" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* Alerts: alert cat with wide eyes and tail up */
function CartoonCatAlert() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="cat-alerts-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
        </linearGradient>
      </defs>
      {/* Tail - up and curved, wiggling */}
      <g style={{ transformOrigin: '78px 38px' }} className="animate-pet-tail-wiggle">
        <path d="M78 38 Q88 20 92 28 Q90 38 84 40 Q78 40 78 38" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Body */}
      <ellipse cx="50" cy="62" rx="20" ry="16" fill="url(#cat-alerts-body)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      {/* Legs */}
      <ellipse cx="32" cy="76" rx="5" ry="4" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <ellipse cx="68" cy="76" rx="5" ry="4" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="30" r="22" fill="url(#cat-alerts-body)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      {/* Pointy ears */}
      <path d="M30 16 L36 38 L28 36 Z" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M70 16 L64 38 L72 36 Z" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Anime wide eyes - alert look */}
      <ellipse cx="40" cy="28" rx="6" ry="7" fill="rgba(40,25,10,0.95)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <circle cx="41" cy="26" r="2" fill="white" />
      <ellipse cx="60" cy="28" rx="6" ry="7" fill="rgba(40,25,10,0.95)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <circle cx="61" cy="26" r="2" fill="white" />
      {/* Nose */}
      <path d="M50 36 L48 40 L50 40 L52 40 Z" fill="rgba(200,120,120,0.8)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      {/* Whiskers */}
      <line x1="26" y1="38" x2="38" y2="36" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="26" y1="42" x2="38" y2="42" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="74" y1="36" x2="62" y2="36" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="74" y1="42" x2="62" y2="42" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinecap="round" />
      {/* Exclamation mark above head - alert */}
      <circle cx="50" cy="8" r="4" fill="rgba(255,200,100,0.95)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
      <rect x="48.5" y="2" width="3" height="4" rx="0.5" fill="white" />
    </svg>
  );
}

/* Success: happy dog with closed smile eyes and heart */
function CartoonDogSuccess() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="dog-success-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
        </linearGradient>
      </defs>
      {/* Tail - happy wag */}
      <g style={{ transformOrigin: '72px 48px' }} className="animate-pet-tail-wiggle">
        <path d="M72 48 Q82 38 86 46 Q84 54 76 52 Q72 50 72 48" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Body */}
      <ellipse cx="50" cy="62" rx="22" ry="18" fill="url(#dog-success-body)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <ellipse cx="50" cy="58" rx="14" ry="10" fill="rgba(255,255,255,0.7)" />
      {/* Legs */}
      <ellipse cx="34" cy="78" rx="6" ry="5" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <ellipse cx="66" cy="78" rx="6" ry="5" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="32" r="20" fill="url(#dog-success-body)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      {/* Ears */}
      <ellipse cx="32" cy="22" rx="8" ry="14" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" transform="rotate(-25 32 22)" />
      <ellipse cx="68" cy="22" rx="8" ry="14" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" transform="rotate(25 68 22)" />
      {/* Muzzle */}
      <ellipse cx="50" cy="38" rx="10" ry="8" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      {/* Happy closed eyes (curved lines) */}
      <path d="M38 28 Q42 32 46 28" stroke="rgba(40,25,10,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M54 28 Q58 32 62 28" stroke="rgba(40,25,10,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="36" cy="38" rx="4" ry="2" fill="rgba(255,180,180,0.5)" />
      <ellipse cx="64" cy="38" rx="4" ry="2" fill="rgba(255,180,180,0.5)" />
      {/* Nose */}
      <ellipse cx="50" cy="36" rx="3" ry="2.5" fill="rgba(40,25,10,0.8)" />
      {/* Small heart */}
      <g transform="translate(68 26)" className="animate-pulse">
        <path d="M4 2 C4 0 0 -1 0 2 C0 5 4 8 4 8 C4 8 8 5 8 2 C8 -1 4 0 4 2 Z" fill="rgba(255,180,200,0.9)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
