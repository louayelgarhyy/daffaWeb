import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { SavedAddress } from "@/types/order";
import { getAddressTitleSuggestions } from "@/lib/addressTitles";

const addressFormSchema = z.object({
  title: z.string().min(2, 'checkout:validation.nameMin').max(50),
  fullName: z.string().min(1, 'checkout:validation.nameRequired'),
  addressLine1: z.string().min(1, 'checkout:validation.addressRequired'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'checkout:validation.cityRequired'),
  region: z.string().min(1, 'checkout:validation.regionRequired'),
  postalCode: z.string().min(1, 'checkout:validation.postalCodeRequired'),
  country: z.string().min(1, 'checkout:validation.countryRequired'),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormProps {
  address?: SavedAddress;
  onSubmit: (data: Omit<SavedAddress, 'id'>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const AddressForm = ({ address, onSubmit, onCancel, submitLabel }: AddressFormProps) => {
  const { t, i18n } = useTranslation(['common', 'checkout']);
  const titleSuggestions = getAddressTitleSuggestions(i18n.language);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: address || {
      title: '',
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'sa',
      isDefault: false,
    },
  });

  const isDefault = watch('isDefault');

  const handleFormSubmit = (data: AddressFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Address Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t('common:addresses.addressTitle')}</Label>
        <Input
          id="title"
          placeholder={t('common:addresses.titlePlaceholder')}
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{t(errors.title.message as string)}</p>
        )}

        {/* Quick select buttons */}
        <div className="flex flex-wrap gap-2">
          {titleSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue('title', suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">{t('checkout:shipping.fullName')}</Label>
        <Input
          id="fullName"
          placeholder={t('checkout:shipping.fullNamePlaceholder')}
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{t(errors.fullName.message as string)}</p>
        )}
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">{t('checkout:shipping.country')}</Label>
        <Select
          defaultValue={address?.country || 'sa'}
          onValueChange={(value) => setValue('country', value)}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder={t('checkout:shipping.countryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sa">{t('checkout:countries.sa')}</SelectItem>
            <SelectItem value="ae">{t('checkout:countries.ae')}</SelectItem>
            <SelectItem value="kw">{t('checkout:countries.kw')}</SelectItem>
            <SelectItem value="qa">{t('checkout:countries.qa')}</SelectItem>
            <SelectItem value="bh">{t('checkout:countries.bh')}</SelectItem>
            <SelectItem value="om">{t('checkout:countries.om')}</SelectItem>
            <SelectItem value="jo">{t('checkout:countries.jo')}</SelectItem>
            <SelectItem value="eg">{t('checkout:countries.eg')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-sm text-destructive">{t(errors.country.message as string)}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div className="space-y-2">
        <Label htmlFor="addressLine1">{t('checkout:shipping.addressLine1')}</Label>
        <Input
          id="addressLine1"
          placeholder={t('checkout:shipping.addressLine1Placeholder')}
          {...register('addressLine1')}
        />
        {errors.addressLine1 && (
          <p className="text-sm text-destructive">{t(errors.addressLine1.message as string)}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="space-y-2">
        <Label htmlFor="addressLine2">{t('checkout:shipping.addressLine2')}</Label>
        <Input
          id="addressLine2"
          placeholder={t('checkout:shipping.addressLine2Placeholder')}
          {...register('addressLine2')}
        />
      </div>

      {/* City & Region */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{t('checkout:shipping.city')}</Label>
          <Input
            id="city"
            placeholder={t('checkout:shipping.cityPlaceholder')}
            {...register('city')}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{t(errors.city.message as string)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">{t('checkout:shipping.region')}</Label>
          <Input
            id="region"
            placeholder={t('checkout:shipping.regionPlaceholder')}
            {...register('region')}
          />
          {errors.region && (
            <p className="text-sm text-destructive">{t(errors.region.message as string)}</p>
          )}
        </div>
      </div>

      {/* Postal Code */}
      <div className="space-y-2">
        <Label htmlFor="postalCode">{t('checkout:shipping.postalCode')}</Label>
        <Input
          id="postalCode"
          placeholder={t('checkout:shipping.postalCodePlaceholder')}
          {...register('postalCode')}
        />
        {errors.postalCode && (
          <p className="text-sm text-destructive">{t(errors.postalCode.message as string)}</p>
        )}
      </div>

      {/* Set as Default */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(checked) => setValue('isDefault', checked as boolean)}
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          {t('common:addresses.setDefault')}
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground">
          {submitLabel || (address ? t('common:addresses.updateAddress') : t('common:addresses.saveAddress'))}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common:addresses.cancel')}
          </Button>
        )}
      </div>
    </form>
  );
};
