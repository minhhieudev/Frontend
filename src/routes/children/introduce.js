const path_code = "introduce";
const name = "Giới thiệu";
const routeName = "Introduce";
export default [
  {
    path: path_code,
    component: () => import(`@/components/Views/${routeName}`),
    name: `${path_code}_main`,
    meta: {
      title: name,
    },
  },
];
