import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PageTransition } from '@/components/PageTransition';
import { signupSchema, type SignupFormValues } from '@/lib/validations';
import { DEFAULT_COUNTRY } from '@/lib/countries';
import { useAuth } from '@/hooks/use-auth';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Map country dial code to country_id for the API
const COUNTRY_CODE_TO_ID: Record<string, number> = {
  '+974': 1,
  '+966': 2,
  '+971': 3,
  '+965': 4,
  '+973': 5,
  '+968': 6,
  '+962': 7,
  '+20': 8,
};

const Signup = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { signup, verifyCode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingPhone, setPendingPhone] = useState('');
  const [pendingCountryCode, setPendingCountryCode] = useState('');

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      countryCode: DEFAULT_COUNTRY.dialCode,
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      const result = await signup({
        name: data.name,
        countryCode: data.countryCode,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms,
      });

      if (result.success) {
        if (result.verificationRequired) {
          // Show verification code input
          setPendingPhone(data.phone);
          setPendingCountryCode(data.countryCode);
          setShowVerification(true);
          toast.info(t('signup.verificationSent', { defaultValue: 'Verification code sent to your phone' }));
        } else {
          toast.success(t('success.signupSuccess'));
          navigate('/');
        }
      } else {
        if (result.error === 'phoneExists') {
          toast.error(t('validation.phoneExists', { defaultValue: 'An account with this phone number already exists' }));
        } else {
          toast.error(result.error || t('validation.signupError', { defaultValue: 'Failed to create account. Please try again.' }));
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(t('validation.signupError', { defaultValue: 'Failed to create account. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 4) {
      toast.error(t('validation.codeRequired', { defaultValue: 'Please enter the 4-digit code' }));
      return;
    }

    setIsLoading(true);

    try {
      const countryId = COUNTRY_CODE_TO_ID[pendingCountryCode] || 1;
      const result = await verifyCode(pendingPhone, verificationCode, countryId);

      if (result.success) {
        toast.success(t('success.signupSuccess'));
        navigate('/');
      } else {
        toast.error(result.error || t('validation.invalidCode', { defaultValue: 'Invalid verification code' }));
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(t('validation.invalidCode', { defaultValue: 'Invalid verification code' }));
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Button
              variant="ghost"
              onClick={() => setShowVerification(false)}
              className="mb-6"
            >
              <ChevronLeft className="h-4 w-4 me-1" />
              {t('signup.backToSignup', { defaultValue: 'Back' })}
            </Button>

            <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {t('signup.verifyPhone', { defaultValue: 'Verify your phone' })}
                </h1>
                <p className="text-muted-foreground">
                  {t('signup.enterCode', { defaultValue: 'Enter the 4-digit code sent to' })} {pendingCountryCode}{pendingPhone}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={verificationCode}
                    onChange={setVerificationCode}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyCode}
                  className="w-full"
                  size="lg"
                  disabled={isLoading || verificationCode.length !== 4}
                >
                  {isLoading ? t('signup.verifying', { defaultValue: 'Verifying...' }) : t('signup.verify', { defaultValue: 'Verify' })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-primary hover:underline mb-6"
        >
          <ChevronLeft className="h-4 w-4 me-1" />
          {t('signup.backToHome', { defaultValue: 'Back to Home' })}
        </Link>

        {/* Signup Form Card */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('signup.title')}
            </h1>
            <p className="text-muted-foreground">{t('signup.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('signup.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('signup.namePlaceholder')}
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {t(errors.name.message as string)}
                </p>
              )}
            </div>

            {/* Phone Input with Country Code */}
            <PhoneInput
              countryCode={watch('countryCode')}
              phone={watch('phone')}
              onCountryCodeChange={(value) => setValue('countryCode', value)}
              onPhoneChange={(value) => setValue('phone', value)}
              phoneError={errors.phone?.message}
              countryCodeError={errors.countryCode?.message}
              disabled={isLoading}
            />

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('signup.password')}</Label>
              <PasswordInput
                id="password"
                value={watch('password')}
                onChange={(value) => setValue('password', value)}
                placeholder={t('signup.passwordPlaceholder')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {t(errors.password.message as string)}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Label>
              <PasswordInput
                id="confirmPassword"
                value={watch('confirmPassword')}
                onChange={(value) => setValue('confirmPassword', value)}
                placeholder={t('signup.confirmPasswordPlaceholder')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {t(errors.confirmPassword.message as string)}
                </p>
              )}
            </div>

            {/* Accept Terms */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={watch('acceptTerms')}
                  onCheckedChange={(checked) =>
                    setValue('acceptTerms', checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm font-normal cursor-pointer leading-relaxed"
                >
                  {t('signup.acceptTerms')}
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-destructive">
                  {t(errors.acceptTerms.message as string)}
                </p>
              )}
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? t('signup.signingUp', { defaultValue: 'Creating account...' }) : t('signup.signupButton')}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('signup.haveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('signup.loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default Signup;
