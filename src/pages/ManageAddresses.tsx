import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddressCard } from "@/components/address/AddressCard";
import { AddAddressDialog } from "@/components/address/AddAddressDialog";
import {
  getSavedAddresses,
  saveAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/addressUtils";
import type { SavedAddress } from "@/types/order";

const ManageAddresses = () => {
  const { t } = useTranslation('common');
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | undefined>();
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = () => {
    const savedAddresses = getSavedAddresses();
    setAddresses(savedAddresses);
  };

  const handleAddNew = () => {
    setEditingAddress(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Omit<SavedAddress, 'id'>) => {
    if (editingAddress) {
      // Update existing address
      updateAddress(editingAddress.id, data);
      toast.success(t('addresses.updateAddress') + '!');
    } else {
      // Save new address
      saveAddress(data);
      toast.success(t('addresses.saveAddress') + '!');
    }
    loadAddresses();
  };

  const handleDelete = (id: string) => {
    setDeletingAddressId(id);
  };

  const confirmDelete = () => {
    if (deletingAddressId) {
      deleteAddress(deletingAddressId);
      toast.success(t('addresses.delete') + 'd successfully!');
      loadAddresses();
      setDeletingAddressId(null);
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    toast.success(t('addresses.setDefault') + '!');
    loadAddresses();
  };

  if (addresses.length === 0 && !isDialogOpen) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card-secondary py-12 border-b border-border">
          <div className="container px-4">
            <h1 className="text-4xl font-bold text-foreground">{t('addresses.title')}</h1>
          </div>
        </div>

        <div className="container px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">{t('addresses.noAddresses')}</h2>
            <p className="text-muted-foreground">{t('addresses.noAddressesDesc')}</p>
            <Button
              onClick={handleAddNew}
              className="bg-primary hover:bg-primary-hover text-primary-foreground mt-4"
            >
              <Plus className="h-5 w-5 me-2" />
              {t('addresses.addNew')}
            </Button>
          </div>
        </div>

        <AddAddressDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          address={editingAddress}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card-secondary py-12 border-b border-border">
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{t('addresses.title')}</h1>
              <p className="text-muted-foreground mt-2">
                {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Plus className="h-5 w-5 me-2" />
              {t('addresses.addNew')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <AddAddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        address={editingAddress}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingAddressId} onOpenChange={() => setDeletingAddressId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('addresses.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>{t('addresses.deleteDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('addresses.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('addresses.confirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageAddresses;
