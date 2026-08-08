import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Award, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import { UserRole } from "#/types";
import type { RegistrationFormData } from "#/types";
import type { FormErrors } from "#/routes/auth/register";

const PersonalInfoStep = (
  { form, setValue, errors }:
    {
      form: RegistrationFormData;
      setValue: (field: keyof RegistrationFormData, value: string) => void,
      errors: FormErrors | null
    }) => {

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">About you</h2>
        <p className="text-slate-500">Let's get to know you basic details.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => setValue("firstName", e.target.value)}
            className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-indigo-500 h-11"
            placeholder="John"
          />
          {errors?.firstName?.[0] && (
            <p className="text-sm text-red-500">
              {errors.firstName[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => setValue("lastName", e.target.value)}
            className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-indigo-500 h-11"
            placeholder="Doe"
          />
          {errors?.lastName?.[0] && (
            <p className="text-sm text-red-500">
              {errors.lastName[0]}
            </p>
          )}
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
          <div className="relative">
            <User className={`absolute left-3 top-1/2 h-5 w-5 text-slate-400 ${errors?.username
                ? "-translate-y-[calc(50%+9px)]"
                : "-translate-y-1/2"
                }`} />
            <Input
              id="username"
              value={form.username}
              onChange={(e) => setValue("username", e.target.value)}
              className={`pl-10 bg-slate-50 text-slate-900 h-11 ${errors?.username
                ? "border-red-400 focus-visible:ring-red-500"
                : "border-slate-200 focus-visible:ring-indigo-500"
                }`}
              placeholder="johndoe123"
            />

            {errors?.username?.[0] && (
              <p className="text-sm text-red-500">
                {errors.username[0]}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 h-5 w-5 text-slate-400 ${errors?.email
                ? "-translate-y-[calc(50%+9px)]"
                : "-translate-y-1/2"
                }`} />
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setValue("email", e.target.value)}
              className={`pl-10 bg-slate-50 text-slate-900 h-11 ${errors?.email
                ? "border-red-400 focus-visible:ring-red-500"
                : "border-slate-200 focus-visible:ring-indigo-500"
                }`}
              placeholder="johndoe@example.com"
            />

            {errors?.email?.[0] && (
              <p className="text-sm text-red-500">
                {errors.email[0]}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
          <div className="relative">
            <Phone className={`absolute left-3 top-1/2 h-5 w-5 text-slate-400 ${errors?.phone
                ? "-translate-y-[calc(50%+9px)]"
                : "-translate-y-1/2"
                }`} />
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setValue("phone", e.target.value)}
              className={`pl-10 bg-slate-50 text-slate-900 h-11 ${errors?.phone
                ? "border-red-400 focus-visible:ring-red-500"
                : "border-slate-200 focus-visible:ring-indigo-500"
                }`}
              placeholder="+1 (555) 000-0000"
            />

            {errors?.phone?.[0] && (
              <p className="text-sm text-red-500">
                {errors.phone[0]}
              </p>
            )}
          </div>
        </div>

        {
          form.role === UserRole.DOCTOR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-5 bg-teal-50/50 rounded-xl border border-teal-100 space-y-4"
            >
              <h3 className="font-bold text-teal-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-teal-600" />
                Medical Verification
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="medicalLicenseNumber" className="text-teal-800 font-medium">Medical License Number</Label>
                <Input
                  id="medicalLicenseNumber"
                  value={form.medicalLicenseNumber}
                  onChange={(e) => setValue("medicalLicenseNumber", e.target.value)}
                  placeholder="e.g., MED-12345678"
                  className={`bg-white h-11 ${errors?.medicalLicenseNumber
                    ? "border-red-400 focus-visible:ring-red-500"
                    : "border-teal-200 focus-visible:ring-teal-500"
                    }`}
                />

                {errors?.medicalLicenseNumber?.[0] && (
                  <p className="text-sm text-red-500">
                    {errors.medicalLicenseNumber[0]}
                  </p>
                )}
              </div>
            </motion.div>
          )
        }
      </div>

    </div >
  );
}

export default PersonalInfoStep;