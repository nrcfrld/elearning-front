export default [
  // *===============================================---*
  // *--------- USER ---- ---------------------------------------*
  // *===============================================---*
  {
    path: '/users/list',
    name: 'users-list',
    component: () => import('@/views/users/Index.vue'),
    meta: {
      pageTitle: 'Users',
      breadcrumb: [
        {
          text: 'Users',
          active: true,
        },
      ],
    },
  },
  {
    path: '/users/edit/:id',
    name: 'users-edit',
    component: () => import('@/views/users/Edit.vue'),
    meta: {
      pageTitle: 'Edit User',
      breadcrumb: [
        {
          text: 'Users',
          to: {
            name: 'users-list',
          },
        },
        {
          text: 'Users Edit',
          active: true,
        },
      ],
    },
  },
  // *===============================================---*
  // *--------- CATEGORY ---- ---------------------------------------*
  // *===============================================---*
  {
    path: '/categories/list',
    name: 'categories-list',
    component: () => import('@/views/categories/Index.vue'),
    meta: {
      pageTitle: 'Categories',
      breadcrumb: [
        {
          text: 'Categories',
          active: true,
        },
      ],
    },
  },
  // *===============================================---*
  // *--------- Orders ---- ---------------------------------------*
  // *===============================================---*
  {
    path: '/orders/list',
    name: 'orders-list',
    component: () => import('@/views/orders/Index.vue'),
    meta: {
      pageTitle: 'Orders',
      breadcrumb: [
        {
          text: 'Orders',
          active: true,
        },
      ],
    },
  },
  // *===============================================---*
  // *--------- Payment Logs ---- ---------------------------------------*
  // *===============================================---*
  {
    path: '/payment-logs/list',
    name: 'payment-logs-list',
    component: () => import('@/views/payment-logs/Index.vue'),
    meta: {
      pageTitle: 'Payment Logs',
      breadcrumb: [
        {
          text: 'Payment Logs',
          active: true,
        },
      ],
    },
  },
  // *===============================================---*
  // *--------- ROLE ---- ---------------------------------------*
  // *===============================================---*
  {
    path: '/roles/list',
    name: 'roles-list',
    component: () => import('@/views/roles/Index.vue'),
    meta: {
      pageTitle: 'Roles',
      breadcrumb: [
        {
          text: 'Roles',
          active: true,
        },
      ],
    },
  },
  // *===============================================---*
  // *--------- COURSE ---- ---------------------------------------*
  // *===============================================---*
  {
    path: '/courses/list',
    name: 'courses-list',
    component: () => import('@/views/courses/Index.vue'),
    meta: {
      pageTitle: 'Courses',
      breadcrumb: [
        {
          text: 'Courses',
          active: true,
        },
      ],
    },
  },
  {
    path: '/courses/create',
    name: 'courses-create',
    component: () => import('@/views/courses/Create.vue'),
    meta: {
      pageTitle: 'Create Course',
      breadcrumb: [
        {
          to: {
            name: 'courses-list',
          },
          text: 'Courses',
        },
        {
          text: 'Courses Create',
          active: true,
        },
      ],
    },
  },
  {
    path: '/courses/edit/:id',
    name: 'courses-edit',
    component: () => import('@/views/courses/Edit.vue'),
    meta: {
      pageTitle: 'Edit Course',
      breadcrumb: [
        {
          to: {
            name: 'courses-list',
          },
          text: 'Courses',
        },
        {
          text: 'Courses Edit',
          active: true,
        },
      ],
    },
  },
]
