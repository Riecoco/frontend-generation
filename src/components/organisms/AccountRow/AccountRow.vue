<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50">
    <td class="px-4 py-3 text-sm font-semibold text-gray-900">{{ account.accountType }}</td>
    <td class="px-4 py-3 text-sm text-gray-600">{{ account.iban }}</td>
    <td class="px-4 py-3 text-xl font-bold text-gray-900">{{ account.balance }} €</td>
  </tr>
</template>

<script setup>
defineProps({
  account: {
    type: Object,
    required: true,
    default: () => ({
      type: 'Checking',
      accountNumber: 'N/A',
      balance: 0,
      currency: 'USD'
    })
  }
})
</script>