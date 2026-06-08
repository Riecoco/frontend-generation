<template>
  <div class="flex min-h-screen bg-transparent">
    <Sidebar
        :user-name="userName"
        :user-role="userRole"
        :items="sidebarItems"
        active-key="customers"
        @select="handleSidebarSelect"
        @logout="handleLogout"
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden min-w-0">
      <div class="max-w-6xl mx-auto space-y-8 py-8">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Button
              variant="outline"
              size="icon"
              class="h-12 w-12 rounded-2xl flex-shrink-0 border-gray-200"
              @click="goBack"
          >
            <ArrowLeft class="h-5 w-5" />
          </Button>

          <div class="flex-1 min-w-0">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight break-words">
              {{ customerDisplayName }}
            </h1>
            <p class="text-gray-500 mt-2 font-medium">Customer Accounts</p>
          </div>
        </div>

        <Tabs v-model:model-value="activeTab" class="w-full">
          <TabsList class="w-full sm:w-auto p-1.5 bg-gray-100 rounded-2xl h-14">
            <TabsTrigger
                value="accounts"
                class="flex items-center gap-2 rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-gray-500 data-[state=active]:text-gray-900"
            >
              <Wallet class="h-4 w-4" />
              <span>Bank Accounts</span>
            </TabsTrigger>
            <TabsTrigger
                value="transactions"
                class="flex items-center gap-2 rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-gray-500 data-[state=active]:text-gray-900"
            >
              <Receipt class="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" class="space-y-6 mt-8">
            <div v-if="accountsStore.loading" class="py-12 text-center text-gray-500 font-medium">
              Loading bank accounts...
            </div>

            <div v-else-if="customerAccounts.length === 0" class="py-12 text-center text-gray-500 font-medium">
              No bank accounts found for this customer.
            </div>

            <Card
                v-for="account in customerAccounts"
                v-else
                :key="account.iban"
                class="rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-card flex flex-col"
            >
              <div
                  class="px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b relative"
                  :class="accountType(account) === 'CHECKING' ? 'bg-primary/5 border-primary/10' : 'bg-green-50/50 border-green-100/50'"
              >
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <Wallet v-if="accountType(account) === 'CHECKING'" class="h-5 w-5 text-primary" />
                    <PiggyBank v-else class="h-5 w-5 text-green-600" />
                    <p
                        class="text-sm font-bold uppercase tracking-wider"
                        :class="accountType(account) === 'CHECKING' ? 'text-primary' : 'text-green-700'"
                    >
                      {{ accountTypeLabel(account) }}
                    </p>
                  </div>
                  <h2 class="text-xl md:text-3xl font-bold text-gray-900 tracking-tight font-mono break-all">
                    {{ account.iban }}
                  </h2>
                </div>

                <div class="flex flex-col items-start md:items-end gap-3">
                  <StatusBadge :status="accountStatus(account)" />
                  <div v-if="editingAccountIban === account.iban" class="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        class="h-10 rounded-xl font-bold bg-white/50 border-white/80"
                        @click="cancelAccountEdit"
                    >
                      <X class="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                        size="sm"
                        class="h-10 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white"
                        :disabled="accountsStore.loading"
                        @click="saveAccount(account)"
                    >
                      <Save class="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <div v-else class="flex gap-2 flex-wrap justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        class="h-10 rounded-xl font-bold bg-white/50 border-white/80 hover:bg-white text-gray-900"
                        @click="startAccountEdit(account)"
                    >
                      <Edit2 class="h-4 w-4 mr-2" />
                      Edit Account
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        class="h-10 rounded-xl font-bold"
                        :disabled="accountsStore.loading"
                        @click="handleCloseAccount(account)"
                    >
                      <X class="h-4 w-4 mr-2" />
                      Close Account
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent class="p-6 md:p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoTile label="Current Balance" :value="formatCurrency(account.balance)" strong />
                  <InfoTile label="Status" :value="accountStatus(account)" class="capitalize" />

                  <div class="p-4 bg-gray-50/80 rounded-3xl border border-gray-100 hover:border-primary/20 transition-colors">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Daily Limit</p>
                    <Input
                        v-if="editingAccountIban === account.iban"
                        v-model="accountEdit.dailyLimit"
                        type="number"
                        min="0"
                        class="mt-2 bg-background border-gray-200 shadow-sm h-10 rounded-xl px-4"
                    />
                    <p v-else class="font-semibold text-gray-900 ml-2 mt-1">
                      {{ formatCurrency(dailyLimitValue(account)) }}
                    </p>
                  </div>

                  <div class="p-4 bg-gray-50/80 rounded-3xl border border-gray-100 hover:border-primary/20 transition-colors">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Absolute Limit</p>
                    <Input
                        v-if="editingAccountIban === account.iban"
                        v-model="accountEdit.absoluteLimit"
                        type="number"
                        class="mt-2 bg-background border-gray-200 shadow-sm h-10 rounded-xl px-4"
                    />
                    <p v-else class="font-semibold text-gray-900 ml-2 mt-1">
                      {{ formatCurrency(limitValue(account.absoluteLimit)) }}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" class="space-y-6 mt-8">
            <Card class="rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-card">
              <div class="bg-primary/5 px-8 pt-8 pb-6 flex flex-col items-center border-b border-primary/10">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <Receipt class="h-5 w-5 text-primary" />
                  <p class="text-sm font-bold text-primary uppercase tracking-wider">History</p>
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Transactions</h2>
              </div>
              <CardContent class="p-6 md:p-8">

                <!-- Loading -->
                <div v-if="txLoading" class="py-12 text-center text-gray-500 font-medium">
                  Loading transactions...
                </div>

                <!-- No data -->
                <div v-else-if="transactions.length === 0" class="py-12 text-center text-gray-500 font-medium">
                  No transactions found for this customer.
                </div>

                <!-- Data -->
                <template v-else>
                  <!-- Filters -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Type</p>
                      <select
                          v-model="filterType"
                          class="w-full h-12 px-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-sm font-medium text-gray-700"
                      >
                        <option value="ALL">All Types</option>
                        <option value="TRANSFER">Transfer</option>
                        <option value="DEPOSIT">Deposit</option>
                        <option value="WITHDRAWAL">Withdrawal</option>
                      </select>
                    </div>

                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Amount</p>
                      <select
                          v-model="filterAmountOperator"
                          class="w-full h-12 px-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-sm font-medium text-gray-700"
                      >
                        <option value="ANY">Any Amount</option>
                        <option value="GT">Greater Than</option>
                        <option value="LT">Less Than</option>
                      </select>
                    </div>

                    <div v-if="filterAmountOperator !== 'ANY'">
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Amount (€)</p>
                      <input
                          v-model="filterAmountValue"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          class="w-full h-12 px-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-sm font-medium text-gray-700"
                      />
                    </div>
                  </div>

                  <!-- No results after filter -->
                  <div v-if="filteredTransactions.length === 0" class="py-8 text-center text-gray-500 font-medium">
                    No transactions match the current filters.
                  </div>

                  <!-- List -->
                  <div v-else class="space-y-4">
                    <div
                        v-for="tx in filteredTransactions"
                        :key="tx.id"
                        class="flex flex-col gap-4 p-5 bg-gray-50/80 border border-gray-100 rounded-3xl hover:border-primary/20 transition-colors"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex items-start gap-4 min-w-0 flex-1">
                          <div :class="['p-3 rounded-2xl flex-shrink-0', tx.transactionType === 'DEPOSIT' ? 'bg-green-100' : 'bg-red-100']">
                            <ArrowDownRight v-if="tx.transactionType === 'DEPOSIT'" class="h-6 w-6 text-green-600" />
                            <ArrowUpRight v-else class="h-6 w-6 text-red-600" />
                          </div>
                          <div class="min-w-0 flex-1 mt-1">
                            <p class="font-bold text-gray-900 text-lg break-words">{{ tx.description || tx.transactionType }}</p>
                            <p class="text-sm text-gray-500 mt-1">{{ formatDateTime(tx.timestamp) }}</p>
                          </div>
                        </div>
                        <p class="font-bold text-xl flex-shrink-0 mt-1">{{ formatCurrency(tx.amount) }}</p>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2">From Account</p>
                          <p class="text-sm font-mono text-gray-700 break-all ml-2">{{ tx.fromAccountIban || '—' }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2">To Account</p>
                          <p class="text-sm font-mono text-gray-700 break-all ml-2">{{ tx.toAccountIban || '—' }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2">Type</p>
                          <p class="text-sm font-medium text-gray-700 ml-2 capitalize">{{ tx.transactionType?.toLowerCase() }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2">Initiated By</p>
                          <p class="text-sm font-medium text-gray-700 ml-2">
                            {{ tx.initiatedBy ? tx.initiatedBy.firstName + ' ' + tx.initiatedBy.lastName : '—' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Pagination -->
                <div v-if="txPage && txPage.totalPages > 1" class="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                      @click="changeTxPage(txCurrentPage - 1)"
                      :disabled="txCurrentPage === 0"
                      class="px-6 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    Previous
                  </button>
                  <span class="text-sm font-medium text-gray-500">
                    Page {{ txCurrentPage + 1 }} of {{ txPage.totalPages }}
                  </span>
                  <button
                      @click="changeTxPage(txCurrentPage + 1)"
                      :disabled="txCurrentPage === txPage.totalPages - 1"
                      class="px-6 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    Next
                  </button>
                </div>
                </template>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Edit2,
  PiggyBank,
  Receipt,
  Save,
  UserCheck,
  Users,
  Wallet,
  X,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '../../../stores/auth.js'
import { useAccountsStore } from '../../../stores/accounts.js'
import { Button, Input, StatusBadge } from '../../atoms'
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '../../molecules'
import { Sidebar } from '../../organisms'
import apiClient from '../../../utils/axios.js'

type Account = {
  iban: string
  accountType?: string
  type?: string
  balance?: number
  status?: string
  accountStatus?: string
  dailyLimit?: number
  dailyTransferLimit?: number
  absoluteLimit?: number
  firstName?: string
  lastName?: string
  customerFirstName?: string
  customerLastName?: string
  userFirstName?: string
  userLastName?: string
  customerName?: string
  userName?: string
  name?: string
  customer?: { firstName?: string; lastName?: string; name?: string }
  user?: { firstName?: string; lastName?: string; name?: string }
}

type AccountEdit = {
  dailyLimit: string
  absoluteLimit: string
}

const InfoTile = defineComponent({
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    strong: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
        h('div', { class: 'p-4 bg-gray-50/80 rounded-3xl border border-gray-100 hover:border-primary/20 transition-colors' }, [
          h('p', { class: 'text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-2' }, props.label),
          h('p', { class: props.strong ? 'font-bold text-gray-900 text-lg ml-2' : 'font-semibold text-gray-900 ml-2' }, props.value),
        ])
  },
})

const CUSTOMER_LIST_ROUTE = '/employee/customers'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const activeTab = ref('accounts')
const editingAccountIban = ref<string | null>(null)
const accountEdit = ref<AccountEdit>({ dailyLimit: '', absoluteLimit: '' })

// Transactions state
const txPage = ref<any>(null)
const txLoading = ref(false)
const txCurrentPage = ref(0)
const transactions = computed(() => txPage.value?.content ?? [])

//for filtering the transactions
const filterType = ref('ALL')
const filterAmountOperator = ref('ANY')
const filterAmountValue = ref('')

const filteredTransactions = computed(() => {
  return transactions.value.filter(tx => {
    if (filterType.value !== 'ALL' && tx.transactionType !== filterType.value) return false
    if (filterAmountOperator.value !== 'ANY' && filterAmountValue.value) {
      const amt = parseFloat(filterAmountValue.value)
      if (filterAmountOperator.value === 'GT' && tx.amount <= amt) return false
      if (filterAmountOperator.value === 'LT' && tx.amount >= amt) return false
    }
    return true
  })
})

const sidebarItems = [
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'pending-approvals', label: 'Pending Approvals', icon: UserCheck },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'all-transactions', label: 'All Transactions', icon: Receipt },
]

const customerId = computed(() => String(route.params.id || ''))

const customerDisplayName = computed(() => {
  const user = authStore.user as { firstName?: string; lastName?: string; name?: string; email?: string } | null
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  return fullName || user?.name || user?.email || `Customer ID: ${customerId.value}`
})

const userName = computed(() => {
  const user = authStore.user as { firstName?: string; lastName?: string; name?: string; email?: string } | null
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  return fullName || user?.name || user?.email || 'Employee'
})

const userRole = computed(() => {
  const user = authStore.user as { role?: string } | null
  return user?.role || 'EMPLOYEE'
})

const customerAccounts = computed<Account[]>(() => accountsStore.accounts as Account[])

const currencyFormatter = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })

