<template>
  <Heading
      :level="3"
      size="lg"
      weight="semibold"
      class="leading-none text-card-foreground"
  >
    <slot />
  </Heading>
</template>

<script setup>
import { Heading } from '../../atoms'
</script>