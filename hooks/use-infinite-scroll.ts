'use client';

import { useState, useMemo } from 'react';

export function useInfiniteScroll<T>(items: T[], itemsPerPage: number = 10) {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);

  const displayedItems = useMemo(() => {
    return items.slice(0, displayedCount);
  }, [items, displayedCount]);

  const hasMore = displayedCount < items.length;

  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + itemsPerPage, items.length));
  };

  const reset = () => {
    setDisplayedCount(itemsPerPage);
  };

  return {
    items: displayedItems,
    hasMore,
    loadMore,
    reset,
  };
}