function getStoreError(error: unknown, fallback: string) {
  if (!error) return fallback
  if (typeof error === 'string') return error
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message
  return fallback
}

function limitValue(value: unknown) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

function formatCurrency(value: unknown) {
  return currencyFormatter.format(limitValue(value))
}

function formatDateTime(timestamp: string) {
  return new Date(timestamp).toLocaleString('nl-NL', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function accountType(account: Account) {
  return String(account.accountType || account.type || 'ACCOUNT').toUpperCase()
}

function accountTypeLabel(account: Account) {
  const label = accountType(account).replace(/_/g, ' ')
  return label.endsWith('ACCOUNT') ? label : `${label} ACCOUNT`
}

function accountStatus(account: Account) {
  return String(account.status || account.accountStatus || 'active').toLowerCase()
}

function dailyLimitValue(account: Account) {
  return limitValue(account.dailyLimit ?? account.dailyTransferLimit)
}

function goBack() {
  router.push(CUSTOMER_LIST_ROUTE)
}

function handleSidebarSelect(key: string) {
  const routes: Record<string, string> = {
    customers: '/employee/customers',
    'pending-approvals': '/employee/pending',
    transfer: '/employee/transfer',
    'all-transactions': '/employee/transactions',
  }
  router.push(routes[key] || CUSTOMER_LIST_ROUTE)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function startAccountEdit(account: Account) {
  editingAccountIban.value = account.iban
  accountEdit.value = {
    dailyLimit: String(dailyLimitValue(account)),
    absoluteLimit: String(limitValue(account.absoluteLimit)),
  }
}

function cancelAccountEdit() {
  editingAccountIban.value = null
  accountEdit.value = { dailyLimit: '', absoluteLimit: '' }
}

async function saveAccount(account: Account) {
  const dailyLimit = Number.parseFloat(accountEdit.value.dailyLimit)
  const absoluteLimit = Number.parseFloat(accountEdit.value.absoluteLimit)

  if (!Number.isFinite(dailyLimit) || dailyLimit < 0 || !Number.isFinite(absoluteLimit)) {
    toast.error('Please enter valid account limits')
    return
  }

  const result = await accountsStore.updateAccountLimits(account.iban, {
    iban: account.iban,
    accountType: accountType(account),
    dailyLimit,
    absoluteLimit,
  })

  if (!result || accountsStore.error) {
    toast.error(getStoreError(accountsStore.error, 'Failed to update account limits'))
    return
  }

  toast.success('Account details updated successfully')
  cancelAccountEdit()
}

async function handleCloseAccount(account: Account) {
  const confirmed = window.confirm(`Close account ${account.iban}?`)
  if (!confirmed) return

  const result = await accountsStore.closeAccount(account.iban)

  if (!result && accountsStore.error) {
    toast.error(getStoreError(accountsStore.error, 'Failed to close account'))
    return
  }

  toast.success('Account closed successfully')
}

async function fetchTransactions(page = 0) {
  txLoading.value = true
  try {
    const res = await apiClient.get('/transactions/user', {
      params: { userId: customerId.value, page, size: 10 }
    })
    txPage.value = res.data
    txCurrentPage.value = page
  } finally {
    txLoading.value = false
  }
}

async function changeTxPage(page: number) {
  await fetchTransactions(page)
}

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchCurrentUser()
  }
  await accountsStore.fetchAccountsByUserId(customerId.value)
  if (accountsStore.error) {
    toast.error(getStoreError(accountsStore.error, 'Failed to load bank accounts'))
  }
  await fetchTransactions(0)
})
</script>