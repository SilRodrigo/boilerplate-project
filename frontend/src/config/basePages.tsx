import { Home, Users, LogOut } from 'lucide-react'
import HomePage from '../pages/home/Index'
import UsersPage from '../pages/users/Index'
import type { AppPage, MenuItem } from './pageTypes'

/*
 * Pages that come with the boilerplate. Derived projects should not edit this
 * file (it would conflict when pulling boilerplate updates): add your pages to
 * pages.tsx instead.
 */
export const basePages: AppPage[] = [
  {
    path: '/',
    element: <HomePage />,
    title: 'Home',
    description: 'Página inicial',
    icon: Home,
  },
  {
    path: '/users',
    element: <UsersPage />,
    title: 'Usuários',
    description: 'Veja os usuários cadastrados',
    icon: Users,
    adminOnly: true,
  },
]

export const logoutMenuItem: MenuItem = {
  path: '/logout',
  title: 'Logout',
  description: 'Deslogar da sua conta',
  icon: LogOut,
}
