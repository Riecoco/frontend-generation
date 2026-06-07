<template>
  <AppLayout
      :user-name="authStore.user?.firstName + ' ' + authStore.user?.lastName"
      user-role="Customer"
      :items="navItems"
      active-key="overview"
      @select="handleSelect"
      @logout="handleLogout"
  >
    <div class="max-w-6xl mx-auto space-y-8 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Account Overview</h1>
        <Text color="muted" class="mt-2">Welcome back, {{ authStore.user?.firstName }}!</Text>
      </div>

      <!-- Account cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Checking -->
        <Card v-if="checkingAccount" class="overflow-hidden flex flex-col">
          <div class="bg-primary/5 px-8 pt-8 pb-6 flex flex-col items-center border-b border-primary/10">
            <div class="flex items-center gap-2 mb-3">
              <Wallet class="h-5 w-5 text-primary" />
              <p class="text-sm font-bold text-primary uppercase tracking-wider">Checking</p>
            </div>
            <div class="text-5xl font-semibold text-foreground tracking-tight">
              {{ formatCurrency(checkingAccount.balance) }}
            </div>
          </div>
          <CardContent class="p-8 flex-1">
            <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
              <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">IBAN</span>
              <span class="text-sm text-muted-foreground font-mono ml-2 break-all">{{ checkingAccount.iban }}</span>
            </div>
          </CardContent>
        </Card>

        <!-- Savings -->
        <Card v-if="savingsAccount" class="overflow-hidden flex flex-col">
          <div class="bg-green-50/50 px-8 pt-8 pb-6 flex flex-col items-center border-b border-green-100/50">
            <div class="flex items-center gap-2 mb-3">
              <PiggyBank class="h-5 w-5 text-green-600" />
              <p class="text-sm font-bold text-green-700 uppercase tracking-wider">Savings</p>
            </div>
            <div class="text-5xl font-semibold text-foreground tracking-tight">
              {{ formatCurrency(savingsAccount.balance) }}
            </div>
          </div>
          <CardContent class="p-8 flex-1">
            <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
              <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">IBAN</span>
              <span class="text-sm text-muted-foreground font-mono ml-2 break-all">{{ savingsAccount.iban }}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Recent transactions -->
      <TransactionHistory
          :transactions="recentTransactions"
          :accounts="accountsStore.accounts"
          :loading="transactionsStore.loading"
          :error="transactionsStore.error"
      />
    </div>
  </AppLayout>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Home, ArrowLeftRight, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, ReceiptText} from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import { useAccountsStore } from '../../../stores/accounts.js'
import { useTransactionsStore } from '../../../stores/transactions.js'
import { AppLayout, TransactionHistory } from '../../organisms'
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules'
import { Text } from '../../atoms'

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()

const navItems = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'transactions', label: 'Transactions', icon: ReceiptText },
]

onMounted(async () => {
  await accountsStore.fetchAccountsByUserId(authStore.user.id)
  await transactionsStore.fetchCustomerTransactions(authStore.user.id)
})

const checkingAccount = computed(() => accountsStore.checkingAccount)
const savingsAccount = computed(() => accountsStore.savingsAccount)
const recentTransactions = computed(() =>
    transactionsStore.transactions.slice(0, 5)
)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}

function handleSelect(key) {
  if (key === 'transfer') router.push('/overview/transfer')
  if (key === 'transactions') router.push('/customer/transactions')
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>