<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead>
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IBAN</th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="t in transactions" :key="t.id">
        <td class="px-6 py-4 whitespace-nowrap">{{ t.timestamp }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ t.description }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ t.amount }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ t.transactionType }}</td>
        <td class="px-6 py-4 whitespace-nowrap">{{ t.toAccountIban || t.fromAccountIban }}</td>
      </tr>
      </tbody>
    </table>
    <div class="flex justify-between items-center p-4">
      <Button @click="$emit('prev-page')" label="Previous" :disabled="page === 0" />
      <span>Page {{ page + 1 }}</span>
      <Button @click="$emit('next-page')" label="Next" />
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/atoms'

defineProps({
  transactions: { type: Array, required: true },
  page: { type: Number, required: true }
})
defineEmits(['prev-page', 'next-page'])
</script>
