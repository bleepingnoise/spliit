import { createTRPCRouter } from '@/trpc/init'
import { listGroupBalancesProcedure } from '@/trpc/routers/groups/balances/list.procedure'
import { totalBalancesProcedure } from './total.procedure'

export const groupBalancesRouter = createTRPCRouter({
  list: listGroupBalancesProcedure,
  total: totalBalancesProcedure,
})
