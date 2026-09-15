import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/_core/hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AutoSwap from "./pages/AutoSwap";
import Login from "./pages/Login";

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-mark">⚡</div>
        <div className="auth-loading-wordmark">volt<span>path</span></div>
        <div className="auth-loading-line"><i /></div>
        <span>SECURELY CONNECTING YOUR WORKSPACE</span>
      </div>
    );
  }

  return user ? <AutoSwap /> : <Login />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <AuthGate />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
