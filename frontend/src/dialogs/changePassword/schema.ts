import * as yup from 'yup';


const passwordValidation = yup
  .string()
  .min(4, 'סיסמה חייבת להכיל לפחות 4 תווים')
  .required('חובה למלא שדה זה');

export const validationSchema = yup.object({
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .required('חובה למלא שדה זה')
    .oneOf(
      [yup.ref('password')],
      'הסיסמה לא תואמת את הסיסמה למעלה'
    ),
  currentPassword: yup
    .string()
    .required('חובה למלא שדה זה')
})