import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginRequiredDialog = ({
  open,
  onOpenChange,
}: LoginRequiredDialogProps) => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const handleLogin = () => {
    onOpenChange(false);
    navigate('/login');
  };

  const handleSignup = () => {
    onOpenChange(false);
    navigate('/signup');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('loginRequired.title')}</DialogTitle>
          <DialogDescription>
            {t('loginRequired.message')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t('loginRequired.cancelButton')}
          </Button>
          <Button
            variant="outline"
            onClick={handleLogin}
            className="w-full sm:w-auto"
          >
            {t('loginRequired.loginButton')}
          </Button>
          <Button
            onClick={handleSignup}
            className="w-full sm:w-auto"
          >
            {t('loginRequired.signupButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
