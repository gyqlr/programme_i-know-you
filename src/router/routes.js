export default [{
    path: '/',
    component: () =>
      import ('layouts/default'),
    children: [{
      path: 'home',
      component: () =>
        import ('pages/index')
    }, ]
  },
  {
    path: '/user',
    component: () =>
      import ('pages/user/index'),
    children: [{
      path: 'signup',
      component: () =>
        import ('pages/user/signUp')
    }, {
      path: 'login',
      component: () =>
        import ('pages/user/login')
    }, {
      path: 'reset',
      component: () =>
        import ('pages/user/reset')
    }]
  },
  { // Always leave this as last one
    path: '*',
    component: () =>
      import ('pages/404')
  }
]
