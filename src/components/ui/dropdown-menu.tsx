'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import { cn } from '@/utils/utils';

/* ---------- helpers (NEW) ---------- */
function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (v: T) => void;
}) {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? (value as T) : internal;
  const setState = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [state, setState] as const;
}

/* ---------- context (NEW) ---------- */
type DMContext = {
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  open: boolean;
  setOpen: (v: boolean) => void;
  closeOnTriggerOutOfView: boolean;
};
const DropdownMenuCtx = React.createContext<DMContext | null>(null);

/* ---------- Root: now controlled + auto-close on out-of-view (NEW) ---------- */
function DropdownMenu({
  open: openProp,
  defaultOpen,
  onOpenChange,
  closeOnTriggerOutOfView = true, // <- configurable
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
  closeOnTriggerOutOfView?: boolean;
}) {
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const triggerRef = React.useRef<HTMLElement | null>(null);

  // Close when the trigger is no longer visible in the viewport
  React.useEffect(() => {
    if (!open || !closeOnTriggerOutOfView) return;
    const el = triggerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setOpen(false);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [open, closeOnTriggerOutOfView, setOpen]);

  return (
    <DropdownMenuCtx.Provider value={{ triggerRef, open, setOpen, closeOnTriggerOutOfView }}>
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </DropdownMenuCtx.Provider>
  );
}

/* ---------- Portal unchanged ---------- */
function DropdownMenuPortal(props: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

/* ---------- Trigger: forwards ref into our context (NEW) ---------- */
const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(function DMTrigger(props, ref) {
  const ctx = React.useContext(DropdownMenuCtx);

  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      ref={composeRefs(ref, ctx?.triggerRef)}
      {...props}
    />
  );
});

/* ---------- Content: Enhanced with height-based dropdown animation ---------- */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  maxHeight = 400,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  maxHeight?: number;
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const content = contentRef.current;
    const measurer = measureRef.current;
    if (!content || !measurer) return;

    let animationFrame: number;

    const measureHeight = () => {
      // Clone content to measurer for height calculation
      measurer.innerHTML = content.innerHTML;
      const height = Math.min(measurer.offsetHeight, maxHeight);
      measurer.innerHTML = '';
      return height;
    };

    const handleStateChange = () => {
      const state = content.getAttribute('data-state');

      if (state === 'open' && !isInitialized) {
        // First time opening - set up initial state
        setIsInitialized(true);

        const targetHeight = measureHeight();

        // Start collapsed
        content.style.height = '0px';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';
        content.style.overflow = 'hidden';
        content.style.transition =
          'height 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out, transform 200ms ease-out';

        // Expand on next frame
        animationFrame = requestAnimationFrame(() => {
          animationFrame = requestAnimationFrame(() => {
            content.style.height = `${targetHeight}px`;
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
          });
        });

        // Set final state after animation
        setTimeout(() => {
          if (content.getAttribute('data-state') === 'open') {
            content.style.height = 'auto';
            content.style.maxHeight = `${maxHeight}px`;
            content.style.overflow = targetHeight >= maxHeight ? 'auto' : 'visible';
            content.style.transition = '';
          }
        }, 260);
      } else if (state === 'open' && isInitialized) {
        // Subsequent openings
        const targetHeight = measureHeight();

        content.style.height = '0px';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';
        content.style.overflow = 'hidden';
        content.style.transition =
          'height 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out, transform 200ms ease-out';

        animationFrame = requestAnimationFrame(() => {
          animationFrame = requestAnimationFrame(() => {
            content.style.height = `${targetHeight}px`;
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
          });
        });

        setTimeout(() => {
          if (content.getAttribute('data-state') === 'open') {
            content.style.height = 'auto';
            content.style.maxHeight = `${maxHeight}px`;
            content.style.overflow = targetHeight >= maxHeight ? 'auto' : 'visible';
            content.style.transition = '';
          }
        }, 260);
      } else if (state === 'closed') {
        // Closing animation
        const currentHeight = content.offsetHeight;
        content.style.height = `${currentHeight}px`;
        content.style.maxHeight = 'none';
        content.style.overflow = 'hidden';
        content.style.transition =
          'height 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-in, transform 200ms ease-in';

        animationFrame = requestAnimationFrame(() => {
          content.style.height = '0px';
          content.style.opacity = '0';
          content.style.transform = 'translateY(-10px)';
        });
      }
    };

    // Watch for state changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          handleStateChange();
        }
      });
    });

    observer.observe(content, {
      attributes: true,
      attributeFilter: ['data-state'],
    });

    // Check initial state
    setTimeout(() => {
      const initialState = content.getAttribute('data-state');
      if (initialState === 'open') {
        handleStateChange();
      }
    }, 0);

    return () => {
      observer.disconnect();
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [maxHeight, isInitialized]);

  return (
    <>
      {/* Hidden measurer element outside portal */}
      <div
        ref={measureRef}
        className={cn(
          'bg-popover text-popover-foreground min-w-[8rem] rounded-md border p-1',
          className,
        )}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      />

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={contentRef}
          data-slot="dropdown-menu-content"
          sideOffset={sideOffset}
          className={cn(
            // base styles
            'bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-md',
            className,
          )}
          style={{
            maxHeight: `${maxHeight}px`,
          }}
          {...props}
        />
      </DropdownMenuPrimitive.Portal>
    </>
  );
}

/* ---------- The rest stays as you had ---------- */
function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>,
) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>,
) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className="bg-border -mx-1 my-1 h-px"
      {...props}
    />
  );
}

function DropdownMenuShortcut(props: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className="text-muted-foreground ml-auto text-xs tracking-widest"
      {...props}
    />
  );
}

function DropdownMenuSub(props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 origin-(--radix-dropdown-menu-content-transform-origin)',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
        'data-[side=right]:data-[state=open]:slide-in-from-left-2 data-[side=right]:data-[state=closed]:slide-out-to-left-2',
        'data-[side=left]:data-[state=open]:slide-in-from-right-2 data-[side=left]:data-[state=closed]:slide-out-to-right-2',
        'data-[side=bottom]:data-[state=open]:slide-in-from-top-2 data-[side=bottom]:data-[state=closed]:slide-out-to-top-2',
        'data-[side=top]:data-[state=open]:slide-in-from-bottom-2 data-[side=top]:data-[state=closed]:slide-out-to-bottom-2',
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
