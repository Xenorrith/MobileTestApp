import { useEffect, useState } from "react";

type UseQueryOptions<T> = {
    queryFn: () => Promise<T>;
    enabled?: boolean;
    initialData?: T;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
};

export function useQuery<T>(
    options: UseQueryOptions<T>,
    dependencies: any[] = []
) {
    const {
        queryFn,
        enabled = true,
        initialData,
        onSuccess,
        onError,
    } = options;

    const [data, setData] = useState<T | null>(initialData ?? null);
    const [loading, setLoading] = useState<boolean>(enabled);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await queryFn();
                setData(result);
                onSuccess?.(result);
            } catch (err: any) {
                const errorMessage = err?.message ?? "An error occurred";
                setError(errorMessage);
                onError?.(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [enabled, ...dependencies]);

    return { data, loading, error, refetch: () => { } }; // TODO: Implement refetch if needed
}
