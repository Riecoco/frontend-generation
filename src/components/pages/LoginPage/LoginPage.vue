<template>
  <div class="relative min-h-screen bg-background overflow-hidden flex items-center justify-center p-4">
    <!-- Background special effects -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-white rounded-full filter blur-[120px] opacity-60"></div>

    <Card class="w-full max-w-md relative z-10 border-white/40 shadow-xl bg-card/80 backdrop-blur-xl">
      <CardHeader>
        <div class="flex justify-center mb-4">
          <div class="bg-primary p-3 rounded-2xl shadow-sm">
            <Cloud class="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle>Welcome to CloudBank</CardTitle>
        <CardDescription>Sign in to access your account</CardDescription>
      </CardHeader>

      <CardContent>
        <div class="space-y-5">
          <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="your.email@example.nl"
              v-model="email"
          />

          <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              v-model="password"
              :error-message="authStore.error || ''"
          />

          <Button class="w-full h-12 text-base mt-2" @click="handleLogin" :disabled="authStore.loading">
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </div>

        <!-- Demo credentials -->
        <div class="mt-6 pt-6 border-t border-border/60">
          <p class="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wider font-semibold">
            Demo credentials
          </p>
          <div class="text-xs text-muted-foreground space-y-1 bg-white/40 p-3 rounded-lg">
            <p class="font-mono">Customer: customer@test.com</p>
            <p class="font-mono">Employee: employee@test.com</p>
            <p class="font-mono">Password: password123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Cloud } from '@lucide/vue'
import { useAuthStore } from '../../../stores/auth.js'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../molecules'
import { Button } from '../../atoms'
import { InputField } from '../../molecules'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  await authStore.login(email.value, password.value)

  if (authStore.isLoggedIn) {
    if (authStore.isEmployee) {
      router.push('/dashboard/employee')
    } else {
      router.push('/dashboard/customer')
    }
  }
}
</script>