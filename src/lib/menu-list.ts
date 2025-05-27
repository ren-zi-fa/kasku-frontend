import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Notebook,
  Watch,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Manajemen Kas",
          icon: Notebook,
          submenus: [
            {
              href: "/dashboard/cash-transactions",
              label: "Transaksi Kas",
            },
            {
              href: "/dashboard/transaction-categories",
              label: "Kategori Transaksi",
            },
          ],
        },
        {
          href: "/dashboard/cash-balance",
          label: "log transaksi",
          icon: Watch,
        },
      ],
    },
    {
      groupLabel: "Manajemen Pengguna",
      menus: [
        {
          href: "/dashboard/users",
          label: "Daftar Pengguna",
          icon: Users,
        },
        {
          href: "/dashboard/account",
          label: "Account",
          icon: Settings,
        },
      ],
    },
  ];
}
