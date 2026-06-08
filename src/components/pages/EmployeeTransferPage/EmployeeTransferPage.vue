<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  CheckCircle,
  Clock,
  List,
  Search,
  Users,
} from '@lucide/vue'
import { toast } from 'vue-sonner'

import apiClient from '../../../utils/axios.js'
import { useAuthStore } from '../../../stores/auth.js'
import { useTransactionsStore } from '../../../stores/transactions.js'
import { AppLayout } from '../../organisms'
import { Card, CardContent } from '../../molecules'
import { Button, Input, Label, Text } from '../../atoms'

const router = useRouter()
const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()

const navItems = [
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'pending', label: 'Pending Approvals', icon: Clock },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'transactions', label: 'All Transactions', icon: List },
  { key: 'accounts', label: 'Accounts', icon: List },
]

const step = ref(1)

const amount = ref('')
const description = ref('')

const fromFirstName = ref('')
const fromLastName = ref('')
const fromManualIban = ref('')
const fromResults = ref([])
const fromAccount = ref(null)

const toFirstName = ref('')
const toLastName = ref('')
const toManualIban = ref('')
const toResults = ref([])
const toAccount = ref(null)

const searchingFrom = ref(false)
const searchingTo = ref(false)

const employeeName = computed(() => {
  return [authStore.user?.firstName, authStore.user?.lastName]
      .filter(Boolean)
      .join(' ') || 'Employee'
})

const formattedAmount = computed(() =>
    formatCurrency(Number(amount.value || 0)),
)

const canReview = computed(() => {
  return Number(amount.value) > 0 &&
      fromAccount.value?.iban &&
      toAccount.value?.iban &&
      fromAccount.value.iban !== toAccount.value.iban
})

const canSubmit = computed(() =>
    canReview.value && !transactionsStore.loading,
)

function handleNavigation(key) {
  const routes = {
    customers: '/employee/customers',
    pending: '/employee/pending',
    transfer: '/employee/transfer',
    transactions: '/employee/transactions',
    accounts: '/employee/accounts',
  }

  const routePath = routes[key]

  if (routePath) {
    router.push(routePath)
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function normalizeAccounts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.content)) return payload.content
  if (Array.isArray(payload?.accounts)) return payload.accounts
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?._embedded?.accounts)) return payload._embedded.accounts
  if (payload?.iban) return [payload]
  return []
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      fallback
}

async function searchAccounts(target) {
  const firstName = target === 'from' ? fromFirstName.value : toFirstName.value
  const lastName = target === 'from' ? fromLastName.value : toLastName.value

  if (!firstName || !lastName) {
    toast.error('Please enter first and last name.')
    return
  }

  setSearching(target, true)
  clearResults(target)

  try {
    const response = await apiClient.get('/accounts/search', {
      params: { firstName, lastName },
    })

    let accounts = normalizeAccounts(response.data)

    if (target === 'from') {
      accounts = accounts.filter((account) => account.accountType === 'CHECKING')
    }

    // fetch full account data with balance for each account
    const fullAccounts = await Promise.all(
        accounts.map(async (acc) => {
          const res = await apiClient.get('/accounts/iban', {
            params: { iban: acc.iban }
          })
          return res.data
        })
    )

    setResults(target, fullAccounts)

    if (fullAccounts.length === 0) {
      toast.error(target === 'from'
          ? 'No checking accounts found for this customer.'
          : 'No accounts found for this customer.',
      )
      return
    }

    toast.success(`Found ${fullAccounts.length} account(s).`)
  } catch (error) {
    setResults(target, [])
    toast.error(getErrorMessage(error, 'Customer not found.'))
  } finally {
    setSearching(target, false)
  }
}

async function findAccountByIban(target) {
  const iban = target === 'from' ? fromManualIban.value : toManualIban.value

  if (!iban) {
    toast.error('Please enter an IBAN.')
    return
  }

  setSearching(target, true)
  clearResults(target)

  try {
    const response = await apiClient.get('/accounts/iban', {
      params: { iban: iban.replaceAll(' ', '') },
    })

    const accounts = normalizeAccounts(response.data)
    let account = accounts[0]

    if (!account) {
      toast.error('Account not found.')
      return
    }

    if (target === 'from' && account.accountType !== 'CHECKING') {
      toast.error('Source account must be a checking account.')
      return
    }

    if (target === 'to' && fromAccount.value?.iban === account.iban) {
      toast.error('Destination account must be different from source account.')
      return
    }

    if (target === 'from') {
      selectFromAccount(account)
    } else {
      selectToAccount(account)
    }

    toast.success('Account selected.')
  } catch (error) {
    toast.error(getErrorMessage(error, 'Account not found.'))
  } finally {
    setSearching(target, false)
  }
}

