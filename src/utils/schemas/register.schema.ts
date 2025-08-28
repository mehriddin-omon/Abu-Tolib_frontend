import { z } from "zod";

export const registerSchema = z
    .object({
        firstName: z.string().min(6, { message: "Ismingizni kiriting" }),
        lastName: z.string().min(6, { message: "Familiyangizni kiriting" }),
        userName: z.string().min(6, { message: "Taxallus noyob bo'lishi lozim" }),
        password: z.string().min(6, { message: "Parolni kiriting" }),
        birthDate: z.coerce.date({ message: "Tug'ilgan sana bo'lishi kerak" }),
        phoneNumber: z.string().regex(/^\d{9}$/, { message: "Telefon raqam bo'lishi kerak" }),
        // confirmPassword: z.string().min(1, { message: "Ismingizni kiriting" }),
    })
// agarda parolni tekshirish kerak bo'lsa
// .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Parol bir xil emas",
// });