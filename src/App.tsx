import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CheckInProvider } from "@/context/CheckInContext";
import { PersonalizationProvider } from "@/contexts/PersonalizationContext";
import WelcomeBack from "./pages/WelcomeBack";
import RoomPreparing from "./pages/RoomPreparing";
import MyProfile from "./pages/MyProfile";
import FirstStayOnboarding from "./pages/FirstStayOnboarding";
import Idle from "./pages/Idle";
import LanguageSelect from "./pages/LanguageSelect";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Confirm from "./pages/Confirm";
import LGPD from "./pages/LGPD";
import Capture from "./pages/Capture";
import Processing from "./pages/Processing";
import Key from "./pages/Key";
import Goodbye from "./pages/Goodbye";
import CheckoutIdentify from "./pages/CheckoutIdentify";
import CheckoutSummary from "./pages/CheckoutSummary";
import CheckoutConfirm from "./pages/CheckoutConfirm";
import CheckoutRate from "./pages/CheckoutRate";
import CheckoutGoodbye from "./pages/CheckoutGoodbye";
import TestErrors from "./pages/TestErrors";
import TestAllScreens from "./pages/TestAllScreens";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { areDebugRoutesEnabled } from "@/lib/api/config";

const queryClient = new QueryClient();

const EscToHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const debugRoutes = areDebugRoutesEnabled();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Idle />} />
        <Route path="/language-select" element={<LanguageSelect />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/lgpd" element={<LGPD />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/key" element={<Key />} />
        <Route path="/goodbye" element={<Goodbye />} />
        <Route path="/checkout/identify" element={<CheckoutIdentify />} />
        <Route path="/checkout/summary" element={<CheckoutSummary />} />
        <Route path="/checkout/confirm" element={<CheckoutConfirm />} />
        <Route path="/checkout/rate" element={<CheckoutRate />} />
        <Route path="/checkout/goodbye" element={<CheckoutGoodbye />} />
        <Route path="/welcome-back" element={<WelcomeBack />} />
        <Route path="/room-preparing" element={<RoomPreparing />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/first-stay-onboarding" element={<FirstStayOnboarding />} />
        {debugRoutes && <Route path="/test/errors" element={<TestErrors />} />}
        {debugRoutes && <Route path="/test/all-screens" element={<TestAllScreens />} />}
        {debugRoutes && <Route path="/admin" element={<Admin />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CheckInProvider>
        <PersonalizationProvider>
          <BrowserRouter>
            <EscToHome />
            <AnimatedRoutes />
          </BrowserRouter>
        </PersonalizationProvider>
      </CheckInProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
