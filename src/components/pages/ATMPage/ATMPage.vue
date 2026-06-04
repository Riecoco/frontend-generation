<template>
  <div class="flex min-h-screen bg-transparent">
    <Sidebar
      :user-name="userName"
      :user-role="userRole"
      :items="sidebarItems"
      active-key="atm"
      @select="handleSidebarSelect"
      @logout="handleLogout"
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden min-w-0">
      <div class="max-w-2xl mx-auto space-y-8 py-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">ATM Services</h1>
          <p class="text-gray-500 mt-2 font-medium">Deposit or withdraw cash</p>
        </div>

        <Card
          v-if="activeAccounts.length === 0"
          class="rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-card"
        >
          <CardContent class="pt-12 pb-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="bg-red-50 p-6 rounded-full">
                <AlertCircle class="h-12 w-12 text-red-500" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No Active Accounts</h3>
            <p class="text-gray-500 mb-8 font-medium">
              You need at least one active account to use ATM services.
            </p>
            <RouterLink to="/customer/accounts">
              <Button size="lg" class="rounded-2xl h-14 px-8 text-base shadow-lg shadow-primary/20">
                View My Accounts
              </Button>
            </RouterLink>
          </CardContent>
        </Card>

        <div v-else class="space-y-6">
          <Card
            v-if="mode === 'menu'"
            class="rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-card"
          >
            <div class="bg-primary/5 px-8 pt-10 pb-8 flex flex-col items-center border-b border-primary/10">
              <p class="text-sm font-bold text-primary uppercase tracking-wider mb-2">Select Account</p>
              <div class="w-full max-w-sm mt-4">
                <Select v-model="selectedAccountId">
                  <SelectTrigger class="bg-background border-0 shadow-sm h-14 rounded-2xl text-base px-5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent class="rounded-2xl shadow-xl">
                    <SelectItem
                      v-for="account in activeAccounts"
                      :key="account.iban"
                      :value="account.iban"
                      class="rounded-xl py-3 cursor-pointer"
                    >
                      <span class="font-medium">
                        {{ accountLabel(account) }}
                        <span class="text-gray-400 mx-2">&bull;</span>
                        {{ formatCurrency(account.balance) }}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardContent class="p-6 md:p-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  class="flex flex-col items-center justify-center p-8 bg-gray-50/80 rounded-3xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors gap-4 group"
                  @click="handleDeposit"
                >
                  <div class="p-4 bg-green-100 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                    <ArrowDownToLine class="h-8 w-8" />
                  </div>
                  <span class="text-xl font-bold text-gray-900">Deposit</span>
                </button>
                <button
                  type="button"
                  class="flex flex-col items-center justify-center p-8 bg-gray-50/80 rounded-3xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors gap-4 group"
                  @click="handleWithdraw"
                >
                  <div class="p-4 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                    <ArrowUpFromLine class="h-8 w-8" />
                  </div>
                  <span class="text-xl font-bold text-gray-900">Withdraw</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card
            v-if="mode === 'deposit' || mode === 'withdraw'"
            class="rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-card"
          >
            <form @submit.prevent="handleSubmit">
              <div class="bg-primary/5 px-8 pt-10 pb-8 flex flex-col items-center border-b border-primary/10 relative">
                <button
                  type="button"
                  class="absolute top-8 left-8 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                  @click="handleBack"
                >
                  Back
                </button>
                <Label
                  :label="mode === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'"
                  class="text-sm font-bold text-primary uppercase tracking-wider mb-3"
                />
                <div class="flex items-center justify-center text-primary group transition-all">
                  <span class="text-4xl font-light mr-2 opacity-60">&euro;</span>
                  <Input
                    v-model="amount"
                    type="number"
                    step="10"
                    min="10"
                    placeholder="0.00"
                    class="text-5xl md:text-6xl font-semibold bg-transparent border-0 text-center w-full max-w-[200px] focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-300 transition-all caret-primary"
                    autofocus
                  />
                </div>
              </div>

              <CardContent class="p-6 md:p-8 space-y-6">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    v-for="quickAmount in quickAmounts"
                    :key="quickAmount"
                    type="button"
                    class="py-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-lg font-bold text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                    @click="amount = quickAmount.toString()"
                  >
                    &euro;{{ quickAmount }}
                  </button>
                </div>

                <div class="p-4 bg-gray-50/80 rounded-3xl border border-gray-100 flex justify-between items-center px-6">
                  <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Account</p>
                    <p class="font-semibold text-gray-900">
                      {{ selectedAccount ? accountLabel(selectedAccount) : '' }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Balance</p>
                    <p class="font-semibold text-gray-900 font-mono">
                      {{ formatCurrency(selectedAccount?.balance || 0) }}
                    </p>
                  </div>
                </div>

                <Button
                  class="w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 flex items-center justify-center mt-4"
                  :disabled="transactionsStore.loading"
                  @click="handleSubmit"
                >
                  {{ transactionsStore.loading ? 'Processing...' : `Confirm ${mode === 'deposit' ? 'Deposit' : 'Withdrawal'}` }}
                </Button>
              </CardContent>
            </form>
          </Card>

          <Card
            v-if="mode === 'success'"
            class="rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-card"
          >
            <CardContent class="pt-16 pb-12 text-center">
              <div class="flex justify-center mb-6">
                <div class="bg-green-50 p-6 rounded-full scale-in-center animate-in duration-500">
                  <CheckCircle class="h-16 w-16 text-green-500" />
                </div>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-2">Transaction Successful</h3>
              <p class="text-gray-500 font-medium mb-8 text-lg">
                {{ currentAction === 'deposit' ? 'Deposited' : 'Withdrew' }} {{ formatCurrency(Number.parseFloat(amount)) }}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle,
  CreditCard,
  Home,
  List,
  Send,
  Wallet,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '../../../stores/auth.js'
import { useAccountsStore } from '../../../stores/accounts.js'
import { useTransactionsStore } from '../../../stores/transactions.js'
import { Button, Input, Label } from '../../atoms'
import {
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../molecules'
import { Sidebar } from '../../organisms'

type AtmMode = 'menu' | 'deposit' | 'withdraw' | 'success'
type AtmAction = '' | 'deposit' | 'withdraw'

type Account = {
  iban: string
  accountType: string
  balance: number
  status: string
  dailyLimit?: number
  absoluteLimit?: number
}

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()

const selectedAccountId = ref('')
const mode = ref<AtmMode>('menu')
const amount = ref('')
const currentAction = ref<AtmAction>('')
const successTimerId = ref<ReturnType<typeof window.setTimeout> | null>(null)

const quickAmounts = [20, 50, 100, 200]

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'transactions', label: 'Transactions', icon: List },
  { key: 'transfer', label: 'Transfer', icon: Send },
  { key: 'atm', label: 'ATM', icon: Wallet },
  { key: 'accounts', label: 'Accounts', icon: CreditCard },
]

