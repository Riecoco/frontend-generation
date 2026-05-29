<template>
  <span :class="classes">
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'secondary', 'success', 'warning', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
});

const classes = computed(() => {
  const baseClasses =
      'inline-flex items-center justify-center gap-1.5 rounded-full border font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0';

  const variantClasses = {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-green-100/50 text-green-700 border-green-200',
    warning: 'bg-yellow-100/50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100/50 text-red-700 border-red-200',
  };
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1.5 text-xs',
    large: 'px-4 py-2 text-sm',
  };

  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`;
});
</script>
