'use client';

/**
 * Realistic sitting dog or cat with wiggling tail.
 * @param { 'dog' | 'cat' } type
 * @param { '1' | '2' | 'realistic' } variant
 * @param { string } className - wrapper classes
 */
export default function AnimatedPet({ type = 'dog', variant = '1', className = '' }) {
  const isDog = type === 'dog';
  if (variant === 'realistic') {
    return (
      <div className={`pointer-events-none select-none ${className}`} aria-hidden>
        {isDog ? <RealisticDog /> : <RealisticCat />}
      </div>
    );
  }
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      {isDog ? (
        variant === '1' ? <SittingDog1 /> : <SittingDog2 />
      ) : (
        variant === '1' ? <SittingCat1 /> : <SittingCat2 />
      )}
    </div>
  );
}

/* Realistic dog - anatomical proportions, natural sitting pose, wiggling tail */
function RealisticDog() {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-2xl" fill="currentColor">
      <defs>
        <linearGradient id="real-dog-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.92" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id="real-dog-chest" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.75" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* Tail - natural curve, wiggling */}
      <g style={{ transformOrigin: '38px 48px' }} className="animate-pet-tail-wiggle">
        <path
          d="M38 48 C28 42 22 50 26 58 C30 62 36 58 38 52"
          fill="currentColor"
          opacity="0.88"
        />
      </g>
      {/* Hind legs - sitting, natural shape */}
      <path d="M32 68 L28 88 L38 88 L40 68 Z" fill="url(#real-dog-body)" />
      <path d="M72 68 L68 88 L78 88 L80 68 Z" fill="url(#real-dog-body)" />
      {/* Rump and back */}
      <path
        d="M28 42 Q28 28 42 24 L78 24 Q92 28 92 44 L92 62 Q88 72 70 74 L50 74 L30 72 Q28 62 28 50 Z"
        fill="url(#real-dog-body)"
      />
      {/* Chest and belly */}
      <path
        d="M42 50 Q38 68 44 76 L76 76 Q82 68 78 50 Q72 42 60 44 L48 44 Z"
        fill="url(#real-dog-chest)"
      />
      {/* Front legs */}
      <path d="M44 52 L40 78 L50 78 L52 54 Z" fill="url(#real-dog-body)" />
      <path d="M76 52 L72 78 L82 78 L84 54 Z" fill="url(#real-dog-body)" />
      {/* Neck - natural thickness */}
      <path d="M58 28 L52 48 L68 48 L72 30 Q68 22 58 28 Z" fill="url(#real-dog-body)" />
      {/* Head - proportional, with muzzle */}
      <path
        d="M72 28 Q88 20 94 32 Q96 40 88 44 L74 42 Q68 36 70 28 Z"
        fill="url(#real-dog-body)"
      />
      {/* Muzzle - defined */}
      <path d="M82 38 L96 40 L94 46 L80 44 Z" fill="currentColor" opacity="0.95" />
      <ellipse cx="90" cy="42" rx="2" ry="1.5" fill="rgba(0,0,0,0.6)" />
      {/* Ear */}
      <path d="M74 26 L68 14 L72 28 Z" fill="currentColor" opacity="0.9" />
      <path d="M84 24 L92 12 L94 28 Z" fill="currentColor" opacity="0.9" />
      {/* Eye */}
      <ellipse cx="78" cy="32" rx="2.5" ry="3" fill="rgba(0,0,0,0.75)" />
    </svg>
  );
}

/* Realistic cat - for optional use */
function RealisticCat() {
  return (
    <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-2xl" fill="currentColor">
      <defs>
        <linearGradient id="real-cat-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.82" />
        </linearGradient>
      </defs>
      <g style={{ transformOrigin: '88px 50px' }} className="animate-pet-tail-wiggle">
        <path d="M88 50 Q98 38 104 46 Q102 56 94 54 Q90 52 88 50" fill="currentColor" opacity="0.9" />
      </g>
      <path d="M30 70 L26 88 L38 88 L40 70 Z" fill="url(#real-cat-body)" />
      <path d="M72 70 L68 88 L80 88 L82 70 Z" fill="url(#real-cat-body)" />
      <path d="M26 44 Q26 26 44 22 L76 22 Q94 26 94 46 L94 64 Q90 74 72 76 L48 76 L28 74 Q26 62 26 50 Z" fill="url(#real-cat-body)" />
      <path d="M44 48 L40 76 L52 76 L54 50 Z" fill="url(#real-cat-body)" />
      <path d="M76 48 L72 76 L84 76 L86 50 Z" fill="url(#real-cat-body)" />
      <path d="M58 24 L52 46 L72 46 L76 28 Q72 18 58 24 Z" fill="url(#real-cat-body)" />
      <path d="M72 26 Q88 18 92 32 Q90 40 80 42 L74 40 Q70 34 72 26 Z" fill="url(#real-cat-body)" />
      <path d="M78 14 L76 28 M92 14 L90 28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="32" rx="2.2" ry="2.8" fill="rgba(0,0,0,0.8)" />
      <ellipse cx="88" cy="32" rx="2.2" ry="2.8" fill="rgba(0,0,0,0.8)" />
      <path d="M84 38 L82 40 L84 40 L86 40 Z" fill="rgba(0,0,0,0.5)" />
    </svg>
  );
}

