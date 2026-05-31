<template>
  <div class="mb-8 flex items-center justify-center gap-4">
    <template
        v-for="(label, index) in steps"
        :key="label"
    >
      <div
          :class="[
          'flex flex-col items-center gap-2',
          currentStep === index + 1 ? 'text-primary' : 'text-muted-foreground',
        ]"
      >
        <div
            :class="[
            'flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-colors',
            currentStep === index + 1
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'bg-muted text-muted-foreground',
          ]"
        >
          {{ index + 1 }}
        </div>

        <Text
            as="span"
            size="xs"
            weight="bold"
            :color="currentStep === index + 1 ? 'primary' : 'muted'"
            class="uppercase tracking-widest"
        >
          {{ label }}
        </Text>
      </div>

      <div
          v-if="index < steps.length - 1"
          class="-mt-5 h-0.5 w-16 bg-sidebar-border"
      />
    </template>
  </div>
</template>

<script setup>
import { Text } from '../../atoms'

defineProps({
  steps: {
    type: Array,
    default: () => ['Details', 'Confirm'],
  },
  currentStep: {
    type: Number,
    default: 1,
  },
})
</script>