<template>
  <button
      type="button"
      :class="classes"
      :style="style"
      @click="onClick"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/new-york-v4/lib/utils'
import { buttonVariants } from './buttonVariants'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  primary: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: null,
    validator: (value) =>
        value === null ||
        ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) =>
        ['small', 'medium', 'large', 'default', 'sm', 'lg', 'icon'].includes(value),
  },
  backgroundColor: {
    type: String,
    default: undefined,
  },
  class: {
    type: [String, Object, Array],
    default: undefined,
  },
})

const emit = defineEmits(['click'])

const classes = computed(() => {
  const variant = props.variant || (props.primary ? 'default' : 'outline')

  return cn(
      buttonVariants({
        variant,
        size: props.size,
      }),
      props.class,
  )
})

const style = computed(() => ({
  backgroundColor: props.backgroundColor,
}))

const onClick = () => {
  emit('click')
}
</script>