function setSearching(target, value) {
  if (target === 'from') {
    searchingFrom.value = value
    return
  }

  searchingTo.value = value
}

function setResults(target, accounts) {
  if (target === 'from') {
    fromResults.value = accounts
    return
  }

  toResults.value = accounts
}

function clearResults(target) {
  setResults(target, [])
}

function selectFromAccount(account) {
  fromAccount.value = account
  fromManualIban.value = account.iban
  fromResults.value = []

  if (toAccount.value?.iban === account.iban) {
    toAccount.value = null
    toManualIban.value = ''
  }
}

function selectToAccount(account) {
  if (fromAccount.value?.iban === account.iban) {
    toast.error('Destination account must be different from source account.')
    return
  }

  toAccount.value = account
  toManualIban.value = account.iban
  toResults.value = []
}

function handleNext() {
  if (!amount.value || Number(amount.value) <= 0) {
    toast.error('Please enter a valid amount.')
    return
  }

  if (!fromAccount.value?.iban) {
    toast.error('Please select a source checking account.')
    return
  }

  if (!toAccount.value?.iban) {
    toast.error('Please select a destination account.')
    return
  }

  if (fromAccount.value.iban === toAccount.value.iban) {
    toast.error('Source and destination accounts must be different.')
    return
  }

  step.value = 2
}

async function handleSubmit() {
  try {
    await transactionsStore.createTransfer(
        fromAccount.value.iban,
        toAccount.value.iban,
        Number(amount.value),
        description.value || 'Employee transfer',
    )

    toast.success('Transfer completed successfully!', {
      description: `Transferred ${formatCurrency(Number(amount.value))}`,
    })

    resetForm()
  } catch (error) {
    toast.error(getErrorMessage(error, 'Transfer failed.'))
  }
}

function resetForm() {
  step.value = 1
  amount.value = ''
  description.value = ''

  fromFirstName.value = ''
  fromLastName.value = ''
  fromManualIban.value = ''
  fromResults.value = []
  fromAccount.value = null

  toFirstName.value = ''
  toLastName.value = ''
  toManualIban.value = ''
  toResults.value = []
  toAccount.value = null
}

function formatCurrency(value) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value || 0))
}

function formatAccountType(type) {
  if (!type) return 'Account'

  return String(type)
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/^\w/, (letter) => letter.toUpperCase())
}

function getCustomerName(account) {
  const firstName =
      account?.firstName ||
      account?.user?.firstName ||
      account?.customer?.firstName ||
      ''

  const lastName =
      account?.lastName ||
      account?.user?.lastName ||
      account?.customer?.lastName ||
      ''

  return `${firstName} ${lastName}`.trim() || 'Customer'
}
</script>