const activeAccounts = computed<Account[]>(() => accountsStore.activeAccounts as Account[])
const selectedAccount = computed<Account | undefined>(() =>
  activeAccounts.value.find(account => account.iban === selectedAccountId.value),
)
const dailyLimit = computed(() => selectedAccount.value?.dailyLimit)
const absoluteLimit = computed(() => selectedAccount.value?.absoluteLimit)
const userName = computed(() => {
  const user = authStore.user as { firstName?: string; lastName?: string; name?: string; email?: string } | null
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  return fullName || user?.name || user?.email || 'Customer'
})
const userRole = computed(() => {
  const user = authStore.user as { role?: string } | null
  return user?.role || 'CUSTOMER'
})

const currencyFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
})

function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0)
}

function accountLabel(account: Account) {
  return account.accountType === 'CHECKING' ? 'Checking' : 'Savings'
}

function handleDeposit() {
  mode.value = 'deposit'
  currentAction.value = 'deposit'
}

function handleWithdraw() {
  mode.value = 'withdraw'
  currentAction.value = 'withdraw'
}

function handleBack() {
  mode.value = 'menu'
  amount.value = ''
}

function getStoreError(error: unknown, fallback: string) {
  if (!error) return fallback
  if (typeof error === 'string') return error
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

async function handleSubmit() {
  const amountValue = Number.parseFloat(amount.value)

  if (!amount.value || !Number.isFinite(amountValue) || amountValue <= 0) {
    toast.error('Please enter a valid amount')
    return
  }

  if (!selectedAccount.value) {
    toast.error('No account selected')
    return
  }

  if (currentAction.value === 'withdraw' && amountValue > selectedAccount.value.balance) {
    toast.error('Insufficient funds', {
      description: `Available balance: ${formatCurrency(selectedAccount.value.balance)}`,
    })
    return
  }

  const result = currentAction.value === 'deposit'
    ? await transactionsStore.deposit(selectedAccount.value.iban, amountValue)
    : await transactionsStore.withdraw(selectedAccount.value.iban, amountValue)

  if (!result || transactionsStore.error) {
    toast.error(getStoreError(transactionsStore.error, 'Transaction failed'))
    return
  }

  mode.value = 'success'
  toast.success(`${currentAction.value === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`, {
    description: formatCurrency(amountValue),
  })

  await accountsStore.fetchAccountsByUserId()

  if (successTimerId.value) {
    window.clearTimeout(successTimerId.value)
  }

  successTimerId.value = window.setTimeout(() => {
    mode.value = 'menu'
    amount.value = ''
    currentAction.value = ''
    successTimerId.value = null
  }, 3000)
}

function handleSidebarSelect(key: string) {
  const routes: Record<string, string> = {
    overview: '/dashboard/customer',
    transactions: '/customer/transactions',
    transfer: '/customer/transfer',
    atm: '/customer/atm',
    accounts: '/customer/accounts',
  }

  router.push(routes[key] || '/dashboard/customer')
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

watch(
  activeAccounts,
  accounts => {
    if (accounts.length > 0 && !accounts.some(account => account.iban === selectedAccountId.value)) {
      selectedAccountId.value = accounts[0].iban
    }
  },
  { immediate: true },
)

onMounted(() => {
  accountsStore.fetchAccountsByUserId()
})

onUnmounted(() => {
  if (successTimerId.value) {
    window.clearTimeout(successTimerId.value)
  }
})
</script>
