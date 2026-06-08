<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <InputField id="firstName" label="First Name" v-model="firstName" />
      <InputField id="lastName" label="Last Name" v-model="lastName" />
    </div>

    <InputField id="email" label="Email" type="email" v-model="email" />
    <InputField id="password" label="Password" type="password" v-model="password" />

    <div class="grid grid-cols-2 gap-4">
      <InputField id="addressLine" label="Address" v-model="addressLine" />
      <InputField id="postalCode" label="Postal Code" v-model="postalCode" />
      <InputField id="city" label="City" v-model="city" />
      <InputField id="country" label="Country" v-model="country" />
    </div>

    <InputField id="bsnNumber" label="BSN Number" v-model="bsnNumber" />
    <InputField id="birthdate" label="Birthdate (YYYY-MM-DD)" v-model="birthdate" />
    <InputField id="phoneNumber" label="Phone Number" type="tel" v-model="phoneNumber" />

    <p v-if="localError" class="text-red-500 text-sm">{{ localError }}</p>
    <server-error-display :error="authStore.error"></server-error-display>
    <Button class="w-full h-12 text-base mt-2" @click="handleRegister" :disabled="authStore.loading">
      {{ authStore.loading ? 'Creating account...' : 'Sign Up' }}
    </Button>
  </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import { useAuthStore } from '../../../stores/auth.js'
import { Button } from '../../atoms'
import { InputField } from '../../molecules'
import ServerErrorDisplay from "../../molecules/ServerErrorDisplay/ServerErrorDisplay.vue";

const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const addressLine = ref('')
const postalCode = ref('')
const city = ref('')
const country = ref('')
const bsnNumber = ref('')
const birthdate = ref('')
const phoneNumber = ref('')

const localError = ref('')

const emit = defineEmits(['register-success'])

onMounted(() => {
  authStore.error = null
})

async function handleRegister() {
  if (!firstName.value || !lastName.value || !email.value || !password.value || 
      !addressLine.value || !postalCode.value || !city.value || !country.value || 
      !bsnNumber.value || !birthdate.value || !phoneNumber.value) {
    localError.value = 'All fields are required'
    return
  }
  
  localError.value = ''

  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      address: {
        addressLine: addressLine.value,
        postalCode: postalCode.value,
        city: city.value,
        country: country.value
      },
      bsnNumber: bsnNumber.value,
      birthdate: birthdate.value,
      phoneNumber: phoneNumber.value
    })
    emit('register-success')
  } catch (err) {
    // Error is handled by authStore
  }
}
</script>
