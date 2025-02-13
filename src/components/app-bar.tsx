"use client";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import Link from "@/components/link";
import { RoleEnum } from "@/services/api/types/role";
import Divider from "@mui/material/Divider";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import { styled } from "@mui/material/styles";
import { ShoppingCart } from "lucide-react";
import { useCartQuery } from "@/hooks/use-cart-query";
import Badge from "@mui/material/Badge";


// Define the props type for the LogoTypography component
type LogoTypographyProps = TypographyProps<"a", { component: "a" }>;

// Create the styled LogoTypography component
const LogoTypography = styled(Typography)<LogoTypographyProps>(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: "none",
  fontWeight: 700,
  fontFamily: "Iceland, serif",
  fontSize: "1.5rem",
  //letterSpacing: '.3rem',
  color: "inherit",
  textDecoration: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

function ResponsiveAppBar() {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const { data: cartData, isLoading: isCartLoading } = useCartQuery();

  const [anchorElementNav, setAnchorElementNav] = useState<null | HTMLElement>(
    null
  );
  const [anchorElementUser, setAnchorElementUser] =
    useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElementNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElementUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LogoTypography variant="h6" noWrap component="a" href="/">
            {t("common:app-name")}
          </LogoTypography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElementNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElementNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/">
                <Typography textAlign="center">
                  {t("common:navigation.home")}
                </Typography>
              </MenuItem>
              
              {!!user?.role &&
                [RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="tickets"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/tickets"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.tickets")}
                    </Typography>
                  </MenuItem>,
                ]}
                
              {!!user?.role &&
                [RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="receipts"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/receipts"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.receipts")}
                    </Typography>
                  </MenuItem>,
                ]}
                
                
              {!!user?.role &&
                [RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="service-desk"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/service-desk"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.service-desk")}
                    </Typography>
                  </MenuItem>,
                ]}
                
              {!!user?.role &&
                [RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="vendor-status"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/vendor-status"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.vendor-status")}
                    </Typography>
                  </MenuItem>,
                ]}

              {!!user?.role &&
                [RoleEnum.VENDOR].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="vendor-account"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/vendor-account"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.vendor-account")}
                    </Typography>
                  </MenuItem>,
                ]}

              {!!user?.role &&
                [RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(
                  Number(user?.role?.id)
                ) && [
                  <MenuItem
                    key="addProduct"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/templates"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.addProduct")}
                    </Typography>
                  </MenuItem>,
                ]}
                
              {!!user?.role &&
                [RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="products"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/product-items"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.products")}
                    </Typography>
                  </MenuItem>,
                ]}

              {!!user?.role &&
                [RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="inventory"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/inventory"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.inventory")}
                    </Typography>
                  </MenuItem>,
                ]}

              {!!user?.role &&
                [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="service-admin"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/service-admin"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.service-admin")}
                    </Typography>
                  </MenuItem>,
                ]}

              {!!user?.role &&
                [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="vendor-admin"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/vendor-admin"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.vendor-admin")}
                    </Typography>
                  </MenuItem>,
                ]}

              {!!user?.role &&
                [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="users"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/admin-panel/users"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.users")}
                    </Typography>
                  </MenuItem>,
                ]}
              {!!user?.role &&
                [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && [
                  <MenuItem
                    key="approvals"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/approvals"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.approvals")}
                    </Typography>
                  </MenuItem>,
                ]}
              {isLoaded &&
                !user && [
                  <Divider key="divider" />,
                  <MenuItem
                    key="sign-in"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href="/sign-in"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.signIn")}
                    </Typography>
                  </MenuItem>,
                  IS_SIGN_UP_ENABLED ? (
                    <MenuItem
                      key="sign-up"
                      onClick={handleCloseNavMenu}
                      component={Link}
                      href="/sign-up"
                    >
                      <Typography textAlign="center">
                        {t("common:navigation.signUp")}
                      </Typography>
                    </MenuItem>
                  ) : null,
                ]}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontSize: "1.5rem",
              fontFamily: "Iceland, serif",
              fontWeight: 700,
              //letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {t("common:app-name")}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
              component={Link}
              href="/"
            >
              {t("common:navigation.home")}
            </Button>
            
            {!!user?.role &&
              [RoleEnum.USER,RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/tickets"
                  >
                    {t("common:navigation.tickets")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.USER,RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/receipts"
                  >
                    {t("common:navigation.receipts")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.USER,RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/service-desk"
                  >
                    {t("common:navigation.service-desk")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/vendor-status"
                  >
                    {t("common:navigation.vendor-status")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.VENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/vendor-account"
                  >
                    {t("common:navigation.vendor-account")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/templates"
                  >
                    {t("common:navigation.addProduct")}
                  </Button>
                </>
              )}
              
            {!!user?.role &&
              [RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/product-items"
                  >
                    {t("common:navigation.products")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/inventory"
                  >
                    {t("common:navigation.inventory")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/service-admin"
                  >
                    {t("common:navigation.service-admin")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/vendor-admin"
                  >
                    {t("common:navigation.vendor-admin")}
                  </Button>
                </>
              )}

            {!!user?.role &&
              [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/admin-panel/users"
                  >
                    {t("common:navigation.users")}
                  </Button>
                </>
              )}
            {!!user?.role &&
              [RoleEnum.ADMIN].includes(Number(user?.role?.id)) && (
                <>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    href="/approvals"
                  >
                    {t("common:navigation.approvals")}
                  </Button>
                </>
              )}
          </Box>

          <Box
            sx={{
              display: "flex",
              mr: 1,
            }}
          ></Box>
          {(user) && (
             <Box sx={{ mr: 2 }}>
             <Tooltip title={t("common:navigation.cart")}>
               {isCartLoading ? (
                 <CircularProgress size={40} color="inherit" />
               ) : (
                 <IconButton
                   component={Link}
                   href="/cart"
                   sx={{ p: 0 }}
                   data-testid="cart-button"
                 >
                   <Badge
                     badgeContent={cartData?.items?.length || 0}
                     color="primary"
                     sx={{
                       "& .MuiBadge-badge": {
                         right: -3,
                         top: 3,
                       },
                     }}
                   >
                     <ShoppingCart size={40} />
                   </Badge>
                 </IconButton>
               )}
             </Tooltip>
           </Box>
          )}
          {!isLoaded ? (
            <CircularProgress color="inherit" />
          ) : user ? (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Profile menu">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                    data-testid="profile-menu-item"
                  >
                    <Avatar
                      alt={user?.firstName + " " + user?.lastName}
                      src={user.photo?.path}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: 5.5 }}
                  id="menu-appbar"
                  anchorEl={anchorElementUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElementUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    href="/profile"
                    data-testid="user-profile"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.profile")}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logOut();
                      handleCloseUserMenu();
                    }}
                    data-testid="logout-menu-item"
                  >
                    <Typography textAlign="center">
                      {t("common:navigation.logout")}
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
                component={Link}
                href="/sign-in"
              >
                {t("common:navigation.signIn")}
              </Button>
              {IS_SIGN_UP_ENABLED && (
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                  component={Link}
                  href="/sign-up"
                >
                  {t("common:navigation.signUp")}
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
