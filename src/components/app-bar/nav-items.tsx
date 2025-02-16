import { RoleEnum } from "@/services/api/types/role";
import { User } from "@/services/api/types/user";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import { useState } from "react";
import GroupedNavItems from "./grouped-nav-items";

interface NavItemProps {
  user: User | null;
  onClose: () => void;
}

const ADMIN_GROUP = {
  groupName: 'Admin',
  items: [
    { key: "service-admin", path: "/service-admin" },
    { key: "vendor-admin", path: "/vendor-admin" },
    { key: "users", path: "/admin-panel/users" },
    { key: "approvals", path: "/approvals" }
  ]
};

export const getNavItems = (user: User | null) => {
  const isAdmin = user?.role && Number(user.role.id) === RoleEnum.ADMIN;

  const regularItems = [
    { key: "home", path: "/", roles: [] },
    { key: "dashboard", path: "/dashboard", roles: [RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "vendor-status", path: "/vendor-status", roles: [RoleEnum.PREVENDOR] },
    { key: "vendor-account", path: "/vendor-account", roles: [RoleEnum.VENDOR] },
    { key: "addProduct", path: "/templates", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "products", path: "/product-items", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "inventory", path: "/inventory", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR] },
    { key: "service-desk", path: "/service-desk", roles: [RoleEnum.VENDOR, RoleEnum.PREVENDOR, RoleEnum.ADMIN] }
  ];

  const filteredItems = regularItems.filter(item => {
    if (item.roles.length === 0) return true;
    return user?.role && item.roles.includes(Number(user.role.id));
  });

  return {
    regularItems: filteredItems,
    adminGroup: isAdmin ? ADMIN_GROUP : null
  };
};

export const NavItems: React.FC<NavItemProps> = ({ user, onClose }) => {
  const { t } = useTranslation("common");
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { regularItems, adminGroup } = getNavItems(user);

  const handleGroupOpen = (groupName: string) => {
    setOpenGroup(groupName);
  };

  const handleGroupClose = () => {
    setOpenGroup(null);
  };

  return (
    <>
      {regularItems.map((item) => (
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
      {adminGroup && (
        <GroupedNavItems
          group={adminGroup}
          t={t}
          onClose={handleGroupClose}
          onGroupOpen={handleGroupOpen}
          isOpen={openGroup === adminGroup.groupName}
        />
      )}
    </>
  );
};