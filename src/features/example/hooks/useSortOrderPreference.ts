import { useCallback, useEffect, useState } from 'react';

import { preferences, type SortOrder } from '@/storage/preferences';

/** Demonstrates one locally persisted preference, scoped to this feature. */
export function useSortOrderPreference() {
  const [sortOrder, setSortOrderState] = useState<SortOrder>('newest');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    preferences.getExampleSortOrder().then((value) => {
      setSortOrderState(value);
      setLoaded(true);
    });
  }, []);

  const setSortOrder = useCallback(async (value: SortOrder) => {
    setSortOrderState(value);
    await preferences.setExampleSortOrder(value);
  }, []);

  return { sortOrder, setSortOrder, loaded };
}
