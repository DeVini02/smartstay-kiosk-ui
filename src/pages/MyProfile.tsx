import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Thermometer,
  Bed,
  ShoppingBag,
  Download,
  Trash2,
  History,
  X,
} from "lucide-react";
import { ScreenShell } from "@/components/ScreenShell";
import { GlassCard } from "@/components/GlassCard";
import { GhostButton } from "@/components/GhostButton";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import type { PreferenceCategory } from "@/lib/personalization/types";
import { getConsentHistory } from "@/lib/personalization/consent";
import { cn } from "@/lib/utils";

type EditOpen = null | PreferenceCategory;

const CategoryCard = ({
  category,
  icon,
  title,
  summary,
  active,
  onToggle,
  onEdit,
  ariaLabel,
}: {
  category: PreferenceCategory;
  icon: React.ReactNode;
  title: string;
  summary: string;
  active: boolean;
  onToggle: (v: boolean) => void;
  onEdit: () => void;
  ariaLabel: string;
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg p-4 border backdrop-blur-[10px] transition-colors",
        active
          ? "bg-success/[0.06] border-success/30"
          : "bg-white/[0.03] border-white/10",
      )}
    >
      <button
        onClick={onEdit}
        className="block w-full text-left focus:outline-none"
        aria-label={`${ariaLabel} · editar`}
      >
        <div className="flex items-center gap-3">
          <div className="w-[22px] h-[22px] flex items-center justify-center text-brand-primary">
            {icon}
          </div>
          <span className="flex-1 text-title text-text-primary">{title}</span>
        </div>
        <p className="text-small text-text-secondary mt-2">{summary}</p>
      </button>
      <div className="absolute top-3 right-3">
        <Switch
          checked={active}
          onCheckedChange={onToggle}
          aria-label={ariaLabel}
          className="data-[state=checked]:bg-success"
        />
      </div>
    </div>
  );
};

