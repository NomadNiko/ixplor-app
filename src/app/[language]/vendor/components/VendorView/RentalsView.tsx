import { useState } from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Package,
  Calendar,
  Settings,
  Edit,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { RentalProduct, Size } from "@/types/vendor-types";
import { StatCard } from "./styled/vendor-view-styled";
import { CalendarSection } from "../VendorEditView/CalendarSection";

interface RentalsViewProps {
  rentals: RentalProduct[];
  onEditClick: () => void;
}

export default function RentalsView({
  rentals,
  onEditClick,
}: RentalsViewProps) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedProduct, setSelectedProduct] = useState<RentalProduct | null>(
    null
  );

  const totalAvailable = rentals.reduce(
    (acc, rental) => acc + rental.availableUnits,
    0
  );
  const totalBooked = rentals.reduce(
    (acc, rental) => acc + rental.bookedUnits,
    0
  );
  const totalDueToday = rentals.reduce((acc, rental) => acc + rental.dueIn, 0);
  const totalDueOut = rentals.reduce((acc, rental) => acc + rental.dueOut, 0);

  const lowStockItems = rentals.filter(
    (rental) => rental.availableUnits < rental.totalUnits * 0.2
  );

  const handleCloseEditModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid size={{ xs: 12 }} container spacing={2}>
          <Grid size={{ xs: 3 }}>
            <StatCard>
              <CardContent>
                <Typography variant="h4">{totalAvailable}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Available Items
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <StatCard>
              <CardContent>
                <Typography variant="h4">{totalBooked}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently Rented
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <StatCard>
              <CardContent>
                <Typography variant="h4">{totalDueToday}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Due Today
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <StatCard>
              <CardContent>
                <Typography variant="h4">{totalDueOut}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pickups Today
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)}>
              <Tab
                icon={<Package className="w-4 h-4" />}
                label="Inventory"
                value="inventory"
              />
              <Tab
                icon={<Calendar className="w-4 h-4" />}
                label="Calendar"
                value="calendar"
              />
              <Tab
                icon={<Settings className="w-4 h-4" />}
                label="Maintenance"
                value="maintenance"
              />
            </Tabs>
          </Box>

          {/* Alerts Section */}
          {lowStockItems.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" color="error" gutterBottom>
                Low Stock Alerts
              </Typography>
              <Grid container spacing={2}>
                {lowStockItems.map((item) => (
                  <Grid size={{ xs: 12, md: 4 }} key={item.id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AlertTriangle color="red" size={20} />
                          <Typography variant="body1">
                            {item.name} - Only {item.availableUnits} units
                            available
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Inventory Tab Content */}
          {activeTab === "inventory" && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Inventory Items</Typography>
                <Button
                  startIcon={<Plus size={20} />}
                  variant="contained"
                  onClick={() => onEditClick()} // Add this prop to trigger edit navigation
                >
                  Add New Item
                </Button>
              </Box>

              <Grid container spacing={2}>
                {rentals.map((rental) => (
                  <Grid size={{ xs: 12, md: 6 }} key={rental.id}>
                    <Card>
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Typography variant="h6">{rental.name}</Typography>
                          <IconButton
                            onClick={() => setSelectedProduct(rental)}
                          >
                            <Edit size={20} />
                          </IconButton>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {rental.category}
                        </Typography>

                        <Box display="flex" gap={1} mb={2}>
                          <Chip
                            label={`${rental.availableUnits} Available`}
                            color={
                              rental.availableUnits < rental.totalUnits * 0.2
                                ? "error"
                                : "success"
                            }
                            size="small"
                          />
                          <Chip
                            label={`${rental.bookedUnits} Rented`}
                            color="primary"
                            size="small"
                          />
                        </Box>

                        <Typography variant="subtitle2" gutterBottom>
                          Available Sizes:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {rental.sizes.map((size: Size) => (
                            <Chip
                              key={size.id}
                              label={`${size.label} (${size.available}/${size.total})`}
                              size="small"
                              color={size.available === 0 ? "error" : "default"}
                            />
                          ))}
                        </Box>

                        <Box mt={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Maintenance Status:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last serviced: {rental.lastServiced}
                          </Typography>
                          {rental.maintenanceSchedule?.[0] && (
                            <Typography variant="body2" color="warning.main">
                              Next maintenance:{" "}
                              {rental.maintenanceSchedule[0].startDate}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* Calendar Tab Content */}
          {activeTab === "calendar" && (
            <CalendarSection
              vendor={{
                id: "vendor-id",
                name: "Vendor Name",
                type: "rentals",
                description: "",
                status: "published",
                lastUpdated: new Date().toISOString(),
                rentals: rentals,
              }}
            />
          )}

          {/* Maintenance Tab Content */}
          {activeTab === "maintenance" && (
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6">Maintenance Schedule</Typography>
                  <Button
                    startIcon={<Plus size={20} />}
                    variant="contained"
                    onClick={() => {
                      /* Add maintenance modal */
                    }}
                  >
                    Schedule Maintenance
                  </Button>
                </Box>

                {rentals.map(
                  (rental) =>
                    rental.maintenanceSchedule &&
                    rental.maintenanceSchedule.length > 0 && (
                      <Box key={rental.id} mb={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          {rental.name}
                        </Typography>
                        <Grid container spacing={2}>
                          {rental.maintenanceSchedule.map((schedule) => (
                            <Grid size={{ xs: 12, md: 4 }} key={schedule.id}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {schedule.startDate} - {schedule.endDate}
                                  </Typography>
                                  <Typography variant="body1">
                                    {schedule.reason}
                                  </Typography>
                                  <Typography variant="body2" color="primary">
                                    {schedule.itemCount} items affected
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Edit Product Modal */}
      <Dialog
        open={!!selectedProduct}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit {selectedProduct?.name}</DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Typography variant="subtitle1" gutterBottom>
              Category: {selectedProduct?.category}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Units: {selectedProduct?.totalUnits}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Available Units: {selectedProduct?.availableUnits}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Sizes Available:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedProduct?.sizes.map((size) => (
                <Chip
                  key={size.id}
                  label={`${size.label} (${size.available}/${size.total})`}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseEditModal}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
