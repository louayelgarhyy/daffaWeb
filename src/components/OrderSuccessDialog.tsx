import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface OrderSuccessDialogProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
}

export const OrderSuccessDialog = ({
  open,
  orderId,
  onClose,
}: OrderSuccessDialogProps) => {
  const { t } = useTranslation('checkout');

  // Auto-close after 3 seconds
  useEffect(() => {
    if (open && orderId) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, orderId, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            {/* Success Animation */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <CheckCircle2 className="h-24 w-24 text-success opacity-75" />
              </div>
              <CheckCircle2 className="h-24 w-24 text-success relative animate-bounce" />
            </div>

            {/* Success Message */}
            <DialogTitle className="text-2xl font-bold text-center mt-6">
              {t('success.title', { defaultValue: 'Order Placed Successfully!' })}
            </DialogTitle>

            {orderId && (
              <DialogDescription className="text-center mt-2">
                {t('success.orderNumber', { defaultValue: 'Order #' })} {orderId}
              </DialogDescription>
            )}

            <p className="text-sm text-muted-foreground text-center mt-4">
              {t('success.message', { defaultValue: 'Thank you for your order. You will be redirected to order details...' })}
            </p>

            {/* View Order Button */}
            <Button
              onClick={onClose}
              className="mt-6 w-full"
              size="lg"
            >
              {t('success.viewOrder', { defaultValue: 'View Order Details' })}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
