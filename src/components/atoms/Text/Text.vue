<template>
  <component
      :is="tag"
      :class="classes"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  as: {
    type: String,
    default: 'p',
    validator: (value) => ['p', 'span', 'div', 'label'].includes(value),
  },
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['xs', 'sm', 'base', 'lg'].includes(value),
  },
  weight: {
    type: String,
    default: 'normal',
    validator: (value) =>
        ['normal', 'medium', 'semibold', 'bold'].includes(value),
  },
  color: {
    type: String,
    default: 'default',
    validator: (value) =>
        ['default', 'muted', 'primary', 'secondary', 'destructive', 'success'].includes(value),
  },
})

const tag = computed(() => props.as)

const classes = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  }

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colors = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    destructive: 'text-destructive',
    success: 'text-success',
  }

  return `${sizes[props.size]} ${weights[props.weight]} ${colors[props.color]}`
})
</script>