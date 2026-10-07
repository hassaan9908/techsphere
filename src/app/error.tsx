"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  console.error(error);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <AlertTriangle className="mx-auto h-14 w-14 text-destructive" />

        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Something went wrong
        </h1>

        <p className="mt-3 text-muted-foreground">
          We could not complete your request. Please try again.
        </p>

        <Button
          className="mt-8"
          onClick={reset}
        >
          Try Again
        </Button>
      </div>
    </main>
  );
}