<template>
  <AppLayout
      :user-name="authStore.displayName"
      user-role="Customer"
      :items="navItems"
      active-key="accounts"
      @select="handleSelect"
      @logout="handleLogout"
  >
    <div class="max-w-6xl mx-auto space-y-8 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <Heading :level="1">My Accounts</Heading>
        <Text color="muted" class="mt-2">View your bank account details and limits</Text>
      </div>

      <!-- Total -->
      <Card class="overflow-hidden">
        <CardContent class="px-8 py-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-primary/10 p-3 rounded-full">
              <Wallet class="h-6 w-6 text-primary" />
            </div>
            <div>
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Combined Balance</p>
              <p class="text-2xl font-semibold tracking-tight">{{ formatCurrency(totalBalance) }}</p>
            </div>
          </div>
          <Text color="muted" class="text-sm">{{ accounts.length }} account{{ accounts.length !== 1 ? 's' : '' }}</Text>
        </CardContent>
      </Card>

      <!-- No accounts -->
      <Card v-if="accounts.length === 0" class="overflow-hidden">
        <CardContent class="py-12">
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div class="bg-muted p-6 rounded-full">
                <Wallet class="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h3 class="text-2xl font-bold mb-2">No Bank Accounts</h3>
            <Text color="muted">You don't have any bank accounts yet.</Text>
          </div>
        </CardContent>
      </Card>

      <!-- Accounts -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card
            v-for="account in accounts"
            :key="account.iban"
            class="overflow-hidden flex flex-col h-full"
        >
          <!-- Header -->
          <div
              :class="['px-8 pt-8 pb-6 flex flex-col items-center border-b relative', account.accountType === 'CHECKING' ? 'bg-primary/5 border-primary/10' : 'bg-green-50/50 border-green-100/50']"
          >
            <!-- Status badge -->
            <div class="absolute top-6 right-6">
              <span
                  :class="['inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border', account.accountStatus === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20']"
              >
                <CheckCircle v-if="account.accountStatus === 'ACTIVE'" class="h-4 w-4" />
                <AlertCircle v-else class="h-4 w-4" />
                {{ account.accountStatus === 'ACTIVE' ? 'Active' : 'Closed' }}
              </span>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <Wallet v-if="account.accountType === 'CHECKING'" class="h-6 w-6 text-primary" />
              <PiggyBank v-else class="h-6 w-6 text-green-600" />
              <p :class="['text-sm font-bold uppercase tracking-wider', account.accountType === 'CHECKING' ? 'text-primary' : 'text-green-700']">
                {{ account.accountType === 'CHECKING' ? 'Checking Account' : 'Savings Account' }}
              </p>
            </div>

            <div class="text-5xl font-semibold text-foreground tracking-tight">
              {{ formatCurrency(account.balance) }}
            </div>
          </div>

          <CardContent class="p-8 flex flex-col gap-6 flex-1">
            <!-- Account Information -->
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-2">Account Information</p>
              <div class="space-y-4 ml-2">
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">IBAN</span>
                  <span class="text-sm font-mono text-foreground break-all">{{ account.iban }}</span>
                </div>
              </div>
            </div>

            <!-- Account Limits -->
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-2">Account Limits</p>
              <div class="space-y-4 ml-2">
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Absolute Limit</span>
                  <span class="text-sm font-medium text-foreground">{{ formatCurrency(account.absoluteLimit) }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Daily Limit</span>
                  <span class="text-sm font-medium text-foreground">{{ account.dailyLimit > 0 ? formatCurrency(account.dailyLimit) : 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Closed warning -->
            <div v-if="account.accountStatus === 'CLOSED'" class="mt-auto p-4 rounded-3xl bg-destructive/10 border border-destructive/20 flex gap-3 items-center">
              <AlertCircle class="w-5 h-5 text-destructive shrink-0" />
              <Text size="sm" color="destructive">This account is closed. You cannot perform any transactions.</Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Home, ArrowLeftRight, Wallet, PiggyBank, AlertCircle, CheckCircle, CreditCard, Landmark } from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import { useAccountsStore } from '../../../stores/accounts.js'
import { AppLayout } from '../../organisms'
import { Card, CardContent } from '../../molecules'
import { Heading, Text } from '../../atoms'

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const navItems = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'accounts', label: 'Accounts', icon: Wallet },
  { key: 'transactions', label: 'Transactions', icon: CreditCard },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'atm', label: 'ATM', icon: Landmark },
]

onMounted(async () => {
  if (authStore.user?.id) {
    await accountsStore.fetchAccountsByUserId(authStore.user.id)
  }
})

const accounts = computed(() => accountsStore.accounts)
const totalBalance = computed(() => accounts.value.reduce((sum, a) => sum + (a.balance ?? 0), 0))

const formatCurrency = (amount) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount ?? 0)

function handleSelect(key) {
  const routes = {
    overview: '/dashboard/customer',
    transactions: '/customer/transactions',
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