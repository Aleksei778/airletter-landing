"use client"

import { useEffect, useRef } from "react"

type Props = {
  open: boolean
  title: string
  text: string
  confirmLabel: string
  cancelLabel: string
  busy?: boolean
  onConfirm: () => void
  onClose: () => void
}

/** Replaces window.confirm: a native <dialog> traps focus and closes on Esc */
export function ConfirmDialog({ open, title, text, confirmLabel, cancelLabel, busy, onConfirm, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // a click on the backdrop lands on the dialog element itself
      onClick={(e) => e.target === e.currentTarget && !busy && onClose()}
      onCancel={(e) => busy && e.preventDefault()}
      aria-labelledby="confirm-title"
      className="m-auto w-[calc(100%-32px)] max-w-[440px] rounded-2xl bg-deep p-0 text-paper shadow-[inset_0_0_0_1px_var(--color-line)] backdrop:bg-ink/70 backdrop:backdrop-blur-sm open:animate-[dialog-in_0.2s_ease-out]"
    >
      <div className="p-8">
        <h2 id="confirm-title" className="font-head text-xl font-medium tracking-[-0.02em]">
          {title}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">{text}</p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="btn btn-ghost btn-sm" autoFocus>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={busy} className="btn btn-sm">
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
