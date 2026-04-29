import { motion, AnimatePresence } from "framer-motion";
import { Delete, Check } from "lucide-react";

interface NumericKeypadProps {
  open: boolean;
  onKey: (key: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const NumericKeypad = ({
  open,
  onKey,
  onBackspace,
  onConfirm,
}: NumericKeypadProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="absolute bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-3 bg-bg-elevated/95 backdrop-blur-xl border-t border-glass-border rounded-t-xl"
        >
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <KeypadKey key={k} onClick={() => onKey(k)}>
                {k}
              </KeypadKey>
            ))}
            <KeypadKey onClick={onBackspace} aria-label="Apagar">
              <Delete size={20} />
            </KeypadKey>
            <KeypadKey onClick={() => onKey("0")}>0</KeypadKey>
            <KeypadKey onClick={onConfirm} variant="confirm" aria-label="Confirmar">
              <Check size={20} />
            </KeypadKey>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const KeypadKey = ({
  children,
  onClick,
  variant,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "confirm";
  "aria-label"?: string;
}) => {
  const base =
    "h-14 rounded-md flex items-center justify-center text-title transition-colors";
  const styles =
    variant === "confirm"
      ? "bg-brand-gradient text-white"
      : "bg-glass-bg border border-glass-border text-text-primary hover:bg-white/10";
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${base} ${styles}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
