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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Join CloudBank today</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm @register-success="onRegisterSuccess" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../molecules'
import RegisterForm from '../../organisms/RegisterForm/RegisterForm.vue'
import { Cloud } from '@lucide/vue'

const router = useRouter()

function onRegisterSuccess() {
  router.push('/login')
}
</script>
