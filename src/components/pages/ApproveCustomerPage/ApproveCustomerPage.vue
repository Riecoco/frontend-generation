<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowLeftRight, Clock, List, Settings, User, Users, } from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import { useUsersStore } from '../../../stores/users.js'
import { AppLayout } from '../../organisms'
import { Button, Heading, Input, Label, Text } from '../../atoms'
import { Card } from '../../molecules'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const checkingAbsoluteLimit = ref(-500) // can be negative
const checkingDailyLimit = ref(5000)
const savingsAbsoluteLimit = ref(0)
const savingsDailyLimit = ref(10000)

const isSubmitting = ref(false)
const submitError = ref('')

const employeeName = computed(() => {
  return [authStore.user?.firstName, authStore.user?.lastName]
      .filter(Boolean)
      .join(' ') || 'Employee'
})

const customerId = computed(() => Number(route.params.id))

const customer = computed(() => {
  return usersStore.users.find((user) => {
    const id = user?.id ?? user?.userId ?? user?.customerId
    return Number(id) === customerId.value
  }) || {}
})

const fullName = computed(() => {
  return [customer.value.firstName, customer.value.lastName]
      .filter(Boolean)
      .join(' ') || 'Unknown customer'
})

const navItems = [
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'pending', label: 'Pending Approvals', icon: Clock },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'transactions', label: 'All Transactions', icon: List },
]

onMounted(async () => {
  if (!usersStore.users.length) {
    await usersStore.fetchPendingUsers()
  }
})

async function approveCustomer() {
  if (!customerId.value) {
    submitError.value = 'Customer id is missing.'
    return
  }

  submitError.value = ''
  isSubmitting.value = true

  const accountLimits = [
    {
      accountType: 'CHECKING',
      absoluteLimit: Number(checkingAbsoluteLimit.value),
      dailyLimit: Number(checkingDailyLimit.value),
    },
    {
      accountType: 'SAVINGS',
      absoluteLimit: Number(savingsAbsoluteLimit.value),
      dailyLimit: Number(savingsDailyLimit.value),
    },
  ]

  try {
    await usersStore.approveUser(customerId.value, accountLimits)
    await router.push('/employee/pending')
  } catch (error) {
    submitError.value =
        error?.response?.data?.message ||
        error?.message ||
        'Could not approve customer.'
  } finally {
    isSubmitting.value = false
  }
}

