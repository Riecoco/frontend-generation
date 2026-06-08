<template>
  <AppLayout
      :user-name="authStore.displayName"
      user-role="Customer"
      :items="navItems"
      active-key="my-transactions"
      @select="handleSelect"
      @logout="handleLogout"
  >
    <div class="max-w-6xl mx-auto space-y-8 py-8">
      <div class="text-center mb-8">
        <Heading :level="1">My Transactions</Heading>
      </div>

      <TransactionFilter @apply="onApplyFilters" />

      <Card>
        <CardContent>
          <TransactionTable
              :transactions="transactions"
              :page="filters.page"
              @prev-page="changePage(-1)"
              @next-page="changePage(1)"
          />
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Home, ArrowLeftRight, Wallet, Landmark, CreditCard } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.js'
import { useTransactionsStore } from '@/stores/transactions.js'
import { AppLayout, TransactionFilter, TransactionTable } from '../../organisms'
import { Heading } from '../../atoms'
import { Card, CardContent } from '../../molecules'
import {storeToRefs} from "pinia";

const router = useRouter()
const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()
const { transactions } = storeToRefs(transactionsStore)
const navItems = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'accounts', label: 'Accounts', icon: Wallet },
  { key: 'my-transactions', label: 'Transactions', icon: CreditCard },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'atm', label: 'ATM', icon: Landmark },
]

const filters = ref({
  page: 0,
  size: 10,
  startDate: '',
  endDate: '',
  amountLt: '',
  amountGt: '',
  amountEq: '',
  iban: ''
})

const fetchTransactions = async () => {
  if (authStore.user?.id) {
    await transactionsStore.filterTransactionsForUserId(authStore.user.id, filters.value)
  }
}

const onApplyFilters = async (newFilters) => {
  filters.value = { ...filters.value, ...newFilters, page: 0 }
  await fetchTransactions()
}

onMounted(async () => {
  if (!authStore.user) await authStore.fetchCurrentUser()
  await fetchTransactions()
})
const changePage = async (direction) => {
  filters.value.page += direction
  await fetchTransactions()
}

function handleSelect(key) {
  const routes = {
    overview: '/dashboard/customer',
    accounts: '/customer/accounts',
    'my-transactions': '/my-transactions',
    transfer: '/customer/transfer',
    atm: '/atm',
  }
  if (routes[key]) router.push(routes[key])
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
