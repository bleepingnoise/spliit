import { categoriesRouter } from '@/trpc/routers/categories'
import { groupsRouter } from '@/trpc/routers/groups'
import { inferRouterOutputs } from '@trpc/server'
import { createTRPCRouter } from '../init'
import { groupBalancesRouter } from './groups/balances'

export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  balances: groupBalancesRouter,
  categories: categoriesRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterOutput = inferRouterOutputs<AppRouter>
