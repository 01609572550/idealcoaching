import { createContext, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(() => ({
    push(message, type = 'info') {
      const id = crypto.randomUUID();
      setToasts(items => [...items, { id, message, type }]);
      setTimeout(() => setToasts(items => items.filter(item => item.id !== id)), 4200);
    }
  }), []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 grid w-[min(380px,calc(100vw-2rem))] gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`rounded-lg border bg-white px-4 py-3 shadow-soft dark:bg-slate-900 ${
                toast.type === 'error' ? 'border-red-200 text-red-700 dark:border-red-900 dark:text-red-300' :
                toast.type === 'success' ? 'border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300' :
                'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
