<script setup>
const props = defineProps({
  error: {
    type: [Object, String],
    default: () => null
  }
})
</script>

<template>
  <div v-if="props.error" class="text-red-500 text-sm">
    <p>{{ props.error?.message ?? props.error }}</p>
    <ul v-if="props.error.errors">
      <li v-for="(error, index) in props.error.errors" :key="index">{{ error.field }}: {{ error.message }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>