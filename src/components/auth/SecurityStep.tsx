import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import type { FormErrors } from "#/routes/auth/register";
import type { RegistrationFormData } from "#/types";
import { Lock } from "lucide-react";

const SecurityStep = ({
  form,
  setValue,
  errors
}: {
  form: RegistrationFormData;
  setValue: (field: keyof RegistrationFormData, value: string) => void;
  errors: FormErrors | null
}) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Secure account
      </h2>
      <p className="text-slate-500">
        Create a strong password to protect your medical data.
      </p>
    </div>

    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>

        <div className="relative">
          <Lock className={`absolute left-3 top-1/2 h-5 w-5 text-slate-400 ${errors?.password
                ? "-translate-y-[calc(50%+9px)]"
                : "-translate-y-1/2"
                }`} />

          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setValue("password", e.target.value)}
            className={`pl-10 bg-slate-50 h-11 ${errors?.password
              ? "border-red-400 focus-visible:ring-red-500"
              : "border-slate-200"
              }`}
            placeholder="••••••••"
          />
          {errors?.password?.[0] && (
            <p className="text-sm text-red-500">
              {errors.password[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">
          Confirm Password
        </Label>

        <Input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setValue("confirmPassword", e.target.value)}
          className={`bg-slate-50 h-11 ${errors?.confirmPassword
            ? "border-red-400 focus-visible:ring-red-500"
            : "border-slate-200"
            }`}
          placeholder="••••••••"
        />
        {errors?.confirmPassword?.[0] && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword[0]}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default SecurityStep;