<template>
  <AppLayout
      :user-name="employeeName"
      user-role="Employee"
      :items="navItems"
      active-key="transfer"
      @select="handleNavigation"
      @logout="handleLogout"
  >
    <div class="mx-auto w-full max-w-2xl space-y-8 py-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight">
          Employee Transfer
        </h1>
        <Text
            color="muted"
            class="mt-2"
        >
          Transfer funds between customer accounts.
        </Text>
      </div>

      <!-- Step indicator -->
      <div class="flex items-center justify-center gap-5">
        <div class="flex flex-col items-center gap-2">
          <div
              :class="[
              'flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-colors',
              step === 1 ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-muted text-muted-foreground',
            ]"
          >
            1
          </div>
          <Text
              as="span"
              size="xs"
              weight="bold"
              :color="step === 1 ? 'primary' : 'muted'"
              class="uppercase tracking-widest"
          >
            Details
          </Text>
        </div>

        <div class="-mt-5 h-0.5 w-16 bg-sidebar-border" />

        <div class="flex flex-col items-center gap-2">
          <div
              :class="[
              'flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-colors',
              step === 2 ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-muted text-muted-foreground',
            ]"
          >
            2
          </div>
          <Text
              as="span"
              size="xs"
              weight="bold"
              :color="step === 2 ? 'primary' : 'muted'"
              class="uppercase tracking-widest"
          >
            Confirm
          </Text>
        </div>
      </div>

      <!-- Step 1 -->
      <Card
          v-if="step === 1"
          class="overflow-hidden"
      >
        <!-- Amount input -->
        <div class="flex flex-col items-center border-b border-primary/10 bg-primary/5 px-8 pb-10 pt-12">
          <Label class="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            Transfer amount
          </Label>

          <div class="flex items-center justify-center text-primary">
            <span class="mr-2 text-4xl font-light opacity-60">
              €
            </span>

            <input
                v-model="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                class="w-full max-w-xs border-0 bg-transparent text-center text-5xl font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                autofocus
            />
          </div>
        </div>

        <CardContent class="space-y-6 p-6 md:p-8">
          <!-- From customer -->
          <div class="rounded-3xl border border-border bg-muted/30 p-4">
            <Label class="mb-3 ml-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              From customer checking account
            </Label>

            <div class="space-y-4">
              <div class="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <input
                    v-model="fromFirstName"
                    placeholder="First Name"
                    class="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm font-medium outline-none placeholder:text-muted-foreground"
                />

                <input
                    v-model="fromLastName"
                    placeholder="Last Name"
                    class="min-w-0 flex-1 border-l border-border bg-transparent px-4 py-4 text-sm font-medium outline-none placeholder:text-muted-foreground"
                />

                <button
                    type="button"
                    class="flex items-center gap-2 bg-muted px-6 py-4 text-sm font-bold text-primary transition-colors hover:bg-muted/80 disabled:opacity-50"
                    :disabled="searchingFrom || !fromFirstName || !fromLastName"
                    @click="searchAccounts('from')"
                >
                  <Search class="h-4 w-4" />
                  {{ searchingFrom ? 'Searching' : 'Search' }}
                </button>
              </div>

              <div class="flex gap-3">
                <Input
                    v-model="fromManualIban"
                    placeholder="Or enter source checking IBAN manually"
                    class="h-14 rounded-2xl font-mono tracking-wider"
                />

                <Button
                    variant="secondary"
                    class="h-14 rounded-2xl font-bold"
                    :disabled="searchingFrom || !fromManualIban"
                    @click="findAccountByIban('from')"
                >
                  Find
                </Button>
              </div>

              <div
                  v-if="fromAccount"
                  class="rounded-2xl border border-primary bg-primary/5 p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-semibold">
                      {{ getCustomerName(fromAccount) }}
                    </p>
                    <p class="mt-1 font-mono text-sm text-muted-foreground">
                      {{ fromAccount.iban }}
                    </p>
                  </div>

                  <div class="text-right text-sm text-muted-foreground">
                    <p class="font-semibold text-foreground">
                      {{ formatAccountType(fromAccount.accountType) }}
                    </p>
                    <p>{{ formatCurrency(fromAccount.balance) }}</p>
                  </div>
                </div>
              </div>

              <div
                  v-if="fromResults.length > 0"
                  class="space-y-2"
              >
                <p class="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Select source account
                </p>

                <div
                    v-for="account in fromResults"
                    :key="account.iban"
                    :class="[
                    'cursor-pointer rounded-2xl border p-4 transition-colors',
                    fromAccount?.iban === account.iban ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50',
                  ]"
                    @click="selectFromAccount(account)"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold">
                        {{ getCustomerName(account) }}
                      </p>
                      <p class="mt-1 font-mono text-sm text-muted-foreground">
                        {{ account.iban }}
                      </p>
                    </div>

                    <div class="text-right text-sm text-muted-foreground">
                      <p class="font-semibold text-foreground">
                        {{ formatAccountType(account.accountType) }}
                      </p>
                      <p>{{ formatCurrency(account.balance) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- To customer -->
          <div class="rounded-3xl border border-border bg-muted/30 p-4">
            <Label class="mb-3 ml-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              To customer account
            </Label>

            <div class="space-y-4">
              <div class="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <input
                    v-model="toFirstName"
                    placeholder="First Name"
                    class="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm font-medium outline-none placeholder:text-muted-foreground"
                />

                <input
                    v-model="toLastName"
                    placeholder="Last Name"
                    class="min-w-0 flex-1 border-l border-border bg-transparent px-4 py-4 text-sm font-medium outline-none placeholder:text-muted-foreground"
                />

                <button
                    type="button"
                    class="flex items-center gap-2 bg-muted px-6 py-4 text-sm font-bold text-primary transition-colors hover:bg-muted/80 disabled:opacity-50"
                    :disabled="searchingTo || !toFirstName || !toLastName"
                    @click="searchAccounts('to')"
                >
                  <Search class="h-4 w-4" />
                  {{ searchingTo ? 'Searching' : 'Search' }}
                </button>
              </div>

              <div class="flex gap-3">
                <Input
                    v-model="toManualIban"
                    placeholder="Or enter destination IBAN manually"
                    class="h-14 rounded-2xl font-mono tracking-wider"
                />

                <Button
                    variant="secondary"
                    class="h-14 rounded-2xl font-bold"
                    :disabled="searchingTo || !toManualIban"
                    @click="findAccountByIban('to')"
                >
                  Find
                </Button>
              </div>

              <div
                  v-if="toAccount"
                  class="rounded-2xl border border-primary bg-primary/5 p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-semibold">
                      {{ getCustomerName(toAccount) }}
                    </p>
                    <p class="mt-1 font-mono text-sm text-muted-foreground">
                      {{ toAccount.iban }}
                    </p>
                  </div>

                  <div class="text-right text-sm text-muted-foreground">
                    <p class="font-semibold text-foreground">
                      {{ formatAccountType(toAccount.accountType) }}
                    </p>
                    <p>{{ formatCurrency(toAccount.balance) }}</p>
                  </div>
                </div>
              </div>

              <div
                  v-if="toResults.length > 0"
                  class="space-y-2"
              >
                <p class="ml-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Select destination account
                </p>

                <div
                    v-for="account in toResults"
                    :key="account.iban"
                    :class="[
                    'rounded-2xl border p-4 transition-colors',
                    account.iban === fromAccount?.iban
                      ? 'cursor-not-allowed border-border bg-muted/30 opacity-50'
                      : toAccount?.iban === account.iban
                        ? 'cursor-pointer border-primary bg-primary/5'
                        : 'cursor-pointer border-border bg-muted/30 hover:border-primary/50',
                  ]"
                    @click="account.iban !== fromAccount?.iban && selectToAccount(account)"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold">
                        {{ getCustomerName(account) }}
                      </p>
                      <p class="mt-1 font-mono text-sm text-muted-foreground">
                        {{ account.iban }}
                      </p>
                    </div>

                    <div class="text-right text-sm text-muted-foreground">
                      <p class="font-semibold text-foreground">
                        {{ formatAccountType(account.accountType) }}
                      </p>
                      <p>{{ formatCurrency(account.balance) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="rounded-2xl border border-border bg-card p-1 shadow-sm">
            <input
                v-model="description"
                placeholder="What's this for? Optional description"
                class="h-14 w-full bg-transparent px-5 font-medium outline-none placeholder:text-muted-foreground"
            />
          </div>

          <Button
              class="h-16 w-full rounded-2xl text-lg font-bold"
              :disabled="!canReview"
              @click="handleNext"
          >
            Review Transfer
            <ArrowRight class="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <!-- Step 2 -->
      <Card
          v-if="step === 2"
          class="overflow-hidden"
      >
        <div class="flex flex-col items-center border-b border-primary/10 bg-primary/5 px-8 pb-10 pt-12">
          <Label class="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
            You are sending
          </Label>

          <div class="flex items-center justify-center">
            <span class="mr-2 text-4xl font-light opacity-60">
              €
            </span>
            <span class="text-5xl font-semibold tracking-tight text-foreground">
              {{ Number(amount || 0).toFixed(2) }}
            </span>
          </div>
        </div>

        <CardContent class="space-y-6 p-6 md:p-8">
          <div class="space-y-4">
            <div class="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4">
              <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                From
              </span>

              <div class="text-right">
                <p class="text-lg font-semibold">
                  {{ getCustomerName(fromAccount) }}
                </p>
                <p class="mt-1 font-mono text-sm text-muted-foreground">
                  {{ fromAccount?.iban }}
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  {{ formatAccountType(fromAccount?.accountType) }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4">
              <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                To
              </span>

              <div class="text-right">
                <p class="text-lg font-semibold">
                  {{ getCustomerName(toAccount) }}
                </p>
                <p class="mt-1 font-mono text-sm text-muted-foreground">
                  {{ toAccount?.iban }}
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  {{ formatAccountType(toAccount?.accountType) }}
                </p>
              </div>
            </div>

            <div
                v-if="description"
                class="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4"
            >
              <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                For
              </span>

              <p class="font-semibold">
                {{ description }}
              </p>
            </div>
          </div>

          <div
              v-if="transactionsStore.error"
              class="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-semibold text-destructive"
          >
            <AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{{ transactionsStore.error }}</span>
          </div>

          <div class="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row">
            <Button
                variant="outline"
                class="h-16 flex-1 rounded-2xl text-base font-bold"
                :disabled="transactionsStore.loading"
                @click="step = 1"
            >
              <ArrowLeft class="mr-2 h-5 w-5" />
              Edit Details
            </Button>

            <Button
                class="h-16 flex-1 rounded-2xl bg-success text-base font-bold text-success-foreground hover:bg-success/90"
                :disabled="!canSubmit"
                @click="handleSubmit"
            >
              <CheckCircle class="mr-2 h-5 w-5" />
              {{ transactionsStore.loading ? 'Sending...' : 'Confirm & Send' }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>