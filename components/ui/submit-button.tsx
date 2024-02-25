"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

type SubmitButtonProps = {
  children: React.ReactNode;
};

export default function SubmitButton({ children }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {children}
    </Button>
  );
}
