import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** A private page: becomes a route inside <PrivateRoute> and, unless hidden, a menu entry. */
export interface AppPage {
  path: string
  element: ReactNode
  title: string
  description: string
  icon: LucideIcon
  /** Only ADMIN users see it in the menu and can open the route. */
  adminOnly?: boolean
  /** Registers the route without listing it in the menu. */
  hideFromMenu?: boolean
}

/** A menu entry that is not a private page (e.g. Logout). */
export type MenuItem = Pick<AppPage, 'path' | 'title' | 'description' | 'icon'>
