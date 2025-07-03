import { getAllGroups, getGroup, getGroupExpenses } from '@/lib/api'
import { Balances, getBalances } from '@/lib/balances'
import { baseProcedure } from '@/trpc/init'
import { z } from 'zod'

export const totalBalancesProcedure = baseProcedure
  .input(z.null())
  .query(async () => {
    const groups = await getAllGroups()
    let totalBalances: Balances = {}
    let partecipantNamesMap: Map<string, string[]> = new Map<string, string[]>()
    for (let i = 0; i < groups.length; i++) {
      let group = groups[i]
      const groupObj = await getGroup(group.id)
      const expenses = await getGroupExpenses(group.id)
      const balances = getBalances(expenses)
      const partecipantKeys = Object.keys(balances)
      partecipantKeys.forEach((partecipantKey) => {
        let partecipant = groupObj?.participants.find(
          (x) => x.id == partecipantKey,
        )
        if (!partecipant) {
          throw 'Partecipant not found'
        }
        if (!partecipantNamesMap.has(partecipant.name)) {
          partecipantNamesMap.set(partecipant.name, [partecipant.id])
        } else {
          partecipantNamesMap.set(partecipant.name, [
            ...partecipantNamesMap.get(partecipant.name)!,
            partecipant.id,
          ])
        }
        let firstKey = partecipantNamesMap.get(partecipant.name)![0]
        if (!totalBalances[partecipant.name]) {
          totalBalances[partecipant.name] = balances[partecipantKey]
        } else {
          totalBalances[partecipant.name].paid += balances[partecipantKey].paid
          totalBalances[partecipant.name].paidFor +=
            balances[partecipantKey].paidFor
          totalBalances[partecipant.name].total +=
            balances[partecipantKey].total
        }
      })
    }
    return { balances: totalBalances }
  })
