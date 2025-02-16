import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import Divider from "@mui/material/Divider";
import { User } from "@/services/api/types/user";
import { getNavItems } from "./nav-items";

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  user: User | null;
  isLoaded: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  anchorEl,
  user,
  isLoaded,
  onClose,
}) => {
  const { t } = useTranslation("common");
  const navItems = getNavItems(user);

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(anchorEl)}
      onClose={onClose}
      sx={{
        display: { xs: "block", md: "none" },
      }}
    >
      {navItems.map((item) => (
        <MenuItem key={item.key} onClick={onClose} component={Link} href={item.path}>
          <Typography textAlign="center">
            {t(`common:navigation.${item.key}`)}
          </Typography>
        </MenuItem>
      ))}

      {isLoaded && !user && (
        <>
          <Divider />
          <MenuItem onClick={onClose} component={Link} href="/sign-in">
            <Typography textAlign="center">
              {t("common:navigation.signIn")}
            </Typography>
          </MenuItem>
          {IS_SIGN_UP_ENABLED && (
            <MenuItem onClick={onClose} component={Link} href="/sign-up">
              <Typography textAlign="center">
                {t("common:navigation.signUp")}
              </Typography>
            </MenuItem>
          )}
        </>
      )}
    </Menu>
  );
};
