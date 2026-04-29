import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CheckInProvider } from "@/context/CheckInContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
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
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </CheckInProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
