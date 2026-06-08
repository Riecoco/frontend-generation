<template>
  <AppLayout
      :user-name="authStore.displayName"
      user-role="Customer"
      :items="navItems"
      active-key="transfer"
      @select="handleSelect"
      @logout="handleLogout"
  >
    <div class="max-w-2xl mx-auto w-full space-y-8 py-8">

      <Card v-if="accounts.length === 0">
        <CardContent class="pt-12">
          <div class="text-center py-12">
            <div class="flex justify-center mb-4">
              <div class="bg-destructive/10 p-6 rounded-full">
                <AlertCircle class="h-12 w-12 text-destructive" />
              </div>
            </div>
            <h3 class="text-2xl font-bold mb-2">No Active Accounts</h3>
            <p class="text-muted-foreground mb-8">You need at least one active account to make transfers.</p>
          </div>
        </CardContent>
      </Card>

      <template v-else>
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-3xl font-bold tracking-tight">Send Money</h1>
          <p class="text-muted-foreground mt-2">Quick and secure transfers.</p>
        </div>

        <!-- Step 1 -->
        <Card v-if="step === 1" class="overflow-hidden">
          <!-- Amount input -->
          <div class="bg-primary/5 px-8 pt-12 pb-10 flex flex-col items-center border-b border-primary/10">
            <Label label="How much?" class="text-sm font-bold text-primary uppercase tracking-wider mb-4" />
            <div class="flex items-center justify-center text-primary">
              <span class="text-4xl font-light mr-2 opacity-60">€</span>
              <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  v-model="amount"
                  class="text-5xl font-semibold bg-transparent border-0 text-center w-full max-w-xs focus:outline-none text-foreground placeholder-muted-foreground"
                  autofocus
              />
            </div>
          </div>

          <CardContent class="p-6 md:p-8 space-y-6">
            <!-- Toggle own/other -->
            <div class="flex justify-center">
              <div class="flex bg-muted p-1 rounded-full">
                <button
                    type="button"
                    @click="transferType = 'own'; toIban = ''; searchResults = []"
                    :class="['py-2 px-6 rounded-full text-sm font-bold transition-all', transferType === 'own' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']"
                >
                  My Accounts
                </button>
                <button
                    type="button"
                    @click="transferType = 'other'; toAccount = ''"
                    :class="['py-2 px-6 rounded-full text-sm font-bold transition-all', transferType === 'other' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']"
                >
                  Someone Else
                </button>
              </div>
            </div>

            <!-- From account -->
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Label label="From" class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block ml-2" />
              <Select v-model="fromAccount">
                <SelectTrigger class="bg-background border-0 shadow-sm h-14 rounded-2xl text-base px-5">
                  <SelectValue placeholder="Select account..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                      v-for="account in transferType === 'other' ? accounts.filter(a => a.accountType === 'CHECKING') : accounts"
                      :key="account.iban"
                      :value="account.iban"
                  >
                    <div class="flex justify-between items-center gap-4">
                      <span class="font-semibold">{{ account.accountType === 'CHECKING' ? 'Checking' : 'Savings' }}</span>
                      <span class="text-muted-foreground">{{ formatCurrency(account.balance) }}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- To account -->
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Label label="To" class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block ml-2" />

              <!-- Own accounts -->
              <Select v-if="transferType === 'own'" v-model="toAccount">
                <SelectTrigger class="bg-background border-0 shadow-sm h-14 rounded-2xl text-base px-5">
                  <SelectValue placeholder="Select destination..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                      v-for="account in accounts.filter(a => a.iban !== fromAccount)"
                      :key="account.iban"
                      :value="account.iban"
                  >
                    <div class="flex justify-between items-center gap-4">
                      <span class="font-semibold">{{ account.accountType === 'CHECKING' ? 'Checking' : 'Savings' }}</span>
                      <span class="text-muted-foreground">{{ formatCurrency(account.balance) }}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <!-- Other person -->
              <div v-else class="space-y-4">
                <div class="bg-card rounded-2xl shadow-sm overflow-hidden flex divide-x border border-border">
                  <input
                      placeholder="First Name"
                      v-model="searchFirstName"
                      class="flex-1 px-4 py-4 outline-none text-sm font-medium placeholder:text-muted-foreground bg-transparent"
                  />
                  <input
                      placeholder="Last Name"
                      v-model="searchLastName"
                      class="flex-1 px-4 py-4 outline-none text-sm font-medium placeholder:text-muted-foreground bg-transparent"
                  />
                  <button
                      type="button"
                      @click="handleSearch"
                      :disabled="!searchFirstName || !searchLastName"
                      class="px-6 py-4 bg-muted hover:bg-muted/80 font-bold text-sm text-primary transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Search class="w-4 h-4" /> Search
                  </button>
                </div>

                <div v-if="searchResults.length > 0" class="space-y-2">
                  <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Select account</p>
                  <div
                      v-for="account in searchResults"
                      :key="account.iban"
                      @click="toIban = account.iban"
                      :class="['p-4 rounded-2xl border cursor-pointer transition-colors', toIban === account.iban ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50']"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-semibold">{{ account.accountType === 'CHECKING' ? 'Checking' : 'Savings' }}</span>
                      <span class="text-sm text-muted-foreground font-mono">{{ account.iban }}</span>
                    </div>
                  </div>
                </div>

                <Input
                    placeholder="Or enter IBAN manually (NL91INHO...)"
                    v-model="toIban"
                    class="h-14 rounded-2xl font-mono text-center tracking-wider"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="bg-card rounded-2xl border border-border shadow-sm p-1">
              <input
                  placeholder="What's this for? (Optional description)"
                  v-model="description"
                  class="w-full h-14 px-5 bg-transparent outline-none font-medium placeholder:text-muted-foreground"
              />
            </div>

            <Button @click="handleNext" :disabled="validating" class="w-full h-16 rounded-2xl text-lg font-bold">
              {{ validating ? 'Validating...' : 'Review Transfer' }}
              <ArrowRight class="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <!-- Step 2 - Confirmation -->
        <Card v-if="step === 2" class="overflow-hidden">
          <div class="bg-primary/5 px-8 pt-12 pb-10 flex flex-col items-center border-b border-primary/10">
            <Label label="You are sending" class="text-sm font-bold text-primary uppercase tracking-wider mb-4" />
            <div class="flex items-center justify-center">
              <span class="text-4xl font-light mr-2 opacity-60">€</span>
              <span class="text-5xl font-semibold text-foreground tracking-tight">{{ parseFloat(amount || '0').toFixed(2) }}</span>
            </div>
          </div>

          <CardContent class="p-6 md:p-8 space-y-6">
            <div class="space-y-4">
              <!-- From -->
              <div class="flex justify-between items-center p-4 bg-muted/30 rounded-2xl border border-border">
                <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs">From</span>
                <div class="text-right">
                  <p class="font-semibold text-lg">{{ selectedFromAccount?.accountType === 'CHECKING' ? 'Checking Account' : 'Savings Account' }}</p>
                  <p class="text-sm text-muted-foreground font-mono mt-1">{{ selectedFromAccount?.iban }}</p>
                </div>
              </div>

              <!-- To -->
              <div class="flex justify-between items-center p-4 bg-muted/30 rounded-2xl border border-border">
                <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs">To</span>
                <div class="text-right">
                  <template v-if="transferType === 'own'">
                    <p class="font-semibold text-lg">{{ selectedToAccount?.accountType === 'CHECKING' ? 'Checking Account' : 'Savings Account' }}</p>
                    <p class="text-sm text-muted-foreground font-mono mt-1">{{ selectedToAccount?.iban }}</p>
                  </template>
                  <p v-else class="font-semibold font-mono text-lg tracking-wider">{{ toIban }}</p>
                </div>
              </div>

              <!-- Description -->
              <div v-if="description" class="flex justify-between items-center p-4 bg-muted/30 rounded-2xl border border-border">
                <span class="text-muted-foreground font-bold uppercase tracking-wider text-xs">For</span>
                <p class="font-semibold">{{ description }}</p>
              </div>
            </div>

            <div class="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
              <Button variant="outline" @click="step = 1" class="flex-1 h-16 rounded-2xl font-bold text-base">
                <ArrowLeft class="h-5 w-5 mr-2" />
                Edit Details
              </Button>
              <Button @click="handleSubmit" class="flex-1 h-16 rounded-2xl font-bold text-base bg-success hover:bg-success/90 text-success-foreground">
                <CheckCircle class="h-5 w-5 mr-2" />
                Confirm & Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ArrowLeft, Search, CheckCircle, AlertCircle, Home, ArrowLeftRight, Wallet, CreditCard, Landmark } from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import { useAccountsStore } from '../../../stores/accounts.js'
