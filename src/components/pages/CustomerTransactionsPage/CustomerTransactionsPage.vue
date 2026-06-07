<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftRight, ChevronLeft, ChevronRight, CreditCard, Home, Landmark, ReceiptText, Wallet } from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import { useAccountsStore } from '../../../stores/accounts.js'
import { useTransactionsStore } from '../../../stores/transactions.js'
import { AppLayout, TransactionHistory } from '../../organisms'
import { Card, CardContent } from '../../molecules'
import { Text } from '../../atoms'

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()

const selectedIban = ref('')
const currentPage = ref(0)
const pageSize = 8

const navItems = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'accounts', label: 'Accounts', icon: Wallet },
  { key: 'transactions', label: 'Transactions', icon: CreditCard },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'atm', label: 'ATM', icon: Landmark },
]

const userName = computed(() => {
  const firstName = authStore.user?.firstName || ''
  const lastName = authStore.user?.lastName || ''

  return `${firstName} ${lastName}`.trim() || 'Customer'
})

const selectedAccount = computed(() =>
    accountsStore.accounts.find((account) => account.iban === selectedIban.value),
)

const totalPages = computed(() => transactionsStore.totalPages || 1)
const totalElements = computed(() => transactionsStore.totalElements || 0)

const canGoPrevious = computed(() => currentPage.value > 0)
const canGoNext = computed(() => currentPage.value + 1 < totalPages.value)

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchCurrentUser()
  }

  const userId = authStore.user?.id ?? authStore.user?.userId ?? authStore.user?.customerId

  if (!userId) return

  await accountsStore.fetchAccountsByUserId(userId)

  if (accountsStore.accounts.length > 0) {
    selectedIban.value = accountsStore.accounts[0].iban
    await loadTransactions()
  }
})

watch(selectedIban, async (iban, previousIban) => {
  if (!iban || iban === previousIban) return

  currentPage.value = 0
  await loadTransactions()
})

async function loadTransactions() {
  if (!selectedIban.value) return

  await transactionsStore.fetchTransactionsByIban(
      selectedIban.value,
      currentPage.value,
      pageSize,
  )
}

async function goToPreviousPage() {
  if (!canGoPrevious.value) return

  currentPage.value -= 1
  await loadTransactions()
}

async function goToNextPage() {
  if (!canGoNext.value) return

  currentPage.value += 1
  await loadTransactions()
}

function formatAccountLabel(account) {
  const type = formatAccountType(account?.accountType)
  return `${type} — ${account?.iban}`
}

function formatAccountType(type) {
  if (!type) return 'Account'

  return String(type)
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/^\w/, (letter) => letter.toUpperCase())
}

function handleSelect(key) {
  const routes = {
    overview: '/dashboard/customer',
    accounts: '/customer/accounts',
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

<template>
  <AppLayout
      :user-name="userName"
      user-role="Customer"
      :items="navItems"
      active-key="transactions"
      @select="handleSelect"
      @logout="handleLogout"
  >
    <div class="mx-auto max-w-6xl space-y-8 py-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight">
          Transaction History
        </h1>
        <Text
            color="muted"
            class="mt-2"
        >
          View paginated transfers, deposits, and withdrawals per account.
        </Text>
      </div>

      <!-- Account filter -->
      <Card class="overflow-hidden">
        <div class="border-b border-primary/10 bg-primary/5 px-8 pb-6 pt-8">
          <p class="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            Filter
          </p>
          <h2 class="text-2xl font-bold tracking-tight">
            Select Account
          </h2>
        </div>

        <CardContent class="p-8">
          <div
              v-if="accountsStore.loading"
              class="rounded-3xl border border-border bg-muted/30 p-8 text-center"
          >
            <Text color="muted">
              Loading accounts...
            </Text>
          </div>

          <div
              v-else-if="accountsStore.error"
              class="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center"
          >
            <Text class="text-destructive">
              {{ accountsStore.error }}
            </Text>
          </div>

          <div
              v-else-if="accountsStore.accounts.length === 0"
              class="rounded-3xl border border-border bg-muted/30 p-8 text-center"
          >
            <Text color="muted">
              No accounts found.
            </Text>
          </div>

          <div
              v-else
              class="grid gap-4 md:grid-cols-[1fr_auto]"
          >
            <div>
              <label
                  for="account"
                  class="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Account
              </label>

              <select
                  id="account"
                  v-model="selectedIban"
                  class="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary"
              >
                <option
                    v-for="account in accountsStore.accounts"
                    :key="account.iban"
                    :value="account.iban"
                >
                  {{ formatAccountLabel(account) }}
                </option>
              </select>
            </div>

            <div
                v-if="selectedAccount"
                class="rounded-3xl border border-border bg-muted/30 px-6 py-4"
            >
              <p class="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Showing
              </p>
              <p class="font-semibold text-foreground">
                {{ formatAccountType(selectedAccount.accountType) }}
              </p>
              <p class="mt-1 break-all font-mono text-sm text-muted-foreground">
                {{ selectedAccount.iban }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Transaction history -->
      <TransactionHistory
          :transactions="transactionsStore.transactions"
          :accounts="selectedAccount ? [selectedAccount] : accountsStore.accounts"
          :loading="transactionsStore.loading"
          :error="transactionsStore.error"
      />

      <!-- Pagination -->
      <Card>
        <CardContent class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <Text color="muted">
            {{ totalElements }} transactions · Page {{ currentPage + 1 }} of {{ totalPages }}
          </Text>

          <div class="flex items-center gap-3">
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!canGoPrevious || transactionsStore.loading"
                @click="goToPreviousPage"
            >
              <ChevronLeft class="h-4 w-4" />
              Previous
            </button>

            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!canGoNext || transactionsStore.loading"
                @click="goToNextPage"
            >
              Next
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>