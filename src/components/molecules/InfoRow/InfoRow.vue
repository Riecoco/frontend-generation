<template>
  <div class="inline-flex items-center gap-2">
    <Text
        as="span"
        size="sm"
        weight="semibold"
        color="muted"
    >
      {{ label }}:
    </Text>

    <Text
        as="span"
        size="sm"
        weight="medium"
        color="muted"
    >
      {{ value }}
    </Text>
  </div>
</template>

<script setup>
import { Text } from '../../atoms'

defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
})
</script>