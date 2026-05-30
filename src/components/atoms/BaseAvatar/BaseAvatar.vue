<template>
  <div :class="avatarClasses">
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

const initials = computed(() => {
  const value = props.name.trim()

  if (!value) {
    return '?'
  }

  return value
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
})

const avatarClasses = computed(() => {
  const baseClasses =
      'inline-flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary'

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return `${baseClasses} ${sizeClasses[props.size]}`
})
</script>