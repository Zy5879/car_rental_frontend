import { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconCalendarStats,
  IconUser,
  IconLogout,
  IconSwitchHorizontal,
  IconCar,
  IconInvoice,
} from "@tabler/icons-react";
import classes from "./AdminNavbar.module.css";
import { useEmployeeStore } from "../../../store/useEmployeeStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  href?: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  href = "/admin/home",
  active,
  onClick,
}: NavbarLinkProps) {
  return (
    <Link to={href}>
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton
          onClick={onClick}
          className={classes.link}
          data-active={active || undefined}
        >
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    </Link>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", href: "/admin/home" },
  {
    icon: IconCalendarStats,
    label: "Reservations",
    href: "/admin/reservation",
  },
  { icon: IconUser, label: "Customers", href: "/admin/customers" },
  { icon: IconCar, label: "Vehicles", href: "admin/vehicles" },
  { icon: IconInvoice, label: "Invoices", href: "admin/invoice" },
  {
    icon: IconDeviceDesktopAnalytics,
    label: "Analytics",
    href: "admin/analytics",
  },
];

export function AdminNavbar() {
  const [active, setActive] = useState(2);
  const clearEmployee = useEmployeeStore((state) => state.clearEmployee);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/", { replace: true });
    clearEmployee();
    localStorage.removeItem("emp");
    window.location.href = "/";
  };

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <p>Welcome Admin</p>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" onClick={handleLogout} />
      </Stack>
    </nav>
  );
}
