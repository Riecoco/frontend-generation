<script setup>
import AccountRow from "@/components/organisms/AccountRow/AccountRow.vue";

defineProps({
  accounts: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <table class="w-full border-collapse">
    <thead>
    <tr class="bg-gray-100 text-left">
      <th class="px-4 py-3 text-sm font-semibold text-gray-700">Account Type</th>
      <th class="px-4 py-3 text-sm font-semibold text-gray-700">IBAN</th>
      <th class="px-4 py-3 text-sm font-semibold text-gray-700">Balance</th>
    </tr>
    </thead>
    <tbody>
    <AccountRow v-for="account in accounts" :key="account.iban" :account="account" />
    </tbody>
  </table>
</template>

<style scoped>

</style>