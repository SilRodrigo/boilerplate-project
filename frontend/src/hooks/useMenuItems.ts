import { basePages, logoutMenuItem } from "@/config/basePages"
import { pages } from "@/config/pages"
import type { MenuItem } from "@/config/pageTypes"
import { useAdminAccess } from "./useAdminAccess"

export const allPages = [...basePages, ...pages]

/** Menu entries the current user may see: boilerplate pages, project pages, then Logout. */
export function useMenuItems(): MenuItem[] {
  const isAdmin = useAdminAccess()

  return [
    ...allPages.filter((page) => !page.hideFromMenu && (!page.adminOnly || isAdmin)),
    logoutMenuItem,
  ]
}
