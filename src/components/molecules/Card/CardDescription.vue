<template>
  <Text
      as="p"
      size="sm"
      color="muted"
  >
    <slot />
  </Text>
</template>

<script setup>
import { Text } from '../../atoms'
</script>