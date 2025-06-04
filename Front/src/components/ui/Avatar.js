import { motion } from 'framer-motion';

const Avatar = ({ src, name, size = 'md', className }) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  return (
    <motion.div
      className={`relative rounded-full ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
          {name?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
    </motion.div>
  );
};

export default Avatar;