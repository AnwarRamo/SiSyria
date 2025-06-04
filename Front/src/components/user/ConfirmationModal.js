import { AnimatePresence, motion } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, title, message, confirmText, onConfirm, icon }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="text-center space-y-4">
              <div className="text-blue-500 dark:text-blue-400 mx-auto">
                {icon}
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{message}</p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
function retornaNomeEIdade(nome, idade) {
 return `O meu nome é ${nome} e tenho ${idade} anos.`;
}