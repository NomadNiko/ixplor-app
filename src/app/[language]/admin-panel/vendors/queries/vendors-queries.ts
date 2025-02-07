import { useNewGetVendorsService } from "@/services/api/services/vendors";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VendorFilterType, VendorSortType } from "@/app/[language]/types/vendor";
import { Vendor } from "@/app/[language]/types/vendor";

export const vendorsQueryKeys = createQueryKeys(["vendors"], {
  list: () => ({
    key: [],
    sub: {
      by: (params: {
        filter: VendorFilterType | undefined;
        sort?: VendorSortType | undefined;
      }) => ({
        key: [params],
      }),
    },
  }),
});

interface VendorPageData {
  data: Vendor[];
  nextPage?: number;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useVendorListQuery = ({
  sort,
  filter,
}: {
  filter?: VendorFilterType;
  sort?: VendorSortType;
} = {}) => {
  const fetch = useNewGetVendorsService();

  return useInfiniteQuery<VendorPageData, Error>({
    queryKey: vendorsQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const { status, data } = await fetch({
        page: pageParam as number,
        limit: 10,
        filters: filter,
        sort: sort ? [sort] : undefined,
      });

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? (pageParam as number) + 1 : undefined,
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage
        };
      }
      throw new Error("Failed to fetch vendors");
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
