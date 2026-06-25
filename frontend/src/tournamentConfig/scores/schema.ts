import * as yup from 'yup';
import i18n from '@/i18n/config';


const passwordValidation = yup
  .string()
  .min(4, () => i18n.t('tournamentConfig:errors.minPassword'))
  .required(() => i18n.t('tournamentConfig:errors.required'));

export const validationSchema = yup.object({
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .required(() => i18n.t('tournamentConfig:errors.required'))
    .oneOf(
      [yup.ref('password')],
      () => i18n.t('tournamentConfig:errors.passwordMismatch')
    ),
})
