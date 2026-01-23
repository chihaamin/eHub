import { RefObject, useEffect, useRef } from "react";

type Options = {
  transitionProps?: string[];
  fallbackMs?: number;
  Maxheight?: number;
};

export function useAnimateHeight(
  containerRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onHidden?: () => void,
  itemCount?: number,
  options: Options = {}
) {
  const prevHeightRef = useRef<number | null>(null);
  const transitionProps = options.transitionProps ?? [
    "opacity",
    "max-height",
    "transform",
    "padding",
  ];
  const fallbackMs = options.fallbackMs ?? 450;

  // Clear after hide animation completes
  useEffect(() => {
    if (isOpen) return;
    const el = containerRef.current;

    if (!el) {
      const t = setTimeout(() => onHidden?.(), fallbackMs - 100);
      return () => clearTimeout(t);
    }

    let cleared = false;

    const onTransitionEnd = (e: TransitionEvent) => {
      if (transitionProps.includes(e.propertyName)) {
        if (!cleared) {
          onHidden?.();
          cleared = true;
        }
      }
    };

    el.addEventListener("transitionend", onTransitionEnd as EventListener);
    const fallback = setTimeout(() => {
      if (!cleared) onHidden?.();
    }, fallbackMs);

    return () => {
      el.removeEventListener("transitionend", onTransitionEnd as EventListener);
      clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Animate height when content changes
  useEffect(() => {
    const el = containerRef.current;
    const list = listRef.current;
    if (!el || !list) return;

    const newH = list.scrollHeight + 20;
    // cap animated height to 400px to match design
    const cap = options.Maxheight ?? 400;
    const cappedH = Math.min(newH, cap);
    const prevH = prevHeightRef.current;

    if (isOpen) {
      if (prevH !== null && prevH === cappedH) return;
      prevHeightRef.current = cappedH;
      el.style.maxHeight = `${cappedH}px`;
    } else {
      if (prevH === 0) return;
      el.style.maxHeight = `${cappedH}px`;
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.getBoundingClientRect();
      el.style.maxHeight = `0px`;
      prevHeightRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount, isOpen]);
}
