import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AnimateIn({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      style={{ width: '100%' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={delay ? {
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: { ...variants.visible.transition, delay },
        },
      } : variants}
    >
      {children}
    </motion.div>
  );
}
