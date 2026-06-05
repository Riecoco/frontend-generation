<template>
  <span :class="badgeClasses">
    <component
        :is="statusConfig.icon"
        class="h-4 w-4"
    />

    {{ statusConfig.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle, Clock, X } from '@lucide/vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const normalizedStatus = computed(() => props.status.toLowerCase())

const statusConfig = computed(() => {
  const configs = {
    active: {
      label: 'Active',
      icon: CheckCircle,
      classes: 'border-success/20 bg-success/10 text-success',
    },
    inactive: {
      label: 'Inactive',
      icon: Clock,
      classes: 'border-muted-foreground/20 bg-muted text-muted-foreground',
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle,
      classes: 'border-success/20 bg-success/10 text-success',
    },
    closed: {
      label: 'Closed',
      icon: X,
      classes: 'border-destructive/20 bg-destructive/10 text-destructive',
    },
    denied: {
      label: 'Denied',
      icon: X,
      classes: 'border-destructive/20 bg-destructive/10 text-destructive',
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      classes: 'border-primary/20 bg-primary/10 text-primary',
    },
    frozen: {
      label: 'Frozen',
      icon: Clock,
      classes: 'border-primary/20 bg-primary/10 text-primary',
    },
  }

  return configs[normalizedStatus.value] || configs.pending
})

const badgeClasses = computed(() => {
  const baseClasses =
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold'

  return `${baseClasses} ${statusConfig.value.classes}`
})
</script>
