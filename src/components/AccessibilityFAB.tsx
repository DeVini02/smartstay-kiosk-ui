import { useState } from "react";
import { Accessibility, Type, Contrast, Hand, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export const AccessibilityFAB = () => {
  const [open, setOpen] = useState(false);
  const [fontLevel, setFontLevel] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const { toast } = useToast();

  const notImplemented = () =>
    toast({
      title: "Em desenvolvimento",
      description: "Este recurso estará disponível em breve.",
    });

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        aria-label="Acessibilidade"
        className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full glass flex items-center justify-center text-white/85 hover:text-white"
      >
        <Accessibility size={20} aria-hidden="true" />
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-bg-surface border-glass-border text-text-primary">
          <DialogHeader>
            <DialogTitle className="text-heading text-white">
              Acessibilidade
            </DialogTitle>
            <DialogDescription className="text-text-secondary text-body">
              Ajuste a interface para suas preferências.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <Row icon={<Type size={18} />} label="Tamanho da fonte">
              <div className="flex gap-2">
                {[0, 1, 2].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFontLevel(lvl)}
                    aria-label={`Nível de fonte ${lvl + 1}`}
                    className={`w-10 h-10 rounded-md border transition-colors ${
                      fontLevel === lvl
                        ? "bg-brand-gradient border-transparent text-white"
                        : "bg-glass-bg border-glass-border text-text-secondary"
                    }`}
                  >
                    A
                  </button>
                ))}
              </div>
            </Row>

            <Row icon={<Contrast size={18} />} label="Alto contraste">
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Alto contraste"
              />
            </Row>

            <Row icon={<Hand size={18} />} label="Avatar Libras">
              <button
                onClick={notImplemented}
                className="text-small text-brand-primary"
              >
                Ativar
              </button>
            </Row>

            <Row icon={<Volume2 size={18} />} label="Guia por áudio">
              <button
                onClick={notImplemented}
                className="text-small text-brand-primary"
              >
                Ativar
              </button>
            </Row>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Row = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <span className="text-text-secondary" aria-hidden="true">
        {icon}
      </span>
      <span className="text-title text-text-primary">{label}</span>
    </div>
    {children}
  </div>
);
