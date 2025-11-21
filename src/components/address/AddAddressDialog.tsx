import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressForm } from "./AddressForm";
import type { SavedAddress } from "@/types/order";

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: SavedAddress;
  onSubmit: (data: Omit<SavedAddress, 'id'>) => void;
}

export const AddAddressDialog = ({ open, onOpenChange, address, onSubmit }: AddAddressDialogProps) => {
  const { t } = useTranslation('common');

  const handleSubmit = (data: Omit<SavedAddress, 'id'>) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {address ? t('addresses.edit') : t('addresses.addNew')}
          </DialogTitle>
        </DialogHeader>
        <AddressForm
          address={address}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