const MyProfile = () => {
  const navigate = useNavigate();
  const t = useT();
  const {
    profile,
    setConsent,
    updatePreference,
    downloadData,
    deleteAllData,
  } = usePersonalization();

  const [editOpen, setEditOpen] = useState<EditOpen>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deleteText, setDeleteText] = useState("");

  if (!profile) {
    return (
      <ScreenShell>
        <h1 className="text-heading text-text-primary mt-2">{t("p.profile.title")}</h1>
        <p className="text-body text-text-secondary mt-2">
          {t("p.profile.deleted")}
        </p>
        <div className="mt-auto">
          <GhostButton onClick={() => navigate("/")}>
            {t("common.back_home")}
          </GhostButton>
        </div>
      </ScreenShell>
    );
  }

  const c = profile.preferences.comfort;
  const s = profile.preferences.stay;
  const memberYear = profile.memberSince.split("-")[0];
  const history = getConsentHistory(profile.guestId);

  const summaryComfort = c
    ? t("p.profile.summary.comfort", {
        temp: c.temperature,
        tone: t(`p.tone.${c.lightingTone}`),
        brightness: c.lightingBrightness,
      })
    : t("p.profile.summary.empty");
  const summaryStay = s
    ? t("p.profile.summary.stay", {
        floor: t(`p.floor.${s.preferredFloor}`),
        view: s.preferredView,
        bed: t(`p.bed.${s.bedType}`),
      })
    : t("p.profile.summary.empty");

  const confirmDelete = () => {
    if (deleteText.trim().toUpperCase() !== "APAGAR" && deleteText.trim().toUpperCase() !== "DELETE" && deleteText.trim().toUpperCase() !== "BORRAR") return;
    deleteAllData();
    setDeleteStep(0);
    setDeleteText("");
    toast.success(t("p.profile.deleted"));
    navigate("/");
  };

  return (
    <ScreenShell>
      <div className="flex items-center justify-between mt-2">
        <span className="text-label text-brand-primary">{t("p.profile.label")}</span>
        <button
          onClick={() => navigate(-1)}
          aria-label={t("common.close")}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-text-secondary"
        >
          <X size={16} />
        </button>
      </div>
      <h1 className="text-heading text-text-primary mt-2">
        {t("p.profile.title")}
      </h1>
      <p className="text-body text-text-secondary mt-1">
        {t("p.profile.subtitle")}
      </p>

      <div className="flex flex-col gap-3 mt-5">
        <CategoryCard
          category="comfort"
          icon={<Thermometer size={20} />}
          title={t("p.profile.cat.comfort")}
          summary={profile.consents.comfort ? summaryComfort : t("p.profile.summary.empty")}
          active={profile.consents.comfort}
          onToggle={(v) => setConsent("comfort", v, "profile_edit")}
          onEdit={() => setEditOpen("comfort")}
          ariaLabel={t("p.profile.cat.comfort")}
        />
        <CategoryCard
          category="stay"
          icon={<Bed size={20} />}
          title={t("p.profile.cat.stay")}
          summary={profile.consents.stay ? summaryStay : t("p.profile.summary.empty")}
          active={profile.consents.stay}
          onToggle={(v) => setConsent("stay", v, "profile_edit")}
          onEdit={() => setEditOpen("stay")}
          ariaLabel={t("p.profile.cat.stay")}
        />
        <CategoryCard
          category="consumption"
          icon={<ShoppingBag size={20} />}
          title={t("p.profile.cat.consumption")}
          summary={
            profile.consents.consumption
              ? t("p.profile.summary.consumption")
              : t("p.profile.summary.empty")
          }
          active={profile.consents.consumption}
          onToggle={(v) => setConsent("consumption", v, "profile_edit")}
          onEdit={() => setEditOpen("consumption")}
          ariaLabel={t("p.profile.cat.consumption")}
        />
      </div>

      <GlassCard className="mt-4 !py-2.5">
        <div className="text-small text-text-secondary text-center">
          {t("p.profile.stats", {
            stays: profile.totalStays,
            year: memberYear,
            rating: profile.averageRating.toFixed(1),
          })}
        </div>
      </GlassCard>

      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={() => setHistoryOpen(true)}
          className="text-small text-brand-primary self-start flex items-center gap-1.5"
        >
          <History size={12} aria-hidden="true" />
          {t("p.profile.history")}
        </button>
        <GhostButton onClick={downloadData}>
          <span className="inline-flex items-center gap-2 justify-center">
            <Download size={16} aria-hidden="true" />
            {t("p.profile.download")}
          </span>
        </GhostButton>
        <GhostButton
          onClick={() => setDeleteStep(1)}
          className="!border-danger/40 !text-danger"
        >
          <span className="inline-flex items-center gap-2 justify-center">
            <Trash2 size={16} aria-hidden="true" />
            {t("p.profile.delete")}
          </span>
        </GhostButton>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen !== null} onOpenChange={(v) => !v && setEditOpen(null)}>
        <DialogContent className="bg-bg-surface border-white/10 text-text-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {editOpen === "comfort"
                ? t("p.profile.cat.comfort")
                : editOpen === "stay"
                ? t("p.profile.cat.stay")
                : t("p.profile.cat.consumption")}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {t("p.profile.subtitle")}
            </DialogDescription>
          </DialogHeader>
          {editOpen === "comfort" && c && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-small text-text-secondary mb-2">
                  <span>Temperatura</span>
                  <span className="font-mono">{c.temperature}°C</span>
                </div>
                <Slider
                  min={18}
                  max={26}
                  step={1}
                  value={[c.temperature]}
                  onValueChange={(v) =>
                    updatePreference("comfort", { temperature: v[0] })
                  }
                  aria-label="Temperatura"
                />
              </div>
              <div>
                <div className="flex justify-between text-small text-text-secondary mb-2">
                  <span>Brilho da iluminação</span>
                  <span className="font-mono">{c.lightingBrightness}%</span>
                </div>
                <Slider
                  min={10}
                  max={100}
                  step={5}
                  value={[c.lightingBrightness]}
                  onValueChange={(v) =>
                    updatePreference("comfort", { lightingBrightness: v[0] })
                  }
                  aria-label="Brilho"
                />
              </div>
            </div>
          )}
          {editOpen === "stay" && s && (
            <div className="text-body text-text-secondary">
              {summaryStay}
            </div>
          )}
          {editOpen === "consumption" && (
            <div className="text-body text-text-secondary">
              {t("p.profile.summary.consumption")}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="bg-bg-surface border-white/10 text-text-primary">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {t("p.profile.history")}
            </DialogTitle>
          </DialogHeader>
          {history.length === 0 ? (
            <p className="text-body text-text-secondary">
              {t("p.profile.history_empty")}
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="text-small text-text-primary border-b border-white/10 pb-2"
                >
                  <div className="font-mono text-mono-tiny text-text-tertiary">
                    {new Date(h.timestamp).toLocaleString()}
                  </div>
                  {h.category} · {h.consented ? "✓" : "✕"} · {h.source}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={deleteStep > 0}
        onOpenChange={(v) => {
          if (!v) {
            setDeleteStep(0);
            setDeleteText("");
          }
        }}
      >
        <DialogContent className="bg-bg-surface border-danger/40 text-text-primary">
          <DialogHeader>
            <DialogTitle className="text-danger">
              {t("p.profile.delete.title")}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {deleteStep === 1
                ? t("p.profile.delete.step1")
                : t("p.profile.delete.step2")}
            </DialogDescription>
          </DialogHeader>
          {deleteStep === 2 && (
            <Input
              autoFocus
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder={t("p.profile.delete.placeholder")}
              className="bg-white/5 border-white/10 text-text-primary"
            />
          )}
          <DialogFooter>
            <GhostButton
              onClick={() => {
                setDeleteStep(0);
                setDeleteText("");
              }}
            >
              {t("common.cancel")}
            </GhostButton>
            {deleteStep === 1 ? (
              <GhostButton
                onClick={() => setDeleteStep(2)}
                className="!border-danger/40 !text-danger"
              >
                {t("common.continue")}
              </GhostButton>
            ) : (
              <GhostButton
                onClick={confirmDelete}
                className="!border-danger/40 !text-danger"
              >
                {t("p.profile.delete.confirm")}
              </GhostButton>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScreenShell>
  );
};

export default MyProfile;
