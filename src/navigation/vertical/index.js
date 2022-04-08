export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    header: 'Main Menu',
  },
  {
    title: 'MasterData',
    icon: 'DatabaseIcon',
    tag: '5',
    tagVariant: 'light-warning',
    children: [
      {
        title: 'Category',
        route: 'categories-list',
      },
    ],
  },
  {
    title: 'Course',
    route: 'courses-list',
    icon: 'BookIcon',
  },
  {
    title: 'Order',
    route: 'orders-list',
    icon: 'CreditCardIcon',
  },
  {
    header: 'Administrator',
  },
  {
    title: 'Payment Logs',
    route: 'payment-logs-list',
    icon: 'FolderIcon',
  },
  {
    title: 'Users',
    route: 'users-list',
    icon: 'UsersIcon',
  },
  {
    title: 'Roles',
    route: 'roles-list',
    icon: 'KeyIcon',
  },
]
