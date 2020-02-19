
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Search.vue') },
      { path: 'search', component: () => import('pages/Search.vue') },
      { path: 'record', component: () => import('pages/Record.vue') },
      { path: 'restore', component: () => import('pages/Restore.vue') },
      { path: 'backup', component: () => import('pages/Backup.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
