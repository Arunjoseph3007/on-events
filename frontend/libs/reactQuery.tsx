import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  type UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import axios from "./axios";
import { AxiosError } from "axios";

export const queryClient = new QueryClient();

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function useFetch<TData = any>(
  url: string,
  props: Omit<
    UndefinedInitialDataOptions<TData, AxiosError, TData, any>,
    "queryFn"
  >
) {
  const query = useQuery<TData, AxiosError, TData, string[]>({
    ...props,
    queryFn: async () => {
      const res = await axios.get<TData>(url);
      return res.data;
    },
  });

  return query;
}