/* Dog 1: Labrador-style sitting, tail to the right */
function SittingDog1() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl" fill="currentColor">
      <defs>
        <linearGradient id="dog1-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {/* Tail - wiggling, origin at base (left of tail) */}
      <g style={{ transformOrigin: '42px 42px' }} className="animate-pet-tail-wiggle">
        <path
          d="M42 42 Q52 32 58 38 Q62 44 56 50 Q50 46 42 42"
          fill="currentColor"
          opacity="0.9"
        />
      </g>
      {/* Hind leg (sitting) */}
      <ellipse cx="38" cy="62" rx="8" ry="6" fill="currentColor" opacity="0.9" />
      <ellipse cx="58" cy="62" rx="8" ry="6" fill="currentColor" opacity="0.9" />
      {/* Body (sitting posture) */}
      <path
        d="M28 28 L28 56 Q50 62 72 56 L72 28 Q50 18 28 28 Z"
        fill="url(#dog1-body-grad)"
      />
      {/* Front legs */}
      <rect x="32" y="48" width="10" height="18" rx="4" fill="currentColor" opacity="0.95" />
      <rect x="58" y="48" width="10" height="18" rx="4" fill="currentColor" opacity="0.95" />
      {/* Chest */}
      <ellipse cx="50" cy="48" rx="14" ry="8" fill="currentColor" opacity="0.9" />
      {/* Neck & head */}
      <path d="M50 28 Q38 8 28 14 Q22 22 30 28 Q42 24 50 28 Z" fill="currentColor" opacity="0.98" />
      {/* Floppy ears */}
      <ellipse cx="26" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.9" transform="rotate(-20 26 18)" />
      <ellipse cx="48" cy="16" rx="6" ry="11" fill="currentColor" opacity="0.9" transform="rotate(10 48 16)" />
      {/* Snout */}
      <ellipse cx="38" cy="24" rx="8" ry="6" fill="currentColor" opacity="0.95" />
      <ellipse cx="36" cy="23" rx="2.5" ry="2" fill="rgba(0,0,0,0.5)" />
      {/* Eye */}
      <ellipse cx="42" cy="18" rx="2" ry="2.5" fill="rgba(0,0,0,0.6)" />
    </svg>
  );
}

/* Dog 2: Smaller / terrier-style, tail up */
function SittingDog2() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl" fill="currentColor">
      {/* Tail - curly/up, wiggling */}
      <g style={{ transformOrigin: '68px 35px' }} className="animate-pet-tail-wiggle">
        <path
          d="M68 35 Q78 22 82 30 Q80 40 72 38 Q68 35 68 35"
          fill="currentColor"
          opacity="0.9"
        />
      </g>
      {/* Hind legs */}
      <ellipse cx="35" cy="60" rx="7" ry="5" fill="currentColor" opacity="0.9" />
      <ellipse cx="62" cy="60" rx="7" ry="5" fill="currentColor" opacity="0.9" />
      {/* Body */}
      <path
        d="M30 26 L30 54 Q50 60 70 54 L70 26 Q50 16 30 26 Z"
        fill="currentColor"
        opacity="0.95"
      />
      <rect x="34" y="46" width="8" height="16" rx="3" fill="currentColor" opacity="0.95" />
      <rect x="58" y="46" width="8" height="16" rx="3" fill="currentColor" opacity="0.95" />
      <ellipse cx="50" cy="44" rx="12" ry="6" fill="currentColor" opacity="0.9" />
      {/* Head - rounder */}
      <path d="M50 26 Q38 6 26 14 Q20 24 32 28 Q44 26 50 26 Z" fill="currentColor" opacity="0.98" />
      <ellipse cx="24" cy="16" rx="5" ry="10" fill="currentColor" opacity="0.9" transform="rotate(-25 24 16)" />
      <ellipse cx="46" cy="14" rx="5" ry="9" fill="currentColor" opacity="0.9" transform="rotate(15 46 14)" />
      <ellipse cx="38" cy="22" rx="6" ry="5" fill="currentColor" opacity="0.95" />
      <ellipse cx="36" cy="21" rx="2" ry="1.5" fill="rgba(0,0,0,0.5)" />
      <ellipse cx="42" cy="17" rx="1.8" ry="2.2" fill="rgba(0,0,0,0.6)" />
    </svg>
  );
}

