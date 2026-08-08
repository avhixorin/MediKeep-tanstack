import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const ProfileStep = () => {
    return (
        <div className="text-center space-y-6 py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
                <CheckCircle className="h-12 w-12 text-green-500" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">You're All Set!</h2>
            <p className="text-slate-500">Your Medikeep account has been created successfully.</p>
        </div>
    )
}

export default ProfileStep