function handleNavigation(key) {
  const routes = {
    customers: '/employee/customers',
    pending: '/employee/pending',
    transfer: '/employee/transfer',
    transactions: '/employee/transactions',
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
</script>

<template>
  <AppLayout
      :user-name="employeeName"
      user-role="Employee"
      :items="navItems"
      active-key="pending"
      @select="handleNavigation"
      @logout="handleLogout"
  >
    <div class="mx-auto max-w-5xl py-10">
      <header class="mb-8 flex items-start gap-4">
        <Button
            variant="outline"
            size="icon"
            class="rounded-2xl"
            @click="router.push('/employee/pending')"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>

        <div>
          <Heading level="1" class="text-4xl">
            Approve Customer
          </Heading>

          <Text color="muted" class="mt-2 text-lg">
            Review application and create accounts
          </Text>
        </div>
      </header>

      <Card class="overflow-hidden rounded-[2rem]">
        <section class="border-b border-border bg-card p-8 text-center">
          <div class="mb-3 flex items-center justify-center gap-2 text-primary">
            <User class="h-5 w-5" />

            <Text
                size="sm"
                weight="bold"
                color="primary"
                class="uppercase tracking-widest"
            >
              Application
            </Text>
          </div>

          <Heading level="2">
            Customer Information
          </Heading>
        </section>

        <section class="grid gap-4 p-8 md:grid-cols-2">
          <div class="rounded-3xl border border-border bg-background p-5">
            <Text
                size="xs"
                weight="bold"
                color="muted"
                class="uppercase tracking-widest"
            >
              Full Name
            </Text>

            <Text weight="semibold" class="mt-2">
              {{ fullName }}
            </Text>
          </div>

          <div class="rounded-3xl border border-border bg-background p-5">
            <Text
                size="xs"
                weight="bold"
                color="muted"
                class="uppercase tracking-widest"
            >
              Email
            </Text>

            <Text weight="semibold" class="mt-2">
              {{ customer.email || '—' }}
            </Text>
          </div>

          <div class="rounded-3xl border border-border bg-background p-5">
            <Text
                size="xs"
                weight="bold"
                color="muted"
                class="uppercase tracking-widest"
            >
              Phone
            </Text>

            <Text weight="semibold" class="mt-2">
              {{ customer.phoneNumber || customer.phone || '—' }}
            </Text>
          </div>

          <div class="rounded-3xl border border-border bg-background p-5">
            <Text
                size="xs"
                weight="bold"
                color="muted"
                class="uppercase tracking-widest"
            >
              BSN Number
            </Text>

            <Text weight="semibold" class="mt-2">
              {{ customer.bsnNumber || customer.bsn || '—' }}
            </Text>
          </div>

          <div class="rounded-3xl border border-border bg-background p-5 md:col-span-2">
            <Text
                size="xs"
                weight="bold"
                color="muted"
                class="uppercase tracking-widest"
            >
              Street Address
            </Text>

            <Text weight="semibold" class="mt-2">
              {{ customer.streetAddress || customer.address || '—' }}
            </Text>
          </div>

          <div class="rounded-3xl border border-border bg-background p-5">
            <Text
                size="xs"
                weight="bold"
                color="muted"
                class="uppercase tracking-widest"
            >
              Postal Code
            </Text>

            <Text weight="semibold" class="mt-2">
              {{ customer.postalCode || '—' }}
            </Text>
          </div>

          <div class="rounded-3xl border border-border bg-background p-5">
            <Text
                size="xs"
                weight="bold"
                color="muted"
                class="uppercase tracking-widest"
            >
              City
            </Text>

            <Text weight="semibold" class="mt-2">
              {{ customer.city || '—' }}
            </Text>
          </div>
        </section>
      </Card>

      <Card class="mt-8 overflow-hidden rounded-[2rem]">
        <section class="border-b border-border bg-card p-8 text-center">
          <div class="mb-3 flex items-center justify-center gap-2 text-primary">
            <Settings class="h-5 w-5" />

            <Text
                size="sm"
                weight="bold"
                color="primary"
                class="uppercase tracking-widest"
            >
              Configuration
            </Text>
          </div>

          <Heading level="2">
            Account Setup
          </Heading>
        </section>

        <section class="space-y-6 p-8">
          <div class="rounded-3xl border border-orange-200 bg-orange-50/40 p-6">
            <Text
                size="sm"
                weight="bold"
                class="mb-4 uppercase tracking-widest text-orange-700"
            >
              Checking account limits
            </Text>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label label="Absolute Limit (€)" />

                <Input
                    v-model="checkingAbsoluteLimit"
                    type="number"
                />
              </div>

              <div class="space-y-2">
                <Label label="Daily Transfer Limit (€)" />

                <Input
                    v-model="checkingDailyLimit"
                    type="number"
                    min="0"
                />
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-green-200 bg-green-50/40 p-6">
            <Text
                size="sm"
                weight="bold"
                class="mb-4 uppercase tracking-widest text-green-700"
            >
              Savings account limits
            </Text>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label label="Absolute Limit (€)" />

                <Input
                    v-model="savingsAbsoluteLimit"
                    type="number"
                />
              </div>

              <div class="space-y-2">
                <Label label="Daily Transfer Limit (€)" />

                <Input
                    v-model="savingsDailyLimit"
                    type="number"
                    min="0"
                />
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
            <Text class="text-blue-700">
              IBANs will be automatically generated for both accounts upon approval.
            </Text>
          </div>

          <div class="rounded-3xl border border-border bg-muted/20 p-6">
            <Text
                size="sm"
                weight="bold"
                color="primary"
                class="mb-4 text-center uppercase tracking-widest"
            >
              Approval Summary
            </Text>

            <div class="space-y-3">
              <div class="flex justify-between rounded-2xl bg-background p-4">
                <Text color="muted">Customer</Text>
                <Text weight="bold">{{ fullName }}</Text>
              </div>

              <div class="flex justify-between rounded-2xl bg-background p-4">
                <Text color="muted">Checking Absolute Limit</Text>
                <Text weight="bold">€ {{ checkingAbsoluteLimit }}</Text>
              </div>

              <div class="flex justify-between rounded-2xl bg-background p-4">
                <Text color="muted">Checking Daily Transfer</Text>
                <Text weight="bold">€ {{ checkingDailyLimit }} / day</Text>
              </div>

              <div class="flex justify-between rounded-2xl bg-background p-4">
                <Text color="muted">Savings Absolute Limit</Text>
                <Text weight="bold">€ {{ savingsAbsoluteLimit }}</Text>
              </div>

              <div class="flex justify-between rounded-2xl bg-background p-4">
                <Text color="muted">Savings Daily Transfer</Text>
                <Text weight="bold">€ {{ savingsDailyLimit }} / day</Text>
              </div>
            </div>
          </div>

          <!-- reject button is disabled -->
          <div class="flex gap-4 pt-4">
            <Button
                variant="outline"
                class="flex-1 rounded-2xl border-red-200 text-red-600"
                disabled
            >
              Reject Application
            </Button>

            <Button
                primary
                class="flex-1 rounded-2xl bg-green-600 hover:bg-green-700"
                :disabled="isSubmitting"
                @click="approveCustomer"
            >
              {{ isSubmitting ? 'Approving...' : 'Approve & Create Accounts' }}
            </Button>
          </div>

          <Text
              v-if="submitError"
              class="pt-2 text-center text-destructive"
          >
            {{ submitError }}
          </Text>
        </section>
      </Card>
    </div>
  </AppLayout>
</template>