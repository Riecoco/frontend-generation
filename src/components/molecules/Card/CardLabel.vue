<template>
  <div class="flex items-center gap-2">
    <slot name="icon" />

    <Text
        as="p"
        size="sm"
        weight="bold"
        :class="labelClasses"
    >
      <slot />
    </Text>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Text } from '../../atoms'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success'].includes(value),
  },
})

const labelClasses = computed(() => {
  const baseClasses = 'uppercase tracking-wider'

  const variantClasses = {
    primary: 'text-primary',
    success: 'text-success',
  }

  return `${baseClasses} ${variantClasses[props.variant]}`
})
</script>