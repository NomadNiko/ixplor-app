import { useState } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ChevronUp, ChevronDown } from "lucide-react";
import { format } from 'date-fns';
import { ProductItem } from '@/app/[language]/types/product-item';

type Order = 'asc' | 'desc';
type ColumnId = keyof Pick<ProductItem, 'templateName' | 'productDate' | 'startTime' | 'quantityAvailable'>;

interface BaseColumnType {
  id: ColumnId;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

interface StringColumnType extends BaseColumnType {
  type: 'string';
  format: (value: string) => string;
}

interface NumberColumnType extends BaseColumnType {
  type: 'number';
  format: (value: number) => string;
}

type ColumnType = StringColumnType | NumberColumnType;

interface EnhancedTableProps {
  items: ProductItem[];
  onQuantityChange: (item: ProductItem, change: number) => Promise<void>;
  isUpdating: boolean;
  t: (key: string) => string;
}

export default function EnhancedInventoryTable({ 
  items: initialItems, 
  onQuantityChange, 
  isUpdating,
  t 
}: EnhancedTableProps) {
  // Remove the local items state since we'll use the parent's state
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<ColumnId>('productDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns: ColumnType[] = [
    { 
      id: 'templateName', 
      type: 'string',
      label: t('productName'), 
      align: 'left',
      format: (value: string) => value,
      sortable: true 
    },
    { 
      id: 'productDate', 
      type: 'string',
      label: t('date'), 
      align: 'left',
      format: (value: string) => format(new Date(value), 'PP'),
      sortable: true
    },
    { 
      id: 'startTime', 
      type: 'string',
      label: t('startTime'), 
      align: 'left',
      format: (value: string) => format(new Date(`2000-01-01T${value}`), 'p'),
      sortable: true
    },
    { 
      id: 'quantityAvailable', 
      type: 'number',
      label: t('quantity'), 
      align: 'center',
      format: (value: number) => value.toString(),
      sortable: true
    },
  ];

  const handleRequestSort = (property: ColumnId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const getComparatorValue = (item: ProductItem, property: ColumnId): number | string => {
    if (property === 'productDate') {
      // Convert date and time to a comparable timestamp
      const [hours, minutes] = item.startTime.split(':').map(Number);
      const date = new Date(item.productDate);
      date.setHours(hours, minutes, 0, 0);
      return date.getTime();
    }
    
    if (property === 'startTime') {
      const [hours, minutes] = item.startTime.split(':').map(Number);
      return hours * 60 + minutes;
    }
    
    if (property === 'quantityAvailable') {
      return item.quantityAvailable;
    }
    
    return item[property] as string;
  };

  const sortData = (data: ProductItem[]): ProductItem[] => {
    return [...data].sort((a, b) => {
      const aValue = getComparatorValue(a, orderBy);
      const bValue = getComparatorValue(b, orderBy);
      
      let comparison = 0;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  };

  const sortedAndPaginatedData = sortData(initialItems)
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell align="center">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    {t('noItems')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedAndPaginatedData.map((item) => (
                <TableRow key={item._id}>
                  {columns.map(column => {
                    const value = item[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.type === 'string' 
                          ? column.format(value as string)
                          : column.type === 'number'
                          ? column.format(value as number)
                          : value}
                      </TableCell>
                    );
                  })}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton 
          onClick={() => onQuantityChange(item, 1)}
          size="small"
          disabled={isUpdating}
        >
          <ChevronUp size={20} />
        </IconButton>
        <IconButton 
          onClick={() => onQuantityChange(item, -1)}
          size="small"
          disabled={isUpdating || item.quantityAvailable <= 0}
        >
          <ChevronDown size={20} />
        </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={initialItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}