/* Cat 1: Short hair, tail to the side */
function SittingCat1() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl" fill="currentColor">
      {/* Tail - long, wiggling, origin at base */}
      <g style={{ transformOrigin: '78px 42px' }} className="animate-pet-tail-wiggle">
        <path
          d="M78 42 Q88 30 92 38 Q90 48 84 46 Q80 44 78 42"
          fill="currentColor"
          opacity="0.9"
        />
      </g>
      {/* Hind legs (sitting) */}
      <ellipse cx="32" cy="62" rx="6" ry="5" fill="currentColor" opacity="0.9" />
      <ellipse cx="52" cy="62" rx="6" ry="5" fill="currentColor" opacity="0.9" />
      {/* Body */}
      <path
        d="M26 28 L26 54 Q50 60 74 54 L74 28 Q50 18 26 28 Z"
        fill="currentColor"
        opacity="0.95"
      />
      <rect x="30" y="48" width="7" height="16" rx="3" fill="currentColor" opacity="0.95" />
      <rect x="52" y="48" width="7" height="16" rx="3" fill="currentColor" opacity="0.95" />
      <ellipse cx="50" cy="46" rx="12" ry="6" fill="currentColor" opacity="0.9" />
      {/* Head */}
      <circle cx="50" cy="22" r="14" fill="currentColor" opacity="0.98" />
      {/* Pointy ears */}
      <path d="M38 14 L42 28 L36 26 Z" fill="currentColor" opacity="0.98" />
      <path d="M62 14 L58 28 L64 26 Z" fill="currentColor" opacity="0.98" />
      {/* Eyes */}
      <ellipse cx="44" cy="20" rx="2.5" ry="3" fill="rgba(0,0,0,0.7)" />
      <ellipse cx="56" cy="20" rx="2.5" ry="3" fill="rgba(0,0,0,0.7)" />
      {/* Nose & mouth */}
      <path d="M50 26 L48 28 L50 28 L52 28 Z" fill="rgba(0,0,0,0.5)" />
      <path d="M50 28 Q48 30 46 29 M50 28 Q52 30 54 29" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* Cat 2: Fluffy, tail curled */
function SittingCat2() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl" fill="currentColor">
      {/* Tail - fluffy curve, wiggling */}
      <g style={{ transformOrigin: '76px 38px' }} className="animate-pet-tail-wiggle">
        <path
          d="M76 38 Q86 28 90 36 Q88 46 80 44 Q76 42 76 38"
          fill="currentColor"
          opacity="0.9"
        />
      </g>
      <ellipse cx="30" cy="60" rx="7" ry="5" fill="currentColor" opacity="0.9" />
      <ellipse cx="58" cy="60" rx="7" ry="5" fill="currentColor" opacity="0.9" />
      <path
        d="M24 26 L24 54 Q50 62 76 54 L76 26 Q50 16 24 26 Z"
        fill="currentColor"
        opacity="0.95"
      />
      <rect x="28" y="46" width="8" height="16" rx="3" fill="currentColor" opacity="0.95" />
      <rect x="54" y="46" width="8" height="16" rx="3" fill="currentColor" opacity="0.95" />
      <ellipse cx="50" cy="44" rx="14" ry="7" fill="currentColor" opacity="0.9" />
      <circle cx="50" cy="20" r="13" fill="currentColor" opacity="0.98" />
      <path d="M36 10 L40 26 L34 24 Z" fill="currentColor" opacity="0.98" />
      <path d="M64 10 L60 26 L66 24 Z" fill="currentColor" opacity="0.98" />
      <ellipse cx="44" cy="19" rx="2.2" ry="2.8" fill="rgba(0,0,0,0.7)" />
      <ellipse cx="56" cy="19" rx="2.2" ry="2.8" fill="rgba(0,0,0,0.7)" />
      <path d="M50 25 L48 27 L50 27 L52 27 Z" fill="rgba(0,0,0,0.5)" />
    </svg>
  );
}
