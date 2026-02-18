import { Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DesignSystemFabProps {
  className?: string;
}

/**
 * Floating action button that links to the Design System page.
 * Renders as a small icon in the bottom-right corner of the screen.
 */
const DesignSystemFab = ({ className }: DesignSystemFabProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/design-system")}
      title="Design System"
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md",
        className
      )}
    >
      <Palette className="h-5 w-5" />
    </button>
  );
};

export default DesignSystemFab;
