import { motion } from "framer-motion"

export default function BarsLoaderMini({ classes }) {
  const bars = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div
      className={
        "flex items-end justify-center gap-2 w-full " + classes
      }
    >
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-2 bg-white rounded-sm"
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
