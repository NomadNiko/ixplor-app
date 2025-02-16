import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ anchorEl, onClose, onLogout }) => {
  const { t } = useTranslation("common");

  return (
    <Menu
      sx={{ mt: 5.5 }}
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem
        onClick={onClose}
        component={Link}
        href="/dashboard"
        data-testid="user-profile"
      >
        <Typography textAlign="center">
          {t("common:navigation.dashboard")}
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onLogout();
          onClose();
        }}
        data-testid="logout-menu-item"
      >
        <Typography textAlign="center">
          {t("common:navigation.logout")}
        </Typography>
      </MenuItem>
    </Menu>
  );
};