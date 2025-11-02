"use client";

import {
  Archive,
  ChevronDown,
  ChevronUp,
  FileBox,
  Home,
  PackageOpenIcon,
  PenToolIcon,
  Settings,
  ShoppingCart,
  Users,
  Upload,

} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    subItems: [
      { title: "User List", url: "/admin/users/" },
      { title: "Create User", url: "/admin/users/create" },
    ],
  },
  {
    title: "Image Uplord",
    url: "/admin/imageUplord",
    icon: Upload,
    subItems: [
      { title: "Uplord Image", url: "/admin/imageUplord" },
      // { title: "List Image", url: "/admin/ImageAdd" },
    ],
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: PackageOpenIcon,
    subItems: [
      { title: "Categories List", url: "/admin/categories" },
      { title: "Add Category", url: "/admin/categories/add" },
      { title: "Manage Fields", url: "/admin/categories/fields" },
    ],
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: FileBox,
    subItems: [
      { title: "Product List", url: "/admin/products" },
      { title: "Add Product", url: "/admin/products/add" },
    ],
  },
  {
    title: "Video",
    url: "/admin/heroVideos",
    icon: FileBox,
    subItems: [
      // { title: "Product List", url: "/admin/products" },
      { title: "Add Video", url: "/admin/heroVideos/add" },
    ],
  },
  {
    title: "Home Installation",
    url: "/admin/home-installation",
    icon: PenToolIcon,
    subItems: [
      { title: "Show All", url: "/admin/home-installation" },
      { title: "Requested", url: "/admin/home-installation/requested" },
      { title: "Cancelled", url: "/admin/home-installation/cancelled" },
      { title: "Completed", url: "/admin/home-installation/completed" },
    ],
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
    subItems: [
      { title: "Order List", url: "/admin/orders/list" },
      { title: "Create Order", url: "/admin/orders/create" },
    ],
  },
  {
    title: "Inventory",
    url: "/admin/inventory",
    icon: Archive,
    subItems: [
      { title: "Inventory List", url: "/admin/inventory/list" },
      { title: "Update Inventory", url: "/admin/inventory/update" },
    ],
  },
  // {
  //   title: "Reviews",
  //   url: "/admin/reviews",
  //   icon: Star,
  // },
  // {
  //   title: "Discounts",
  //   url: "/admin/discounts",
  //   icon: Tag,
  //   subItems: [
  //     { title: "Discount List", url: "/admin/discounts/list" },
  //     { title: "Add Discount", url: "/admin/discounts/add" },
  //   ],
  // },
  // {
  //   title: "Reports",
  //   url: "/admin/reports",
  //   icon: BarChart,
  //   subItems: [
  //     { title: "Sales Report", url: "/admin/reports/sales" },
  //     { title: "User Activity", url: "/admin/reports/user-activity" },
  //     { title: "Inventory Report", url: "/admin/reports/inventory" },
  //   ],
  // },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    subItems: [
      { title: "General Settings", url: "/admin/settings/general" },
      { title: "User Roles", url: "/admin/settings/user-roles" },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <SidebarContent className="bg-white dark:bg-gray-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-900 dark:text-white text-xl my-6 gap-4 flex items-center px-4">
            <Link href={"/admin/dashboard"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image
                src="/LOGO.png"
                alt="logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
                loading="eager"
              />
              <span className="font-bold text-lg">Demonoid</span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mt-4 overflow-x-hidden px-2">
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center justify-between py-3 px-3 relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group">
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                            <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item.title}</span>
                        </div>

                        {item.subItems ? (
                          <div className="flex items-center">
                            <ChevronDown className="w-4 h-4 text-gray-400 group-open:hidden" />
                            <ChevronUp className="w-4 h-4 text-gray-400 hidden group-open:block" />
                          </div>
                        ) : (
                          <Link
                            href={item.url}
                            className="ml-auto w-full h-full absolute z-10"
                          ></Link>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>

                  {item.subItems && (
                    <CollapsibleContent>
                      <SidebarMenu className="ml-8 space-y-1 mt-2">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton asChild>
                              <Link 
                                href={subItem.url}
                                className="flex items-center py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
