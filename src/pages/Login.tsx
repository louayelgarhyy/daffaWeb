import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PageTransition } from '@/components/PageTransition';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { DEFAULT_COUNTRY } from '@/lib/countries';
import { useAuth } from '@/hooks/use-auth';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { PasswordInput } from '@/components/auth/PasswordInput';

const Login = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: DEFAULT_COUNTRY.dialCode,
      phone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await login({
        countryCode: data.countryCode,
        phone: data.phone,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        toast.success(t('success.loginSuccess'));
        navigate(returnUrl);
      } else {
        toast.error(result.error || t('validation.invalidCredentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('validation.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

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
          {t('login.backToHome', { defaultValue: 'Back to Home' })}
        </Link>

        {/* Login Form Card */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('login.title')}
            </h1>
            <p className="text-muted-foreground">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <Label htmlFor="password">{t('login.password')}</Label>
              <PasswordInput
                id="password"
                value={watch('password')}
                onChange={(value) => setValue('password', value)}
                placeholder={t('login.passwordPlaceholder')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {t(errors.password.message as string)}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={watch('rememberMe')}
                  onCheckedChange={(checked) =>
                    setValue('rememberMe', checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t('login.rememberMe')}
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? t('login.loggingIn', { defaultValue: 'Logging in...' }) : t('login.loginButton')}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('login.noAccount')}{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                {t('login.signUpLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default Login;
