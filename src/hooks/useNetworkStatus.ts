import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/** Simple connectivity flag for offline banners/retry gating; not a full network manager. */
export function useNetworkStatus(): { isConnected: boolean } {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected));
    });
  }, []);

  return { isConnected };
}