import { useTransactionsStore } from '../../../stores/transactions.js'
import { toast } from 'vue-sonner'
import { AppLayout } from '../../organisms'
import { Card, CardContent } from '../../molecules'
import { Button, Input, Label } from '../../atoms'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../molecules'
import apiClient from '../../../utils/axios.js'

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()

const navItems = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'accounts', label: 'Accounts', icon: Wallet },
  { key: 'transactions', label: 'Transactions', icon: CreditCard },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'atm', label: 'ATM', icon: Landmark },
]

const step = ref(1)
const transferType = ref('own')
const fromAccount = ref('')
const toAccount = ref('')
const toIban = ref('')
const amount = ref('')
const description = ref('')
const searchFirstName = ref('')
const searchLastName = ref('')
const searchResults = ref([])
const validating = ref(false)

onMounted(async () => {
  await accountsStore.fetchAccountsByUserId(authStore.user?.id)
})

const accounts = computed(() => accountsStore.accounts)
const selectedFromAccount = computed(() => accounts.value.find(a => a.iban === fromAccount.value))
const selectedToAccount = computed(() => accounts.value.find(a => a.iban === toAccount.value))

const formatCurrency = (value) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value ?? 0)

async function handleSearch() {
  try {
    const response = await apiClient.get('/accounts/search', {
      params: { firstName: searchFirstName.value, lastName: searchLastName.value }
    })
    const results = Array.isArray(response.data) ? response.data : []
    searchResults.value = results.filter(a => a.accountType === 'CHECKING')

    if (searchResults.value.length > 0) {
      toast.success(`Found ${searchResults.value.length} account(s)`)
    } else {
      toast.error('No checking accounts found for this customer')
    }
  } catch {
    searchResults.value = []
    toast.error('Customer not found')
  }
}

