import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { SavedAddress } from "@/types/order";
import { getAddressTitleSuggestions } from "@/lib/addressTitles";
import { useCities } from "@/hooks/use-cities";

const addressFormSchema = z.object({
  title: z.string().min(2, 'checkout:validation.nameMin').max(50),
  fullName: z.string().min(1, 'checkout:validation.nameRequired'),
  phone: z.string().optional(),
  addressLine1: z.string().min(1, 'checkout:validation.addressRequired'),
  addressLine2: z.string().optional(),
  cityId: z.string().min(1, 'checkout:validation.cityRequired'),
  areaId: z.string().min(1, 'checkout:validation.regionRequired'),
  postalCode: z.string().optional(),
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
  const { cities, isLoading: citiesLoading, getAreasForCity } = useCities(1);
  const [areas, setAreas] = useState<{ id: string | number; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      title: address?.title || '',
      fullName: address?.fullName || '',
      phone: address?.phone || '',
      addressLine1: address?.addressLine1 || '',
      addressLine2: address?.addressLine2 || '',
      cityId: address?.cityId || '',
      areaId: address?.areaId || '',
      postalCode: address?.postalCode || '',
      country: address?.country || 'QA',
      isDefault: address?.isDefault || false,
    },
  });

  const isDefault = watch('isDefault');
  const selectedCityId = watch('cityId');

  // Update areas when city changes
  useEffect(() => {
    if (selectedCityId) {
      const cityAreas = getAreasForCity(selectedCityId);
      setAreas(cityAreas);
      // Reset area if current selection is not in new city's areas
      const currentArea = watch('areaId');
      if (currentArea && !cityAreas.find(a => String(a.id) === currentArea)) {
        setValue('areaId', '');
      }
    } else {
      setAreas([]);
    }
  }, [selectedCityId, cities]);

  const handleFormSubmit = (data: AddressFormValues) => {
    const selectedCity = cities.find(c => String(c.id) === data.cityId);
    const selectedArea = areas.find(a => String(a.id) === data.areaId);

    onSubmit({
      title: data.title,
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: selectedCity?.name || '',
      cityId: data.cityId,
      region: selectedArea?.name || '',
      areaId: data.areaId,
      postalCode: data.postalCode || '',
      country: data.country,
      isDefault: data.isDefault,
    });
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

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">{t('checkout:shipping.phone', { defaultValue: 'Phone Number' })}</Label>
        <Input
          id="phone"
          placeholder={t('checkout:shipping.phonePlaceholder', { defaultValue: 'Enter phone number' })}
          {...register('phone')}
        />
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">{t('checkout:shipping.country')}</Label>
        <Select
          defaultValue={address?.country || 'QA'}
          onValueChange={(value) => setValue('country', value)}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder={t('checkout:shipping.countryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SA">{t('checkout:countries.sa')}</SelectItem>
            <SelectItem value="AE">{t('checkout:countries.ae')}</SelectItem>
            <SelectItem value="KW">{t('checkout:countries.kw')}</SelectItem>
            <SelectItem value="QA">{t('checkout:countries.qa')}</SelectItem>
            <SelectItem value="BH">{t('checkout:countries.bh')}</SelectItem>
            <SelectItem value="OM">{t('checkout:countries.om')}</SelectItem>
            <SelectItem value="JO">{t('checkout:countries.jo')}</SelectItem>
            <SelectItem value="EG">{t('checkout:countries.eg')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-sm text-destructive">{t(errors.country.message as string)}</p>
        )}
      </div>

      {/* City Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="cityId">{t('checkout:shipping.city')}</Label>
        <Select
          value={selectedCityId}
          onValueChange={(value) => setValue('cityId', value)}
          disabled={citiesLoading}
        >
          <SelectTrigger id="cityId">
            <SelectValue placeholder={citiesLoading ? t('common:loading', { defaultValue: 'Loading...' }) : t('checkout:shipping.cityPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={String(city.id)}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.cityId && (
          <p className="text-sm text-destructive">{t(errors.cityId.message as string)}</p>
        )}
      </div>

      {/* Area Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="areaId">{t('checkout:shipping.region')}</Label>
        <Select
          value={watch('areaId')}
          onValueChange={(value) => setValue('areaId', value)}
          disabled={!selectedCityId || areas.length === 0}
        >
          <SelectTrigger id="areaId">
            <SelectValue placeholder={!selectedCityId ? t('checkout:shipping.selectCityFirst', { defaultValue: 'Select city first' }) : t('checkout:shipping.regionPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={String(area.id)}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.areaId && (
          <p className="text-sm text-destructive">{t(errors.areaId.message as string)}</p>
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

      {/* Postal Code */}
      <div className="space-y-2">
        <Label htmlFor="postalCode">{t('checkout:shipping.postalCode')}</Label>
        <Input
          id="postalCode"
          placeholder={t('checkout:shipping.postalCodePlaceholder')}
          {...register('postalCode')}
        />
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
