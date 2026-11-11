// Аркуш знизу (телефон) / бічна панель (ПК) на <dialog>: Esc, підкладка, тягнення вниз, повернення фокусу.
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Sheet({
  open,
  onClose,
  label,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const close = () => {
    const dialog = ref.current;
    if (!dialog || closing.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closing.current = true;
    dialog.classList.add("is-closing");
    window.setTimeout(() => {
      closing.current = false;
      dialog.classList.remove("is-closing");
      dialog.querySelector<HTMLElement>(".sheet-panel")?.style.removeProperty("transform");
      onClose();
    }, reduced ? 0 : 240);
  };
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.classList.add("sheet-open");
    } else if (!open && dialog.open) {
      dialog.close();
      document.documentElement.classList.remove("sheet-open");
      opener.current?.focus({ preventScroll: true });
    }
  }, [open]);
  // Drag the handle down to close (30 % of the panel or a flick > 500 px/s).
  useEffect(() => {
    const dialog = ref.current;
    const handle = dialog?.querySelector<HTMLElement>(".sheet-grip");
    const panel = dialog?.querySelector<HTMLElement>(".sheet-panel");
    if (!handle || !panel) return;
    let y0 = 0, t0 = 0, dy = 0, id = -1;
    const down = (e: PointerEvent) => { id = e.pointerId; y0 = e.clientY; t0 = e.timeStamp; dy = 0; handle.setPointerCapture(id); };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      dy = Math.max(0, e.clientY - y0);
      panel.style.transform = `translateY(${dy}px)`;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      const v = (dy / Math.max(1, e.timeStamp - t0)) * 1000;
      if (dy > panel.offsetHeight * 0.3 || v > 500) close();
      else panel.style.removeProperty("transform");
    };
    handle.addEventListener("pointerdown", down);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
    return () => {
      handle.removeEventListener("pointerdown", down);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
    };
  });
  return (
    <dialog
      ref={ref}
      className={"sheet " + className}
      aria-label={label}
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="sheet-panel">
        <div className="sheet-grip" aria-hidden="true"><span /></div>
        <button type="button" className="sheet-close" onClick={close}>Закрити <X size={18} /></button>
        {children}
      </div>
    </dialog>
  );
}
