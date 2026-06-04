import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/pages/LoginPage/LoginPage.vue'
import RegisterPage from "@/components/pages/RegisterPage/RegisterPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    }
  ]
})

export default router
