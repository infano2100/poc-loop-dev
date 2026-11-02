import { createBrowserRouter, createMemoryRouter, Navigate, type RouteObject } from 'react-router-dom'
import { APP_NAME } from '@/config/app'

const routes: RouteObject[] = [
  { path: '/login', element: <h1>Login</h1> },
  { path: '/', element: <h1>{APP_NAME}</h1> },
  { path: '*', element: <Navigate to="/" replace /> },
]

export const createAppRouter = (initialEntries: string[]) =>
  createMemoryRouter(routes, { initialEntries })

export const createBrowserAppRouter = () => createBrowserRouter(routes)
