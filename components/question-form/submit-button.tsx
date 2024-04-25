import { CornerDownLeft, Loader2 } from "lucide-react";
import React from "react";
import { Button, ButtonProps } from "../ui/button";

export interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(({ isLoading = false }, ref) => {
  return (
    <Button size="icon" ref={ref} type="submit" disabled={isLoading} aria-disabled={isLoading} className="h-full">
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CornerDownLeft size={16} className="-ml-px" />}
    </Button>
  );
});
SubmitButton.displayName = "SubmitButton";
