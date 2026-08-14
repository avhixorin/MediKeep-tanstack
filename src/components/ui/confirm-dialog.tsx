import { AlertTriangle, Loader2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md"
          onClick={() => !isLoading && onCancel()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-md dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="absolute top-3 right-3 text-slate-500 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-slate-400"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className={cn(
                'mb-4 flex h-11 w-11 items-center justify-center rounded-full',
                variant === 'destructive'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
              )}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>

            <h2 className="mb-1.5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mb-6 text-sm text-muted-foreground">{description}</p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
