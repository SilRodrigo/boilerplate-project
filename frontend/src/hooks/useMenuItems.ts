import { basePages, logoutMenuItem } from "@/config/basePages"
import { pages } from "@/config/pages"
import type { MenuItem } from "@/config/pageTypes"
import { useAdminAccess } from "./useAdminAccess"

export const allPages = [...basePages, ...pages]

export function useMenuItems(): MenuItem[] {
  const isAdmin = useAdminAccess()

  return [
    ...allPages.filter((page) => !page.hideFromMenu && (!page.adminOnly || isAdmin)),
    logoutMenuItem,
  ]
}
