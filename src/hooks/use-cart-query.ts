import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useGetCartService } from '@/services/api/services/cart';
import { cartKeys } from '@/src/services/react-query/keys/cart';
import useAuth from '@/services/auth/use-auth';

export function useCartQuery() {
  const getCart = useGetCartService();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: user ? cartKeys.root().sub.detail(user.id.toString()).key : [],
    queryFn: getCart,
    enabled: !!user,
  });

  const refreshCart = () => {
    if (user) {
      queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user.id.toString()).key,
      });
    }
  };

  return {
    ...query,
    refreshCart,
  };
}