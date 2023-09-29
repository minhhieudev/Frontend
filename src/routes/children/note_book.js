const path_code = "note_book";
const name = "Sổ tay sinh viên";
const routeName = "NoteBook";
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
