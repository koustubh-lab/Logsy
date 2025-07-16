import { motion } from "framer-motion"
import { XCircle } from "lucide-react"

export default function FancyFailureComponent() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* Glowing red pulse ring */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0.2, 0.6],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className="absolute w-28 h-28 rounded-full bg-red-400 blur-2xl opacity-50"
      />

      {/* Outer red shimmer ring */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute w-32 h-32 rounded-full border-t-4 border-red-500 border-dashed"
      />

      {/* Central icon */}
      <motion.div
        initial={{ scale: 0, rotate: 180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 12 }}
        className="z-10 flex items-center justify-center w-24 h-24 rounded-full bg-red-100 shadow-xl"
      >
        <XCircle className="w-12 h-12 text-red-600 drop-shadow-lg" />
      </motion.div>
    </div>
  )
}
