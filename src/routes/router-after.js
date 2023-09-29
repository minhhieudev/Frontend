import store from '@/store'
export default function (to, from) {
  store.dispatch('changeCurrentSidebar', null)
  const pageTitle = to.meta.title || to.name
  let breadcrumb = to.matched.slice(1);
  store.dispatch('setPageTitle', pageTitle)
  store.dispatch('setBreadcrumb', breadcrumb)
  document.title = pageTitle
}
