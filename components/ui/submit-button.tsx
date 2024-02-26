"use client";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

type SubmitButtonProps = {
  children: React.ReactNode;
};

export default function SubmitButton({ children }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
