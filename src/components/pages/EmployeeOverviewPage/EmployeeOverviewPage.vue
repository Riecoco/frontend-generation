<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftRight,
  Clock,
  List,
  Users,
} from '@lucide/vue'

import { useAuthStore } from '../../../stores/auth.js'
import { useUsersStore } from '../../../stores/users.js'
import { AppLayout, CustomerList } from '../../organisms'
import { Heading, Text } from '../../atoms'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

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
]

onMounted(() => {
  usersStore.fetchAllUsers()
})

function openCustomer(user) {
  const id = user?.id ?? user?.userId ?? user?.customerId

  if (!id) return

  router.push(`/employee/customers/${id}`)
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
      active-key="customers"
      @select="handleNavigation"
      @logout="handleLogout"
  >
    <div class="mx-auto max-w-6xl space-y-8 py-10">
      <header class="text-center">
        <Heading level="1" class="text-4xl">
          Customer Management
        </Heading>

        <Text color="muted" class="mt-2 text-lg">
          View and manage bank customers
        </Text>
      </header>

      <CustomerList
          :users="usersStore.users"
          :loading="usersStore.loading"
          :error="usersStore.error"
          @select="openCustomer"
      />
    </div>
  </AppLayout>
</template>