// Dutch IBAN format: NL + 2 check digits + INHO + 10 digits
function isValidDutchIban(iban) {
  return /^NL\d{2}INHO\d{10}$/.test(iban.replace(/\s/g, '').toUpperCase())
}

async function handleNext() {
  const parsedAmount = parseFloat(amount.value)

  if (!amount.value || parsedAmount <= 0) {
    toast.error('Please enter a valid amount.')
    return
  }
  if (!fromAccount.value) {
    toast.error('Please select an account to transfer from.')
    return
  }
  if (selectedFromAccount.value && parsedAmount > selectedFromAccount.value.balance) {
    toast.error('Insufficient balance.')
    return
  }
  if (selectedFromAccount.value?.dailyLimit > 0 && parsedAmount > selectedFromAccount.value.dailyLimit) {
    toast.error(`Amount exceeds your daily limit of ${formatCurrency(selectedFromAccount.value.dailyLimit)}`)
    return
  }
  if (transferType.value === 'own' && !toAccount.value) {
    toast.error('Please select a destination account.')
    return
  }
  if (transferType.value === 'other') {
    if (!toIban.value) {
      toast.error('Please enter a recipient IBAN.')
      return
    }

    // Validate IBAN format before hitting the backend
    if (!isValidDutchIban(toIban.value)) {
      toast.error('Invalid IBAN format. Expected format: NL00INHO0000000000')
      return
    }

    // Check that the destination IBAN is a CHECKING account — transfers to SAVINGS are not allowed
    validating.value = true
    try {
      const response = await apiClient.get('/accounts/iban', { params: { iban: toIban.value } })
      const destinationAccount = response.data
      if (destinationAccount?.accountType === 'SAVINGS') {
        toast.error('Transfers to savings accounts are not allowed. Please use a checking account IBAN.')
        return
      }
    } catch {
      toast.error('The destination IBAN could not be found. Please check the account number.')
      return
    } finally {
      validating.value = false
    }
  }

  step.value = 2
}

async function handleSubmit() {
  const toAccountIban = transferType.value === 'own' ? toAccount.value : toIban.value
  const result = await transactionsStore.createTransfer(
      fromAccount.value,
      toAccountIban,
      parseFloat(amount.value),
      description.value
  )

  if (result) {
    toast.success('Transfer completed successfully!', {
      description: `Transferred ${formatCurrency(parseFloat(amount.value))}`
    })
    resetForm()
    await accountsStore.fetchAccountsByUserId(authStore.user?.id)
  } else {
    const err = transactionsStore.error
    const message = typeof err === 'string' ? err : err?.message || 'Transfer failed. Please try again.'
    toast.error(message)
  }
}

function resetForm() {
  step.value = 1
  fromAccount.value = ''
  toAccount.value = ''
  toIban.value = ''
  amount.value = ''
  description.value = ''
  searchFirstName.value = ''
  searchLastName.value = ''
  searchResults.value = []
}

function handleSelect(key) {
  const routes = {
    overview: '/dashboard/customer',
    accounts: '/customer/accounts',
    transactions: '/customer/transactions',
    atm: '/atm',
  }
  if (routes[key]) router.push(routes[key])
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>