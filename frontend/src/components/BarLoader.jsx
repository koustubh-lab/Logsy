import { motion } from "framer-motion"

export default function BarsLoader() {
  const bars = [0, 1, 2, 3, 4]
  console.log('bar loader mounted');

  return (
    <div className="flex items-end justify-center gap-1 h-10 py-10 w-full">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-2 bg-black rounded-sm"
          style={{ height: "100%" }}
          animate={{
            scaleY: [0.4, 1, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}
