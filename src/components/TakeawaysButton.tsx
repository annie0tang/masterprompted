import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TakeawaysButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function TakeawaysButton({ className = "", onClick }: TakeawaysButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/takeaways");
    }
  };

  return (
    <Button 
      variant="outline"
      onClick={handleClick}
      className={`rounded-full px-6 py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors ${className}`}
    >
      Takeaways
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}