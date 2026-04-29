import { Link } from "react-router-dom";

const ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Idle" },
  { path: "/language-select", label: "Language Select" },
  { path: "/menu", label: "Menu" },
  { path: "/reservation", label: "Reservation Lookup" },
  { path: "/confirm", label: "Confirm Data" },
  { path: "/lgpd", label: "LGPD Consent" },
  { path: "/capture", label: "Face Capture" },
  { path: "/processing", label: "Processing" },
  { path: "/key", label: "Digital Key" },
  { path: "/goodbye", label: "Goodbye" },
  { path: "/checkout/identify", label: "Checkout · Identify" },
  { path: "/checkout/summary", label: "Checkout · Summary" },
  { path: "/checkout/confirm", label: "Checkout · Confirm" },
  { path: "/checkout/rate", label: "Checkout · Rate" },
  { path: "/checkout/goodbye", label: "Checkout · Goodbye" },
  { path: "/test/errors", label: "Error states preview" },
  { path: "/admin", label: "Admin (easter egg)" },
];

const TestAllScreens = () => {
  return (
    <div className="min-h-screen bg-bg-deep p-6">
      <header className="max-w-3xl mx-auto mb-6">
        <h1 className="text-heading text-text-primary">QA · All routes</h1>
        <p className="text-body text-text-secondary mt-1">
          Index das telas. Clique para abrir.
        </p>
      </header>
      <ul className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROUTES.map((r) => (
          <li key={r.path}>
            <Link
              to={r.path}
              className="block glass rounded-lg p-4 hover:border-glass-border-strong transition-colors"
            >
              <p className="text-title text-text-primary">{r.label}</p>
              <p className="text-mono-tiny text-text-tertiary mt-1">
                {r.path}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestAllScreens;
