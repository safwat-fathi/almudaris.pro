"use client";

import {
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Percentage of sheet height the user must drag to trigger close (0-1). Default 0.3 */
  closeThreshold?: number;
}

const ANIMATION_MS = 320;
const CUBIC = "cubic-bezier(.4,0,.2,1)";

export function BottomSheet({
  isOpen,
  onClose,
  children,
  closeThreshold = 0.3,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Drag state (refs to avoid re-renders during gesture) ---
  const dragStartY = useRef(0);
  const currentTranslateY = useRef(0);
  const isDragging = useRef(false);

  // ─── Animate open / close via direct DOM manipulation ────────
  useEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!container || !sheet || !backdrop) return;

    // Clear any pending close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (isOpen) {
      // Phase 1: show container at starting position (off-screen)
      sheet.style.transition = "none";
      backdrop.style.transition = "none";
      container.style.display = "flex";
      sheet.style.transform = "translateY(100%)";
      backdrop.style.opacity = "0";

      // Phase 2: force reflow, then animate in
      sheet.getBoundingClientRect(); // force layout
      sheet.style.transition = `transform ${ANIMATION_MS}ms ${CUBIC}`;
      backdrop.style.transition = `opacity ${ANIMATION_MS}ms ${CUBIC}`;
      sheet.style.transform = "translateY(0)";
      backdrop.style.opacity = "1";

      document.body.style.overflow = "hidden";
    } else {
      // Animate out
      sheet.style.transition = `transform ${ANIMATION_MS}ms ${CUBIC}`;
      backdrop.style.transition = `opacity ${ANIMATION_MS}ms ${CUBIC}`;
      sheet.style.transform = "translateY(100%)";
      backdrop.style.opacity = "0";

      // Hide container after animation completes
      closeTimerRef.current = setTimeout(() => {
        container.style.display = "none";
        document.body.style.overflow = "auto";
      }, ANIMATION_MS);
    }

    return () => {
      document.body.style.overflow = "auto";
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [isOpen]);

  // ─── Escape key ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ─── Drag-to-dismiss helpers ─────────────────────────────────
  const applyTranslate = useCallback((y: number) => {
    if (!sheetRef.current || !backdropRef.current) return;
    const clamped = Math.max(0, y);
    sheetRef.current.style.transform = `translateY(${clamped}px)`;
    const sheetHeight = sheetRef.current.offsetHeight || 1;
    const opacity = Math.max(0, 1 - clamped / sheetHeight);
    backdropRef.current.style.opacity = String(opacity);
  }, []);

  const handleDragStart = useCallback((clientY: number) => {
    if (!sheetRef.current) return;
    isDragging.current = true;
    dragStartY.current = clientY;
    currentTranslateY.current = 0;
    sheetRef.current.style.transition = "none";
    if (backdropRef.current) backdropRef.current.style.transition = "none";
  }, []);

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging.current) return;
      currentTranslateY.current = clientY - dragStartY.current;
      applyTranslate(currentTranslateY.current);
    },
    [applyTranslate]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current || !sheetRef.current) return;
    isDragging.current = false;

    sheetRef.current.style.transition = `transform ${ANIMATION_MS}ms ${CUBIC}`;
    if (backdropRef.current)
      backdropRef.current.style.transition = `opacity ${ANIMATION_MS}ms ${CUBIC}`;

    const sheetHeight = sheetRef.current.offsetHeight || 1;
    if (currentTranslateY.current / sheetHeight > closeThreshold) {
      onClose();
    } else {
      applyTranslate(0);
    }
    currentTranslateY.current = 0;
  }, [closeThreshold, onClose, applyTranslate]);

  // ─── Pointer events on the drag handle ───────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      handleDragStart(e.clientY);
    },
    [handleDragStart]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => handleDragMove(e.clientY),
    [handleDragMove]
  );

  const onPointerUp = useCallback(() => handleDragEnd(), [handleDragEnd]);

  // ─── Render ──────────────────────────────────────────────────
  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] items-end justify-center sm:items-center"
      style={{ display: "none" }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-on-background/20 backdrop-blur-sm"
        style={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-md bg-surface h-[85vh] sm:h-[80vh] sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ transform: "translateY(100%)" }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing select-none touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="w-10 h-1.5 bg-surface-container-high rounded-full" />
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}
