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
import { AppLayout, PendingList } from '../../organisms'
import { Heading, Text } from '../../atoms'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const employeeName = computed(() => {
  return [authStore.user?.firstName, authStore.user?.lastName]
      .filter(Boolean)
      .join(' ') || 'Employee'
})

const pendingUsers = computed(() => {
  return usersStore.users || []
})

const navItems = [
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'pending', label: 'Pending Approvals', icon: Clock },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'transactions', label: 'All Transactions', icon: List },
]

onMounted(() => {
  usersStore.fetchPendingUsers()
})

function getUserId(user) {
  return user?.id ?? user?.userId ?? user?.customerId
}

function reviewApplication(user) {
  const id = getUserId(user)

  if (!id) return

  router.push(`/employee/pending/${id}`)
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
    <div class="mx-auto max-w-6xl py-10">
      <header class="mb-8 text-center">
        <Heading level="1" class="text-4xl">
          Pending Approvals
        </Heading>

        <Text color="muted" class="mt-2 text-lg">
          Review new customer applications
        </Text>
      </header>

      <PendingList
          :users="pendingUsers"
          :loading="usersStore.loading"
          :error="usersStore.error"
          @review="reviewApplication"
      />
    </div>
  </AppLayout>
</template>