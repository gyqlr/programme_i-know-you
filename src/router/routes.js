export default [{
    path: '/',
    component: () =>
      import ('layouts/default'),
    children: [{
        path: '',
        component: () =>
          import ('pages/index')
      },
      {
        path: 'add',
        component: () =>
          import ('pages/add/index')
      }
    ]
  },
  {
    path: '/answer/:oid',
    component: () =>
      import ('pages/answer/index')
  },
  { // Always leave this as last one
    path: '*',
    component: () =>
      import ('pages/404')
  }
]
