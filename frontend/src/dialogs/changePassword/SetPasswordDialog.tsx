import React from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ButtonWithLoader from '../../widgets/Buttons/ButtonWithLoader'
import PasswordField from '../../widgets/inputs/PasswordField'
import { validationSchema } from './schema'
import { ChangePasswordFormParams } from './types'
import { UpdatePasswordParams } from '../../api/users'
import './style.scss'

interface Props {
    open: boolean
    onClose: () => void
    setPassword: (params: UpdatePasswordParams) => Promise<any>
}

export default function SetPasswordDialog({
    open,
    onClose,
    setPassword,
}: Props) {
    const { t } = useTranslation('dialogs')
    const { handleSubmit, register, formState, clearErrors, reset } =
        useForm<ChangePasswordFormParams>({
            resolver: yupResolver(validationSchema),
            reValidateMode: 'onSubmit',
            shouldFocusError: false,
        })
    const { errors, isSubmitting } = formState

    const close = () => {
        reset({
            password: '',
            confirmPassword: '',
        })
        onClose()
    }

    const submit = async ({
        password,
        confirmPassword,
    }: ChangePasswordFormParams) => {
        await setPassword({
            new_password: password,
            new_password_confirmation: confirmPassword,
        }).then(() => {
            ;(window as any).toastr['success'](t('changePassword.success'))
            close()
        })
    }

    return (
        <Dialog open={open} onClose={close}>
            <div className="LigaBet-SetPasswordDialog">
                <DialogTitle>
                    <IconButton onClick={close} className={'close_button'}>
                        <CloseIcon />
                    </IconButton>
                    {t('changePassword.title')}
                </DialogTitle>
                <DialogContent>
                    <div className={'dialog_content'}>
                        <PasswordField
                            label={t('changePassword.newPasswordLabel')}
                            error={errors.password?.message}
                            InputProps={{ ...register('password') }}
                            clearErrors={() => clearErrors('password')}
                        />
                        <PasswordField
                            label={t('changePassword.confirmPasswordLabel')}
                            error={errors.confirmPassword?.message}
                            InputProps={{ ...register('confirmPassword') }}
                            clearErrors={() => clearErrors('confirmPassword')}
                        />
                        <ButtonWithLoader
                            onClick={handleSubmit(submit)}
                            loading={isSubmitting}
                        >
                            {t('changePassword.submit')}
                        </ButtonWithLoader>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
