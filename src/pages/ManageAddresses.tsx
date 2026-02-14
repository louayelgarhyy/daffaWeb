import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";

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
import { useAddresses } from "@/hooks/use-addresses";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiAddress, CreateAddressRequest } from "@/lib/api/types";
import type { SavedAddress } from "@/types/order";

// Map API address to SavedAddress for display
const mapApiToSavedAddress = (addr: ApiAddress): SavedAddress => ({
  id: String(addr.id),
  title: addr.title || 'Address',
  fullName: addr.full_name,
  phone: addr.phone,
  addressLine1: addr.address_line_1,
  addressLine2: addr.address_line_2,
  city: addr.city,
  region: addr.region,
  postalCode: addr.postal_code || '',
  country: addr.country,
  isDefault: addr.is_default,
});

// Map SavedAddress to CreateAddressRequest
const mapSavedToCreate = (addr: Omit<SavedAddress, 'id'>): CreateAddressRequest => ({
  title: addr.title,
  full_name: addr.fullName,
  phone: addr.phone,
  address_line_1: addr.addressLine1,
  address_line_2: addr.addressLine2,
  city: addr.city,
  region: addr.region,
  postal_code: addr.postalCode,
  country: addr.country,
  is_default: addr.isDefault,
});

const ManageAddresses = () => {
  const { t } = useTranslation('common');
  const { 
    addresses: apiAddresses, 
    isLoading, 
    createAddress, 
    updateAddress, 
    deleteAddress, 
    setAsDefault 
  } = useAddresses();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | undefined>();
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  // Map API addresses to SavedAddress format
  const addresses = apiAddresses.map(mapApiToSavedAddress);

  const handleAddNew = () => {
    setEditingAddress(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: Omit<SavedAddress, 'id'>) => {
    const createData = mapSavedToCreate(data);
    
    if (editingAddress) {
      // Update existing address
      await updateAddress(parseInt(editingAddress.id), createData);
    } else {
      // Save new address
      await createAddress(createData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeletingAddressId(id);
  };

  const confirmDelete = async () => {
    if (deletingAddressId) {
      await deleteAddress(parseInt(deletingAddressId));
      setDeletingAddressId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    await setAsDefault(parseInt(id));
  };

  // Loading state
  if (isLoading && addresses.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <div className="bg-card-secondary py-12 border-b border-border">
            <div className="container px-4">
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
          <div className="container px-4 py-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (addresses.length === 0 && !isDialogOpen) {
    return (
      <PageTransition>
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
      </PageTransition>
    );
  }

  return (
    <PageTransition>
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
    </PageTransition>
  );
};

export default ManageAddresses;
