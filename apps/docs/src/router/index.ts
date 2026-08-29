import { createRouter, createWebHistory } from 'vue-router'
import DocsLayout from '@/layouts/DocsLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import ComponentPage from '@/pages/ComponentPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomePage
    },
    {
      path: '/components',
      component: DocsLayout,
      redirect: '/components/button',
      children: [
        {
          path: ':name',
          component: ComponentPage,
          props: true
        }
      ]
    }
  ],
  scrollBehavior: () => ({ top: 0 })
})

export default router
