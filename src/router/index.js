import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/pages/LoginPage/LoginPage.vue'
import RegisterPage from "@/components/pages/RegisterPage/RegisterPage.vue";
import ATMPage from '../components/pages/ATMPage/ATMPage.vue'
import CustomerDetail from '../components/pages/CustomerDetails/CustomerDetail.vue'

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
    },
    {
      path: '/atm',
      name: 'atm',
      component: ATMPage
    },
    {
      path: '/employee/customers/:id',
      name: 'employee-customer-detail',
      component: CustomerDetail
    }
  ]
})

export default router
