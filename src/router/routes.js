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
        path: 'analyse',
        component: () =>
        import ('pages/analyse/index')
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
