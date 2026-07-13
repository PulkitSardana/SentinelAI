"use client"

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useDashboardMetrics() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/metrics/dashboard`,
    fetcher,
    { refreshInterval: 3000 } // Poll every 3 seconds for near real-time updates
  );

  return {
    metrics: data?.data,
    isLoading,
    isError: error
  };
}
