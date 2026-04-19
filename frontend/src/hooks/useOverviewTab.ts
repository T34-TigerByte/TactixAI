import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getUserActivitiesRequest } from '../api/admin.api';

export function useOverviewTab() {
  const [cursor, setCursor] = useState<string | undefined>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'activities', cursor],
    queryFn: () => getUserActivitiesRequest(cursor),
  });

  const nextPage = () => {
    if (data?.pagination.has_next && data.pagination.next_cursor) {
      setCursor(data.pagination.next_cursor);
    }
  };

  const prevPage = () => {
    if (data?.pagination.has_prev && data.pagination.prev_cursor) {
      setCursor(data.pagination.prev_cursor);
    }
  };

  return {
    activities: data?.data ?? [],
    pagination: data?.pagination ?? null,
    total: data?.total ?? 0,
    isLoading,
    error: error ? 'Failed fetching user activities. Please try again.' : null,
    nextPage,
    prevPage,
  };
}
