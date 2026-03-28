import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Debe ser un correo válido')
    .refine((email) => email.endsWith('@uts.edu.co'), {
      message: 'Solo se permiten correos institucionales @uts.edu.co',
    }),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Debe ser un correo válido')
    .refine((email) => email.endsWith('@uts.edu.co'), {
      message: 'Solo se permiten correos institucionales @uts.edu.co',
    }),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña debe tener máximo 50 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos 1 mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos 1 minúscula')
    .regex(/\d/, 'La contraseña debe contener al menos 1 número')
    .regex(/[@$!%*?&]/, 'La contraseña debe contener al menos 1 carácter especial (@$!%*?&)'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmación de contraseña es requerida'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  
  if (score <= 2) return { score, label: 'Débil', color: 'text-red-500' };
  if (score <= 4) return { score, label: 'Media', color: 'text-yellow-500' };
  return { score, label: 'Fuerte', color: 'text-green-500' };
};
