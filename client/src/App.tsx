import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-right" />
          <Switch>
            <Route path="/login" component={Home} />
            <Route path="/" component={Home} />
            <Route path="/studies/:studyId" component={Home} />
            <Route path="/participants/:participantId/visits/:visitId" component={Home} />
            <Route path="/participants/:participantId" component={Home} />
            <Route path="/:rest*" component={Home} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
