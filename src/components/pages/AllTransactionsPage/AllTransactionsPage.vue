<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftRight, Clock, List, Users } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.js'
import { useTransactionsStore } from '@/stores/transactions.js'
import { AppLayout, TransactionTable } from '../../organisms'
import { Heading } from '../../atoms'
import { Card, CardContent } from '../../molecules'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()
const { transactions } = storeToRefs(transactionsStore)

const page = ref(0)
const size = 20

const employeeName = computed(() => {
  return [authStore.user?.firstName, authStore.user?.lastName]
      .filter(Boolean)
      .join(' ') || 'Employee'
})

const navItems = [
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'pending', label: 'Pending Approvals', icon: Clock },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'transactions', label: 'All Transactions', icon: List },
  { key: 'accounts', label: 'Accounts', icon: List },
]

const fetchTransactions = async () => {
  await transactionsStore.fetchAllTransactions(page.value, size)
}

const changePage = async (direction) => {
  page.value += direction
  await fetchTransactions()
}

onMounted(async () => {
  if (!authStore.user) await authStore.fetchCurrentUser()
  await fetchTransactions()
})

function handleSelect(key) {
  const routes = {
    customers: '/employee/customers',
    pending: '/employee/pending',
    transfer: '/employee/transfer',
    transactions: '/employee/transactions',
    accounts: '/employee/accounts',
  }
  if (routes[key]) router.push(routes[key])
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <AppLayout
      :user-name="employeeName"
      user-role="Employee"
      :items="navItems"
      active-key="transactions"
      @select="handleSelect"
      @logout="handleLogout"
  >
    <div class="max-w-6xl mx-auto space-y-8 py-8">
      <div class="text-center mb-8">
        <Heading :level="1">All Transactions</Heading>
      </div>
      <Card>
        <CardContent>
          <TransactionTable
              :transactions="transactions ?? []"
              :page="page"
              @prev-page="changePage(-1)"
              @next-page="changePage(1)"
          />
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>