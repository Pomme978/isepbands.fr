'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/utils';

/* -------------------------------- Utilities ------------------------------- */

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Lock scroll on <html> while open */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    if (!locked) return;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [locked]);
}

/** Find focusable elements inside a container */
function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
  );
}

/** Trap focus within a container */
function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Focus first focusable or the container itself
    const focusables = getFocusable(container);
    const previous = document.activeElement as HTMLElement | null;
    (focusables[0] || container).focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const list = getFocusable(container);
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const current = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (current === first || !container.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (current === last || !container.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Restore previous focus
      previous?.focus?.();
    };
  }, [active, containerRef]);
}

/* ------------------------------- Types/Context ---------------------------- */

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  labelledById: string | undefined;
  describedById: string | undefined;
  registerLabel: (id: string | undefined) => void;
  registerDescription: (id: string | undefined) => void;
  requestClose: () => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);
const useDialogCtx = () => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>.');
  return ctx;
};

/* --------------------------------- Root ----------------------------------- */

export type DialogProps = {
  open?: boolean; // controlled
  defaultOpen?: boolean; // uncontrolled
  onOpenChange?: (open: boolean) => void;
  /** Close when pressing Escape (default: true) */
  closeOnEsc?: boolean;
  /** Close when clicking the overlay (outside content) (default: true) */
  closeOnOverlay?: boolean;
  children: React.ReactNode;
};

export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  closeOnEsc = true,
  closeOnOverlay = true,
  children,
}: DialogProps) {
  const isMounted = useIsMounted();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(!!defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : uncontrolledOpen;
  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setUncontrolledOpen(v));

  const [labelledById, setLabelId] = useState<string | undefined>(undefined);
  const [describedById, setDescId] = useState<string | undefined>(undefined);

  // ESC to close
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeOnEsc]);

  const ctx = useMemo<DialogContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      labelledById,
      describedById,
      registerLabel: setLabelId,
      registerDescription: setDescId,
      requestClose: () => setOpen(false),
    }),
    [isOpen, labelledById, describedById],
  );

  // Render children directly; portal happens inside <DialogContent />
  return <DialogContext.Provider value={ctx}>{children}</DialogContext.Provider>;
}

/* -------------------------------- Trigger --------------------------------- */

export function DialogTrigger({
  asChild,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useDialogCtx();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      ...rest,
      onClick: (e: any) => {
        (children as any).props?.onClick?.(e);
        setOpen(true);
      },
    });
  }

  return (
    <button
      type="button"
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        setOpen(true);
      }}
    >
      {children}
    </button>
  );
}

/* -------------------------------- Overlay --------------------------------- */

export function DialogOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, requestClose } = useDialogCtx();
  if (!open) return null;

  // The overlay itself is rendered via the portal in <DialogContent />
  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        // fade in/out
        'opacity-100 transition-opacity duration-200',
        className,
      )}
      {...props}
      onClick={(e) => {
        // The click handler is set on Content’s wrapper for outside-click;
        // overlay alone is visual. We keep this here if a user renders it standalone.
        (props as any).onClick?.(e);
        requestClose();
      }}
    />
  );
}

/* -------------------------------- Content --------------------------------- */

export type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
  /** If true (default), clicking outside the content closes the dialog. */
  closeOnOverlay?: boolean;
  /** If true (default), page scroll is locked while open. */
  lockScroll?: boolean;
  /** Mount inside `document.body` (default true) */
  portal?: boolean;
};

export function DialogContent({
  children,
  className,
  closeOnOverlay = true,
  lockScroll = true,
  portal = true,
}: DialogContentProps) {
  const mounted = useIsMounted();
  const { open, requestClose, labelledById, describedById } = useDialogCtx();

  useScrollLock(open && lockScroll);

  const contentRef = useRef<HTMLDivElement>(null);

  // focus trap
  useFocusTrap(open, contentRef);

  // close on outside click
  const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlay) return;
    // If the target is the backdrop wrapper, close
    if (e.target === e.currentTarget) requestClose();
  };

  if (!open) return null;
  if (portal && !mounted) return null;

  const node = (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-200',
          'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
        )}
        data-state="open"
        onMouseDown={onOverlayMouseDown}
      />

      {/* Content wrapper (for outside click) */}
      <div
        role="presentation"
        className="fixed inset-0 z-50 grid place-items-center"
        onMouseDown={onOverlayMouseDown}
      >
        {/* Dialog content */}
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledById}
          aria-describedby={describedById}
          className={cn(
            'relative w-full max-w-lg mx-4 rounded-lg border bg-background p-6 shadow-lg outline-none',
            // zoom + fade animation
            'transition-transform transition-opacity duration-200',
            'data-[state=open]:opacity-100 data-[state=open]:scale-100',
            'data-[state=closed]:opacity-0 data-[state=closed]:scale-95',
            'opacity-100 scale-100',
            className,
          )}
          tabIndex={-1}
          data-state="open"
          onMouseDown={(e) => {
            // prevent content clicks from closing
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </>
  );

  return portal ? createPortal(node, document.body) : node;
}

/* ---------------------------- Title / Description -------------------------- */

export function DialogTitle({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { registerLabel } = useDialogCtx();
  const idRef = useRef<string>(() => `dlg-${Math.random().toString(36).slice(2)}` as any);
  const [id] = useState(() => `dlg-${Math.random().toString(36).slice(2)}`);
  useLayoutEffect(() => {
    registerLabel(id);
    return () => registerLabel(undefined);
  }, [id, registerLabel]);
  return (
    <h2 id={id} className={cn('text-lg font-semibold leading-none', className)} {...rest}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { registerDescription } = useDialogCtx();
  const [id] = useState(() => `dlg-desc-${Math.random().toString(36).slice(2)}`);
  useLayoutEffect(() => {
    registerDescription(id);
    return () => registerDescription(undefined);
  }, [id, registerDescription]);
  return (
    <p id={id} className={cn('text-sm text-muted-foreground', className)} {...rest}>
      {children}
    </p>
  );
}

/* --------------------------------- Close ---------------------------------- */

export function DialogClose({
  asChild,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { requestClose } = useDialogCtx();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      ...rest,
      onClick: (e: any) => {
        (children as any).props?.onClick?.(e);
        requestClose();
      },
    });
  }

  return (
    <button
      type="button"
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        requestClose();
      }}
    >
      {children ?? <X className="h-4 w-4" />}
    </button>
  );
}

/* --------------------------------- Header/Footer --------------------------- */

export function DialogHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...rest} />
  );
}

export function DialogFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...rest}
    />
  );
}

/* ------------------------------ Convenience UI ---------------------------- */

export function DialogCloseButton({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <DialogClose
      className={cn(
        'absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background',
        className,
      )}
      {...rest}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </DialogClose>
  );
}
