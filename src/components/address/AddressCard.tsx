import { useTranslation } from "react-i18next";
import { MapPin, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SavedAddress } from "@/types/order";

interface AddressCardProps {
  address: SavedAddress;
  onEdit: (address: SavedAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="font-bold text-foreground text-lg">{address.title}</h3>
          {address.isDefault && (
            <Badge variant="default" className="ms-2">
              {t('addresses.default')}
            </Badge>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-1 mb-4">
        <p className="font-semibold text-foreground">{address.fullName}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.region} {address.postalCode}
        </p>
        <p>{t(`checkout:countries.${address.country}`)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
          className="flex items-center gap-2"
        >
          <Edit className="h-3 w-3" />
          {t('addresses.edit')}
        </Button>

        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address.id)}
            className="flex items-center gap-2"
          >
            <Star className="h-3 w-3" />
            {t('addresses.setDefault')}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(address.id)}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
          {t('addresses.delete')}
        </Button>
      </div>
    </div>
  );
};
