<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
    <InputField id="startDate" v-model="filters.startDate" label="From" type="date" />
    <InputField id="endDate" v-model="filters.endDate" label="Until" type="date" />
    <InputField id="amountLt" v-model="filters.amountLt" label="Amount <" type="number" />
    <InputField id="amountGt" v-model="filters.amountGt" label="Amount >" type="number" />
    <InputField id="amountEq" v-model="filters.amountEq" label="Amount =" type="number" />
    <InputField id="iban" v-model="filters.iban" label="IBAN" />
    <Button @click="applyFilters" label="Apply Filters" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { InputField } from '@/components/molecules'
import { Button } from '@/components/atoms'

const filters = ref({
  startDate: '',
  endDate: '',
  amountLt: '',
  amountGt: '',
  amountEq: '',
  iban: ''
})

const emit = defineEmits(['apply'])
const applyFilters = () => {
  emit('apply', { ...filters.value })
}
</script>
