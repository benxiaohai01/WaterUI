import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/HomePage.vue')
    },
    {
      path: '/components',
      component: () => import('@/layouts/DocsLayout.vue'),
      redirect: '/components/button',
      children: [
        {
          path: ':name',
          component: () => import('@/pages/ComponentPage.vue'),
          props: true
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior: () => ({ top: 0 })
})

export default router
