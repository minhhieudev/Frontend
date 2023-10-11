const path_code = 'consultant'
const name = 'Consultant'

export default [
  {
    path: path_code,
    component: () => import('@/components/Views/Consultant'),
    name: `${path_code}_main`,
    meta: {
      title: name
    }
  },
  {
    path: `${path_code}/new`,
    component: () => import('@/components/Views/User/Form'),
    name: `${path_code}_new`,
    meta: {
      title: `Tạo ${name}`
    }
  },
  {
    path: `${path_code}/edit/:id`,
    component: () => import('@/components/Views/User/Form'),
    name: `${path_code}_edit`,
    meta: {
      title: `Chỉnh Sửa ${name}`
    }
  }
]
