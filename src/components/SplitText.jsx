import { motion, useReducedMotion } from "framer-motion";

export default function SplitText({
  text,
  className = "",
  as: Tag = "h2",
  delay = 25,
  duration = 0.6,
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion.create(Tag);
  const chars = Array.from(text);

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag className={className} aria-label={text}>
      {chars.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration,
            delay: (index * delay) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
