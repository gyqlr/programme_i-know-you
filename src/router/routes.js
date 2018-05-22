export default [
  {
    path: "/",
    component: () => import("layouts/default"),
    children: [
      {
        path: "home",
        component: () => import("pages/index")
      },
      {
        path: "edit/:id",
        component: () => import("pages/survey/edit")
      },
      {
        path: "add",
        component: () => import("pages/survey/add")
      },
      {
        path: "analysis",
        component: () => import("pages/analysis/index"),
      },
    ]
  },
  {
    path: "/user",
    component: () => import("pages/user/index"),
    children: [
      {
        path: "signup",
        component: () => import("pages/user/signUp")
      },
      {
        path: "login",
        component: () => import("pages/user/login")
      },
      {
        path: "reset",
        component: () => import("pages/user/reset")
      }
    ]
  },
  {
    path: "/submit/:id",
    component: () => import("pages/submit")
  },
  {
    path: "/success",
    component: () => import("pages/success")
  },
  {
    // Always leave this as last one
    path: "*",
    component: () => import("pages/404")
  }
];
