import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BACK_BUTTON_ROUTES = ["/module/", "/takeaways", "/playground"];

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const shouldShow = BACK_BUTTON_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  if (!shouldShow) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-20 left-6 z-40 p-2 rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
