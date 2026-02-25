'use client';

import { useRef, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import PetList from "@/features/pets/PetList";
import CartoonCardPet from "@/components/dashboard/CartoonCardPet";

// Viewport height: ~3–4 normal (large) cards visible
const ALERTS_VIEWPORT_HEIGHT_PX = 530;
const SCROLL_SPEED_PX_PER_SEC = 24;

export default function AlertsSection({
  pets,
  currentPage,
  totalPages,
  loading,
  onPageChange
}) {
  const innerRef = useRef(null);
  const firstSetRef = useRef(null);
  const offsetYRef = useRef(0);
  const firstSetHeightRef = useRef(0);
  const rafIdRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [scrollPaused, setScrollPaused] = useState(false);
  const [firstSetHeight, setFirstSetHeight] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = scrollPaused;
  }, [scrollPaused]);

  useEffect(() => {
    if (loading || !pets?.length) {
      firstSetHeightRef.current = 0;
      setFirstSetHeight(0);
      return;
    }
    const el = firstSetRef.current;
    if (!el) return;
    const onMeasure = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        firstSetHeightRef.current = h;
        setFirstSetHeight(h);
        const y = offsetYRef.current;
        if (y < 0 && innerRef.current) {
          offsetYRef.current = -(Math.abs(y) % h);
          innerRef.current.style.transform = `translate3d(0,${Math.round(offsetYRef.current)}px,0)`;
        }
      }
    };
    onMeasure();
    const ro = new ResizeObserver(onMeasure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading, pets?.length]);

  useEffect(() => {
    if (loading || !pets?.length || firstSetHeight <= 0) return;

    const inner = innerRef.current;
    if (!inner) return;

    const tick = (now) => {
      rafIdRef.current = requestAnimationFrame(tick);
      if (pausedRef.current) {
        lastTimeRef.current = now;
        return;
      }
      const prev = lastTimeRef.current ?? now;
      lastTimeRef.current = now;
      const deltaSec = Math.min((now - prev) / 1000, 0.2);
      const firstH = firstSetHeightRef.current;
      let y = offsetYRef.current - SCROLL_SPEED_PX_PER_SEC * deltaSec;
      if (firstH > 0 && y <= -firstH) {
        y += firstH;
      }
      offsetYRef.current = y;
      inner.style.transform = `translate3d(0,${Math.round(y)}px,0)`;
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [loading, pets?.length, firstSetHeight]);

  const handleMouseEnter = useCallback(() => setScrollPaused(true), []);
  const handleMouseLeave = useCallback(() => setScrollPaused(false), []);

  const showInfiniteScroll = !loading && pets?.length > 0;

  return (
    <div className="dashboard-section-card p-4 sm:p-5 relative flex flex-col min-h-0">
      {/* Cartoon pet - alerts (alert cat), left side */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-0 opacity-90 scale-90 origin-top-left">
        <CartoonCardPet variant="alerts" />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 dashboard-section-header-divider border-b relative z-10 pl-16 sm:pl-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="dashboard-section-icon-wrap relative flex items-center justify-center w-9 h-9 rounded-xl text-white">
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-400 animate-pulse ring-2 ring-white/80" />
            <FontAwesomeIcon icon={faBell} className="text-base" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              Active Alerts
            </h2>
            <p className="text-xs text-white/95 mt-0.5 opacity-95">
              Real-time reports from the community
            </p>
          </div>
        </div>
        <span className="dashboard-section-badge flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-white shrink-0">
          <span className="h-1 w-1 rounded-full bg-red-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Scroll area: duplicated list = seamless infinite loop; footer fixed at bottom */}
      <div className="relative mt-3 pt-1 flex flex-col overflow-hidden">
        <div
          className="alerts-scroll-viewport overflow-hidden shrink-0"
          style={{ height: ALERTS_VIEWPORT_HEIGHT_PX }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {showInfiniteScroll ? (
            <div
              ref={innerRef}
              className="alerts-scroll-inner w-full"
              style={{ willChange: "transform" }}
            >
              <div ref={firstSetRef}>
                <PetList
                  pets={pets}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  loading={false}
                  onPageChange={onPageChange}
                  hidePagination
                  hideFlyerAndSighting
                  showFooterText={false}
                  cardSize="normal"
                />
              </div>
              <div aria-hidden="true">
                <PetList
                  pets={pets}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  loading={false}
                  onPageChange={onPageChange}
                  hidePagination
                  hideFlyerAndSighting
                  showFooterText={false}
                  cardSize="normal"
                />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto alerts-scroll pr-1">
              <PetList
                pets={pets}
                currentPage={currentPage}
                totalPages={totalPages}
                loading={loading}
                onPageChange={onPageChange}
                hidePagination
                hideFlyerAndSighting
                showFooterText={false}
                cardSize="normal"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-white/90 text-center py-2.5 shrink-0 border-t border-white/20">
          Showing community alerts in real time
        </p>
      </div>
    </div>
  );
}
