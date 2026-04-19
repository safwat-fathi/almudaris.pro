"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useState,
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

export function BottomSheet({
  isOpen,
  onClose,
  children,
  closeThreshold = 0.3,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Controls whether the portal is mounted at all
  const [mounted, setMounted] = useState(false);
  // Controls the CSS class that drives the enter/exit animation
  const [visible, setVisible] = useState(false);

  // --- Drag state (refs to avoid re-renders during gesture) ---
  const dragStartY = useRef(0);
  const currentTranslateY = useRef(0);
  const isDragging = useRef(false);

  // ─── Mount / Unmount lifecycle ───────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Allow one frame for the DOM to paint at translateY(100%) before animating in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      document.body.style.overflow = "hidden";
    } else {
      // Animate out, then unmount
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "auto";
      }, ANIMATION_MS);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "auto";
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
    const clamped = Math.max(0, y); // only allow dragging downward
    sheetRef.current.style.transform = `translateY(${clamped}px)`;
    // Fade backdrop proportionally
    const sheetHeight = sheetRef.current.offsetHeight || 1;
    const opacity = Math.max(0, 1 - clamped / sheetHeight);
    backdropRef.current.style.opacity = String(opacity);
  }, []);

  const handleDragStart = useCallback(
    (clientY: number) => {
      if (!sheetRef.current) return;
      isDragging.current = true;
      dragStartY.current = clientY;
      currentTranslateY.current = 0;
      // Remove transition while dragging for instant feedback
      sheetRef.current.style.transition = "none";
      if (backdropRef.current) backdropRef.current.style.transition = "none";
    },
    []
  );

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

    // Re-enable transition for the snap / close animation
    sheetRef.current.style.transition = "";
    if (backdropRef.current) backdropRef.current.style.transition = "";

    const sheetHeight = sheetRef.current.offsetHeight || 1;
    if (currentTranslateY.current / sheetHeight > closeThreshold) {
      // Close
      onClose();
    } else {
      // Snap back
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
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-on-background/20 backdrop-blur-sm"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${ANIMATION_MS}ms cubic-bezier(.4,0,.2,1)`,
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-md bg-surface h-[85vh] sm:h-[80vh] sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: `transform ${ANIMATION_MS}ms cubic-bezier(.4,0,.2,1)`,
        }}
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
