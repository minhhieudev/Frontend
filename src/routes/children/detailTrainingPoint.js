const path_code = "training_point/detailTrainingPoint";
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
];
