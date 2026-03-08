"use client";

import { useState } from "react";

import type { ApiErrorShape } from "@/services/http/types";

interface SubmitState {
  isSubmitting: boolean;
  error: ApiErrorShape | null;
  successMessage: string | null;
}

export function useStandardFormSubmit() {
  const [state, setState] = useState<SubmitState>({
    isSubmitting: false,
    error: null,
    successMessage: null,
  });

  async function run<TData>(
    executor: () => Promise<{ data: TData | null; error: ApiErrorShape | null }>,
    getSuccessMessage: (data: TData) => string,
  ) {
    setState({
      isSubmitting: true,
      error: null,
      successMessage: null,
    });

    const result = await executor();

    if (result.error) {
      setState({
        isSubmitting: false,
        error: result.error,
        successMessage: null,
      });

      return result;
    }

    setState({
      isSubmitting: false,
      error: null,
      successMessage: result.data ? getSuccessMessage(result.data) : null,
    });

    return result;
  }

  function clearFeedback() {
    setState((current) => ({
      ...current,
      error: null,
      successMessage: null,
    }));
  }

  return {
    ...state,
    run,
    clearFeedback,
  };
}
