/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  InvalidateQueryFilters,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { AcmeTodoApiCore } from "../core.js";
import { getTodos } from "../funcs/getTodos.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useAcmeTodoApiContext } from "./_context.js";
import { QueryHookOptions, SuspenseQueryHookOptions } from "./_types.js";

export type GetTodosQueryData = Array<components.Todo>;

/**
 * Get all todo items
 */
export function useGetTodos(
  options?: QueryHookOptions<GetTodosQueryData>,
): UseQueryResult<GetTodosQueryData, Error> {
  const client = useAcmeTodoApiContext();
  return useQuery({
    ...buildGetTodosQuery(
      client,
      options,
    ),
    ...options,
  });
}

/**
 * Get all todo items
 */
export function useGetTodosSuspense(
  options?: SuspenseQueryHookOptions<GetTodosQueryData>,
): UseSuspenseQueryResult<GetTodosQueryData, Error> {
  const client = useAcmeTodoApiContext();
  return useSuspenseQuery({
    ...buildGetTodosQuery(
      client,
      options,
    ),
    ...options,
  });
}

export function prefetchGetTodos(
  queryClient: QueryClient,
  client$: AcmeTodoApiCore,
): Promise<void> {
  return queryClient.prefetchQuery({
    ...buildGetTodosQuery(
      client$,
    ),
  });
}

export function setGetTodosData(
  client: QueryClient,
  data: GetTodosQueryData,
): GetTodosQueryData | undefined {
  const key = queryKeyGetTodos();

  return client.setQueryData<GetTodosQueryData>(key, data);
}

export function invalidateAllGetTodos(
  client: QueryClient,
  filters?: Omit<InvalidateQueryFilters, "queryKey" | "predicate" | "exact">,
): Promise<void> {
  return client.invalidateQueries({
    ...filters,
    queryKey: ["@acme/todo-sdk", "getTodos"],
  });
}

export function buildGetTodosQuery(
  client$: AcmeTodoApiCore,
  options?: RequestOptions,
): {
  queryKey: QueryKey;
  queryFn: (context: QueryFunctionContext) => Promise<GetTodosQueryData>;
} {
  return {
    queryKey: queryKeyGetTodos(),
    queryFn: async function getTodosQueryFn(ctx): Promise<GetTodosQueryData> {
      const sig = combineSignals(ctx.signal, options?.fetchOptions?.signal);
      const mergedOptions = {
        ...options,
        fetchOptions: { ...options?.fetchOptions, signal: sig },
      };

      return unwrapAsync(getTodos(
        client$,
        mergedOptions,
      ));
    },
  };
}

export function queryKeyGetTodos(): QueryKey {
  return ["@acme/todo-sdk", "getTodos"];
}
