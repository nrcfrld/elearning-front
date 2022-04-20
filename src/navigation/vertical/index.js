export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
    mentorCanAccess: true,
  },
  {
    header: 'Main Menu',
    mentorCanAccess: true,
  },
  {
    title: 'Course',
    route: 'courses-list',
    icon: 'BookIcon',
    mentorCanAccess: true,
  },
  {
    title: 'Order',
    route: 'orders-list',
    icon: 'CreditCardIcon',
    mentorCanAccess: false,
  },
  {
    header: 'Administrator',
    mentorCanAccess: false,
  },
  {
    title: 'MasterData',
    icon: 'DatabaseIcon',
    tagVariant: 'light-warning',
    children: [
      {
        title: 'Category',
        route: 'categories-list',
      },
    ],
    mentorCanAccess: false,
  },
  {
    title: 'Payment Logs',
    route: 'payment-logs-list',
    icon: 'FolderIcon',
    mentorCanAccess: false,
  },
  {
    title: 'Users',
    route: 'users-list',
    icon: 'UsersIcon',
    mentorCanAccess: false,
  },
  {
    title: 'Roles',
    route: 'roles-list',
    icon: 'KeyIcon',
    mentorCanAccess: false,
  },
]
