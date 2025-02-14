import { useState } from 'react';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

interface UserInfo {
  firstName?: string;
  lastName?: string;
  email: string;
}

type UserCache = {
  [key: string]: UserInfo;
};

export const useUserInfo = () => {
  const [userCache, setUserCache] = useState<UserCache>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const fetchUserInfo = async (userId: string) => {
    if (userCache[userId] || loading[userId]) {
      return userCache[userId];
    }

    try {
      setLoading(prev => ({ ...prev, [userId]: true }));
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_URL}/v1/users/${userId}/name`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      setUserCache(prev => ({
        ...prev,
        [userId]: userData
      }));

      return userData;
    } catch (error) {
      console.error(`Error fetching user info for ${userId}:`, error);
      return null;
    } finally {
      setLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[userId];
        return newLoading;
      });
    }
  };

  const getUserDisplayName = (userId: string): string => {
    const user = userCache[userId];
    if (!user) return 'Unknown User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  return {
    fetchUserInfo,
    getUserDisplayName,
    userCache,
    loading
  };
};