const path_code = "/detailTrainingPoint";
const name = "Quản trị điểm rèn luyện";
const routeName = "training_point";
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}/detailTrainingPoint`),
    name: `${path_code}_main`,
    meta: {
      title: name,
    },
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
    component: () => import('@/components/Views/training_point'),
    name: `detailTrainingPoint_edit`,
    meta: {
      title: `Chỉnh Sửa ${name}`
    }
  }
]
