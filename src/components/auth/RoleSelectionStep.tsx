import { CheckCircle, Stethoscope, UserCircle } from "lucide-react";
import type { RegistrationFormData } from "#/types";
import { UserRole } from "#/types";

const RoleSelectionStep = ({ form, setValue }: { form: RegistrationFormData; setValue: (field: keyof RegistrationFormData, value: string | UserRole) => void }) => {
    const role = form.role;
    return (<div className="space-y-6">
        <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">I am a...</h2>
            <p className="text-slate-500">Select your account type to personalize your experience.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <button
                type="button"
                onClick={() => setValue("role", UserRole.PATIENT)}
                className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 text-left ${role === UserRole.PATIENT
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100'
                    : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 bg-white'
                    }`}
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${role === UserRole.PATIENT ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'
                    }`}>
                    <UserCircle className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Patient</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Connect with doctors, manage records, and track your health.</p>

                {role === UserRole.PATIENT && (
                    <div className="absolute top-4 right-4">
                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                )}
            </button>

            <button
                type="button"
                onClick={() => setValue("role", UserRole.DOCTOR)}
                className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 text-left ${role === UserRole.DOCTOR
                    ? 'border-teal-500 bg-teal-50/50 shadow-md shadow-teal-100'
                    : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50 bg-white'
                    }`}
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${role === UserRole.DOCTOR ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-600 group-hover:bg-teal-200'
                    }`}>
                    <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Doctor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Provide online consultations and manage patient care.</p>

                {role === UserRole.DOCTOR && (
                    <div className="absolute top-4 right-4">
                        <CheckCircle className="h-5 w-5 text-teal-500" />
                    </div>
                )}
            </button>
        </div>
    </div>
    );
}


export default RoleSelectionStep