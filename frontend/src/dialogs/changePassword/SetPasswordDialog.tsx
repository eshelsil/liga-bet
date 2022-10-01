import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '../../widgets/Buttons/LoadingButton';
import PasswordField from '../../widgets/inputs/PasswordField';
import { validationSchema } from './schema';
import { ChangePasswordFormParams } from './types';
import './style.scss';


interface Props {
  open: boolean,
  onClose: () => void,
  setPassword: (...args: any) => Promise<void>,
}

export default function SetPasswordDialog({
    open,
    onClose,
    setPassword,
}: Props) {
	const { handleSubmit, register, formState, clearErrors} = useForm<ChangePasswordFormParams>({
		resolver: yupResolver(validationSchema),
		reValidateMode: 'onSubmit',
		shouldFocusError: false,
	})
	const { errors, isSubmitting } = formState;
	const submit = async ({password, confirmPassword}: ChangePasswordFormParams) => {
		await setPassword(password, confirmPassword);
	}

  return (
    <Dialog open={open} onClose={onClose}>
      <div className='LigaBet-SetPasswordDialog'>
        <DialogTitle>
            <IconButton
              onClick={onClose}
              className={'close_button'}
            >
              <CloseIcon />
            </IconButton>
            עדכן סיסמה
        </DialogTitle>
        <DialogContent>
          <div className={'dialog_content'}>
            <PasswordField
              label={'סיסמה נוכחית'}
              error={errors.currentPassword?.message}
              InputProps={{...register('currentPassword')}}
              clearErrors={() => clearErrors('currentPassword')}
              />
            <PasswordField
              label={'סיסמה חדשה'}
              error={errors.password?.message}
              InputProps={{...register('password')}}
              clearErrors={() => clearErrors('password')}
              />
            <PasswordField
              label={'ודא סיסמה'}
              error={errors.confirmPassword?.message}
              InputProps={{...register('confirmPassword')}}
              clearErrors={() => clearErrors('confirmPassword')}
            />
            <LoadingButton
              onClick={handleSubmit(submit)}
              loading={isSubmitting}
            >
              עדכן סיסמה
            </LoadingButton>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
