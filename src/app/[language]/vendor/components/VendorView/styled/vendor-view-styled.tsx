import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: "available" | "booked" | "cancelled" }>(({ theme, status }) => ({
  backgroundColor:
    status === "available"
      ? theme.palette.success.main
      : status === "booked"
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
}));

export const StatCard = styled(Card)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
}));