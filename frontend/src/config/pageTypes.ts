import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface AppPage {
  path: string
  element: ReactNode
  title: string
  description: string
  icon: LucideIcon
  adminOnly?: boolean
  hideFromMenu?: boolean
}

export type MenuItem = Pick<AppPage, 'path' | 'title' | 'description' | 'icon'>
