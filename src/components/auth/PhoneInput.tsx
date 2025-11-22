import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/countries';

interface PhoneInputProps {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  phoneError?: string;
  countryCodeError?: string;
  disabled?: boolean;
}

export const PhoneInput = ({
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange,
  phoneError,
  countryCodeError,
  disabled = false,
}: PhoneInputProps) => {
  const { t, i18n } = useTranslation('auth');
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      {/* Country Code Selector */}
      <div className="space-y-2">
        <Label htmlFor="countryCode">{t('countryCode.label')}</Label>
        <Select
          value={countryCode}
          onValueChange={onCountryCodeChange}
          disabled={disabled}
        >
          <SelectTrigger id="countryCode">
            <SelectValue placeholder={t('countryCode.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.dialCode}>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{country.dialCode}</span>
                  <span className="text-muted-foreground">
                    {isRTL ? country.nameAr : country.name}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {countryCodeError && (
          <p className="text-sm text-destructive">{t(countryCodeError)}</p>
        )}
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <Label htmlFor="phone">{t('login.phone')}</Label>
        <div className="flex gap-2">
          
          <Input
            id="phone"
            type="tel"
            placeholder={t('login.phonePlaceholder')}
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
        </div>
        {phoneError && (
          <p className="text-sm text-destructive">{t(phoneError)}</p>
        )}
      </div>
    </div>
  );
};
