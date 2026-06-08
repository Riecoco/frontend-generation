<template>
  <AppLayout
      :user-name="authStore.displayName"
      user-role="Customer"
      :items="navItems"
      active-key="overview"
      @logout="handleLogout"
  >
    <div class="max-w-3xl mx-auto space-y-8 py-8">
      <!-- Welcome -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-foreground tracking-tight">
          Welcome, {{ authStore.user?.firstName }}!
        </h1>
        <Text color="muted" class="mt-2">Your account status</Text>
      </div>

      <!-- Pending card -->
      <Card class="overflow-hidden">
        <CardHeader class="bg-yellow-50/50 flex flex-col items-center border-b border-yellow-100">
          <div class="flex items-center justify-center text-yellow-600 mb-4">
            <Clock class="h-12 w-12" />
          </div>
          <CardTitle>Account Pending Approval</CardTitle>
        </CardHeader>
        <CardContent class="p-8 text-center">
          <Text color="muted">
            Thank you for registering with CloudBank! Your account is currently being reviewed by our team.
            You'll be able to access banking features once your account is approved.
          </Text>
        </CardContent>
      </Card>

      <!-- Profile card -->
      <Card class="overflow-hidden" v-if="userDetails">
        <CardHeader class="flex flex-col items-center border-b border-primary/10">
          <Text size="sm" weight="bold" color="primary" class="uppercase tracking-wider mb-2">Profile</Text>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">Full Name</Text>
              <Text weight="semibold">{{ userDetails.firstName }} {{ userDetails.lastName }}</Text>
            </div>
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">Email</Text>
              <Text weight="semibold">{{ userDetails.email }}</Text>
            </div>
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">Phone</Text>
              <Text weight="semibold">{{ userDetails.phoneNumber }}</Text>
            </div>
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">BSN Number</Text>
              <Text weight="semibold">{{ userDetails.bsnNumber }}</Text>
            </div>
            <div v-if="userDetails.address?.addressLine" class="p-4 bg-muted/30 rounded-3xl border border-border md:col-span-2">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">Street Address</Text>
              <Text weight="semibold">{{ userDetails.address.addressLine }}</Text>
            </div>
            <div v-if="userDetails.address?.postalCode" class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">Postal Code</Text>
              <Text weight="semibold">{{ userDetails.address.postalCode }}</Text>
            </div>
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">City</Text>
              <Text weight="semibold">{{ userDetails.address?.city }}</Text>
            </div>
            <div class="p-4 bg-muted/30 rounded-3xl border border-border">
              <Text size="xs" weight="bold" color="muted" class="uppercase tracking-widest mb-1">Country</Text>
              <Text weight="semibold">{{ userDetails.address?.country }}</Text>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Logout -->
      <Button variant="outline" class="w-full" @click="handleLogout">
        Logout
      </Button>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, Home } from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import apiClient from '../../../utils/axios.js'
import { AppLayout } from '../../organisms'
import { Card, CardHeader, CardContent, CardTitle } from '../../molecules'
import { Button, Text } from '../../atoms'

const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { key: 'overview', label: 'Overview', icon: Home }
]

const userDetails = ref(null)

onMounted(async () => {
  if (!authStore.user?.id) return
  const response = await apiClient.get(`/users/${authStore.user.id}`)
  userDetails.value = response.data
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>