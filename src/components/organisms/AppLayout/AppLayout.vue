<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar
        :user-name="userName"
        :user-role="userRole"
        :items="items"
        :active-key="activeKey"
        @select="$emit('select', $event)"
        @logout="$emit('logout')"
    />

    <main class="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../Sidebar/Sidebar.vue'

defineProps({
  userName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  activeKey: {
    type: String,
    required: true,
  },
})

defineEmits(['select', 'logout'])
</script>