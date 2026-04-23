import { useEffect, useRef } from 'react';

/**
 * A confirmation modal with backdrop blur and smooth animations.
 *
 * @param {boolean}  open       - Whether the modal is visible
 * @param {string}   title      - Modal heading
 * @param {string}   message    - Body text / question
 * @param {string}   confirmLabel - Text for the confirm button (default "Confirmar")
 * @param {string}   cancelLabel  - Text for the cancel button (default "Cancelar")
 * @param {function} onConfirm  - Called when the user confirms
 * @param {function} onCancel   - Called when the user cancels
 */
export default function ConfirmModal({
  open,
  title = 'Confirmação',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  // Trap focus: auto‑focus cancel button when modal opens
  const cancelBtnRef = useRef(null);
  useEffect(() => {
    if (open) {
      cancelBtnRef.current?.focus();
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      data-testid="confirm-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={onCancel}
        data-testid="confirm-modal-backdrop"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className="
          relative z-10 w-[90vw] max-w-sm rounded-2xl p-6
          bg-bg-card border border-white/10
          shadow-[0_0_60px_rgba(168,85,247,.15)]
          animate-[scaleIn_200ms_ease-out]
        "
      >
        <h2
          id="confirm-modal-title"
          className="text-lg font-bold text-text-primary mb-2"
        >
          {title}
        </h2>

        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg text-sm font-semibold
              bg-bg-elevated text-text-secondary border border-white/10
              hover:bg-white/10 active:scale-95
              transition-all duration-200 cursor-pointer
            "
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg text-sm font-semibold
              bg-accent-rose/20 text-accent-rose border border-accent-rose/30
              hover:bg-accent-rose/30 active:scale-95
              transition-all duration-200 cursor-pointer
            "
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
