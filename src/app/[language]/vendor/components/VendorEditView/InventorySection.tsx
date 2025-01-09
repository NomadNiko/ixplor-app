// src/app/[language]/vendor/components/VendorEditView/InventorySection.tsx

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { Plus, Edit2, AlertTriangle } from 'lucide-react';
import { VendorProfileDetails } from '@/types/vendor-types';

interface InventorySectionProps {
  vendor: VendorProfileDetails;
}

export function InventorySection({ vendor }: InventorySectionProps) {
  const getInventoryItems = () => {
    if (vendor.rentals) {
      return vendor.rentals;
    }
    return [];
  };

  const items = getInventoryItems();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6">Inventory Management</Typography>
            <Button startIcon={<Plus />} variant="contained">
              Add New Item
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Total Units</TableCell>
                    <TableCell align="center">Available</TableCell>
                    <TableCell align="center">In Use</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="center">{item.totalUnits}</TableCell>
                      <TableCell align="center">{item.availableUnits}</TableCell>
                      <TableCell align="center">{item.bookedUnits}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.availableUnits < item.totalUnits * 0.2 ? 'Low Stock' : 'In Stock'}
                          color={item.availableUnits < item.totalUnits * 0.2 ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <Edit2 size={16} />
                        </IconButton>
                        {item.availableUnits < item.totalUnits * 0.2 && (
                          <IconButton size="small" color="warning">
                            <AlertTriangle size={16} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}