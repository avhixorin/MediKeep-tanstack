import { z } from "zod";
import { UserRole } from "#/types";

/* -------------------------------------------------------------------------- */
/*                              Personal Information                          */
/* -------------------------------------------------------------------------- */

export const personalInfoSchema = z
  .object({
    role: z.enum(UserRole),

    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name must be at most 50 characters")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "First name can only contain letters"
      ),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name must be at most 50 characters")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "Last name can only contain letters"
      ),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(100, "Email is too long")
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(
        /^\+?[0-9\s()-]{10,15}$/,
        "Please enter a valid phone number"
      ),

    medicalLicenseNumber: z
      .string()
      .trim()
      .max(50, "Medical license number is too long"),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === UserRole.DOCTOR &&
      data.medicalLicenseNumber.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["medicalLicenseNumber"],
        message: "Medical license number is required",
      });
    }
  });

/* -------------------------------------------------------------------------- */
/*                                  Security                                  */
/* -------------------------------------------------------------------------- */

export const securitySchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

/* -------------------------------------------------------------------------- */
/*                                    OTP                                     */
/* -------------------------------------------------------------------------- */

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

/* -------------------------------------------------------------------------- */
/*                           Complete Registration                            */
/* -------------------------------------------------------------------------- */

export const registrationSchema = z
  .object({
    role: z.enum(UserRole),

    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name must be at most 50 characters")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "First name can only contain letters"
      ),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name must be at most 50 characters")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "Last name can only contain letters"
      ),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(100, "Email is too long")
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(
        /^\+?[0-9\s()-]{10,15}$/,
        "Please enter a valid phone number"
      ),

    licenseNumber: z
      .string()
      .trim()
      .max(50, "License number is too long"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === UserRole.DOCTOR &&
      data.licenseNumber.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["licenseNumber"],
        message: "Medical license number is required",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

export type SecurityData = z.infer<typeof securitySchema>;

export type OtpData = z.infer<typeof otpSchema>;

export type RegistrationFormData = z.infer<typeof registrationSchema>;