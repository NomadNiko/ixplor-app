"use client";
import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo, useRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import TableComponents from "@/components/table/table-components";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useDeleteVendorService } from "@/services/api/services/vendors";
import { 
  Vendor, 
  VendorStatusEnum, 
  VendorSortField, 
  SortOrder, 
  VendorSortType 
} from "@/app/[language]/types/vendor";
import { useVendorListQuery } from "./queries/vendors-queries";
import VendorFilter from "./vendor-filter";
import Chip from "@mui/material/Chip";

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

interface TableSortCellWrapperProps {
  width?: number;
  orderBy: VendorSortField;
  order: SortOrder;
  column: VendorSortField;
  handleRequestSort: (
    event: React.MouseEvent<unknown>,
    property: VendorSortField
  ) => void;
  children: React.ReactNode;
}

function TableSortCellWrapper({
  width,
  orderBy,
  order,
  column,
  handleRequestSort,
  children
}: TableSortCellWrapperProps) {
  return (
    <TableCell
      style={{ width }}
      sortDirection={orderBy === column ? order : false}
    >
      <TableSortLabel
        active={orderBy === column}
        direction={orderBy === column ? order : SortOrder.ASC}
        onClick={(event) => handleRequestSort(event, column)}
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );
}

function Actions({ vendor }: { vendor: Vendor }) {
  const [open, setOpen] = useState(false);
  const { confirmDialog } = useConfirmDialog();
  const fetchVendorDelete = useDeleteVendorService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("admin-panel-vendors");

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: t("confirm.delete.title"),
      message: t("confirm.delete.message"),
    });
    if (isConfirmed) {
      setOpen(false);
      await fetchVendorDelete({
        id: vendor._id,
      });
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });
    }
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        size="small"
      >
        <Button
          size="small"
          variant="contained"
          LinkComponent={Link}
          href={`/admin-panel/vendors/edit/${vendor._id}`}
        >
          {t("actions.edit")}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    sx={{
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "error.light",
                      },
                    }}
                    onClick={handleDelete}
                  >
                    {t("actions.delete")}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

function getStatusChipColor(status: VendorStatusEnum) {
  switch (status) {
    case VendorStatusEnum.APPROVED:
      return "success";
    case VendorStatusEnum.PENDING_APPROVAL:
      return "warning";
    case VendorStatusEnum.ACTION_NEEDED:
      return "error";
    case VendorStatusEnum.REJECTED:
      return "error";
    default:
      return "default";
  }
}

function Vendors() {
  const { t } = useTranslation("admin-panel-vendors");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sort, setSort] = useState<VendorSortType>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { orderBy: VendorSortField.CREATED, order: SortOrder.DESC };
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: VendorSortField
  ) => {
    const isAsc = sort.orderBy === property && sort.order === SortOrder.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newSort = {
      order: isAsc ? SortOrder.DESC : SortOrder.ASC,
      orderBy: property,
    };
    searchParams.set("sort", JSON.stringify(newSort));
    setSort(newSort);
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useVendorListQuery({
    sort,
    filter,
  });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const vendors = useMemo(() => {
    const result = data?.pages.flatMap((page) => page?.data) ?? [];
    return removeDuplicatesFromArrayObjects(result, "_id");
  }, [data]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} pt={3}>
        <Grid container spacing={3} size={{ xs: 12 }}>
          <Grid size="grow">
            <Typography variant="h3">{t("title")}</Typography>
          </Grid>
          <Grid container size="auto" wrap="nowrap" spacing={2}>
            <Grid size="auto">
              <VendorFilter />
            </Grid>
            <Grid size="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/vendors/create"
                color="success"
              >
                {t("actions.create")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} mb={2}>
          <TableVirtuoso
            style={{ height: 500 }}
            data={vendors}
            components={TableComponents}
            endReached={handleScroll}
            overscan={20}
            useWindowScroll
            increaseViewportBy={400}
            fixedHeaderContent={() => (
              <>
                <TableRow>
                  <TableCell style={{ width: 50 }}></TableCell>
                  <TableSortCellWrapper
                    width={100}
                    orderBy={sort.orderBy}
                    order={sort.order}
                    column={VendorSortField.NAME}
                    handleRequestSort={handleRequestSort}
                  >
                    {t("table.column1")}
                  </TableSortCellWrapper>
                  <TableCell style={{ width: 200 }}>
                    {t("table.column2")}
                  </TableCell>
                  <TableSortCellWrapper
                    orderBy={sort.orderBy}
                    order={sort.order}
                    column={VendorSortField.NAME}
                    handleRequestSort={handleRequestSort}
                  >
                    {t("table.column3")}
                  </TableSortCellWrapper>
                  <TableCell style={{ width: 120 }}>
                    {t("table.column4")}
                  </TableCell>
                  <TableCell style={{ width: 130 }}></TableCell>
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCellLoadingContainer colSpan={6}>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </>
            )}
            itemContent={(index, vendor) => (
              <>
                <TableCell style={{ width: 50 }}>
                  <Avatar
                    alt={vendor.businessName}
                    src={vendor.logoUrl}
                  />
                </TableCell>
                <TableCell style={{ width: 100 }}>{vendor._id}</TableCell>
                <TableCell style={{ width: 200 }}>
                  {vendor.businessName}
                </TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell style={{ width: 120 }}>
                  <Chip 
                    label={vendor.vendorStatus}
                    color={getStatusChipColor(vendor.vendorStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ width: 130 }}>
                  <Actions vendor={vendor} />
                </TableCell>
              </>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Vendors, { roles: [RoleEnum.ADMIN] });