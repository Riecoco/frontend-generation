<template>
  <AppLayout
      :user-name="authStore.displayName"
      user-role="Customer"
      :items="navItems"
      active-key="overview"
      @select="handleSelect"
      @logout="handleLogout"
  >
    <div class="max-w-6xl mx-auto space-y-8 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <Heading :level="1">Account Overview</Heading>
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

      <!-- Profile button -->
      <div class="flex justify-center">
        <button
            @click="toggleProfile"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted/50 transition-colors font-medium text-sm"
        >
          <User class="h-4 w-4" />
          See Profile Details
          <ChevronUp v-if="showProfile" class="h-4 w-4" />
          <ChevronDown v-else class="h-4 w-4" />
        </button>
      </div>

      <!-- Profile details -->
      <div v-if="showProfile && profileUser" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Personal Info -->
        <Card class="overflow-hidden">
          <div class="bg-primary/5 px-8 pt-8 pb-6 flex flex-col items-center border-b border-primary/10">
            <div class="flex items-center gap-2 mb-3">
              <User class="h-5 w-5 text-primary" />
              <p class="text-sm font-bold text-primary uppercase tracking-wider">Personal Information</p>
            </div>
          </div>
          <CardContent class="p-8">
            <div class="space-y-4">
              <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Full Name</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.firstName }} {{ profileUser.lastName }}</span>
              </div>
              <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Email</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.email }}</span>
              </div>
              <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Phone Number</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.phoneNumber }}</span>
              </div>
              <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">BSN Number</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.bsnNumber }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Address -->
        <Card class="overflow-hidden">
          <div class="bg-primary/5 px-8 pt-8 pb-6 flex flex-col items-center border-b border-primary/10">
            <div class="flex items-center gap-2 mb-3">
              <User class="h-5 w-5 text-primary" />
              <p class="text-sm font-bold text-primary uppercase tracking-wider">Address</p>
            </div>
          </div>
          <CardContent class="p-8">
            <div class="space-y-4">
              <div v-if="profileUser.address?.addressLine" class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Address</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.address.addressLine }}</span>
              </div>
              <div v-if="profileUser.address?.postalCode" class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Postal Code</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.address.postalCode }}</span>
              </div>
              <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">City</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.address?.city }}</span>
              </div>
              <div class="p-4 bg-muted/30 rounded-3xl border border-border flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Country</span>
                <span class="text-sm font-medium ml-2">{{ profileUser.address?.country }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Home, ArrowLeftRight, Wallet, PiggyBank, User, ChevronDown, ChevronUp, CreditCard, Landmark } from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import { useAccountsStore } from '../../../stores/accounts.js'
import { AppLayout } from '../../organisms'
import { Card, CardContent } from '../../molecules'
import { Heading, Text } from '../../atoms'
import apiClient from '../../../utils/axios.js'

const router = useRouter()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const showProfile = ref(false)
const profileUser = ref(null)

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

const checkingAccount = computed(() => accountsStore.checkingAccount)
const savingsAccount = computed(() => accountsStore.savingsAccount)

const formatCurrency = (amount) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount ?? 0)

async function toggleProfile() {
  showProfile.value = !showProfile.value
  if (showProfile.value && !profileUser.value && authStore.user?.id) {
    const res = await apiClient.get(`/users/${authStore.user.id}`)
    profileUser.value = res.data
  }
}

function handleSelect(key) {
  const routes = {
    accounts: '/customer/accounts',
    transactions: '/customer/my-transactions',
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