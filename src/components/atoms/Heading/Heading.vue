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
  level: {
    type: Number,
    default: 1,
    validator: (value) => [1, 2, 3, 4, 5, 6].includes(value),
  },
  size: {
    type: String,
    default: 'auto',
    validator: (value) =>
        ['auto', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(value),
  },
  weight: {
    type: String,
    default: 'auto',
    validator: (value) =>
        ['auto', 'medium', 'semibold', 'bold'].includes(value),
  },
  color: {
    type: String,
    default: 'default',
    validator: (value) =>
        ['default', 'muted', 'primary', 'secondary'].includes(value),
  },
})

const tag = computed(() => `h${props.level}`)

const classes = computed(() => {
  const defaultSizes = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm',
  }

  const sizes = {
    auto: defaultSizes[props.level],
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }

  const defaultWeights = {
    1: 'font-bold',
    2: 'font-bold',
    3: 'font-semibold',
    4: 'font-semibold',
    5: 'font-medium',
    6: 'font-medium',
  }

  const weights = {
    auto: defaultWeights[props.level],
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colors = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
  }

  return [
    sizes[props.size],
    weights[props.weight],
    colors[props.color],
    'tracking-tight',
  ].join(' ')
})
</script>