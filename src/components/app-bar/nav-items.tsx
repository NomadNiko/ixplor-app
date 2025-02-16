import { RoleEnum } from "@/services/api/types/role";
import { User } from "@/services/api/types/user";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";

interface NavItemProps {
  user: User | null;
  onClose: () => void;
}

export const getNavItems = (user: User | null) => {
  const items = [
    { key: "home", path: "/", roles: [] },
    { key: "dashboard", path: "/dashboard", roles: [RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "vendor-status", path: "/vendor-status", roles: [RoleEnum.PREVENDOR] },
    { key: "vendor-account", path: "/vendor-account", roles: [RoleEnum.VENDOR] },
    { key: "addProduct", path: "/templates", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "products", path: "/product-items", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "inventory", path: "/inventory", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "service-desk", path: "/service-desk", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR, RoleEnum.ADMIN] },
    { key: "service-admin", path: "/service-admin", roles: [RoleEnum.ADMIN] },
    { key: "vendor-admin", path: "/vendor-admin", roles: [RoleEnum.ADMIN] },
    { key: "users", path: "/admin-panel/users", roles: [RoleEnum.ADMIN] },
    { key: "approvals", path: "/approvals", roles: [RoleEnum.ADMIN] },
  ];

  return items.filter(item => {
    if (item.roles.length === 0) return true;
    return user?.role && item.roles.includes(Number(user.role.id));
  });
};

export const NavItems: React.FC<NavItemProps> = ({ user, onClose }) => {
  const { t } = useTranslation("common");
  const navItems = getNavItems(user);

  return (
    <>
      {navItems.map((item) => (
        <Button
          key={item.key}
          onClick={onClose}
          sx={{ my: 2, color: "white", display: "block" }}
          component={Link}
          href={item.path}
        >
          {t(`common:navigation.${item.key}`)}
        </Button>
      ))}
    </>
  );
};
