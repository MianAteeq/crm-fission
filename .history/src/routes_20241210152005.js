import React, { useEffect } from 'react'
import CategoryList from './views/categories/categoryList'
import AddClient from './views/Client/AddClient'
import AllContact from './views/Client/AllContact'
import DoctorDBS from './views/Client/DoctorDbsContact'
import DoctorMbs from './views/Client/DoctorMbs'
import Patient from './views/Client/Patient'
import Generic from './views/Client/Generic'
import EditClient from './views/Client/EditClient'

import AddEmail from './views/Email/AddEmail'
import AllEmail from './views/Email/AllEmail'
import DoctorDBSEmail from './views/Email/DoctorDbsEmail'
import DoctorMbsEmail from './views/Email/DoctorMbsEmail'
import PatientEmail from './views/Email/PatientEmail'
import GenericEmail from './views/Email/GenericEmail'
import EditEmail from './views/Email/EditEmail'
import { getCats } from './helpers/helper'

// import CategoryList from './views/categories/categoryList'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

let records = []

const getRecord = async () => {
  records = await getCats()
  console.log(records)
}

// useEffect(() => {
//   getRecord()
// }, [])

getRecord()
console.log(records)

let route = []
// records
//   .sort((a, b) => a.name.localeCompare(b.name))
//   .forEach((item) => {
//     let obj = {
//       path: `${item.name.replace(' ', '-').toLowerCase()}/client`,
//       name: item.name,
//       element: DoctorDBS,
//     }

//     route.push(obj)
//   })
let email_route = []
// records
//   .sort((a, b) => a.name.localeCompare(b.name))
//   .forEach((item) => {
//     let obj = {
//       path: `${item.name.replace(' ', '-').toLowerCase()}/email`,
//       name: item.name,
//       element: DoctorDBSEmail,
//     }

//     email_route.push(obj)
//   })

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/category/list', name: 'Category List', element: CategoryList, exact: true },

  { path: '/add/client', name: 'Add Client', element: AddClient, exact: true },
  { path: '/edit/client', name: 'Edit Client', element: EditClient, exact: true },
  { path: '/all/client', name: 'All Client', element: AllContact, exact: true },
  // { path: '/doctor/dbs/client', name: 'Doctor Dbs Client', element: DoctorDBS, exact: true },
  // { path: '/doctor/mbs/client', name: 'Doctor MBS Client', element: DoctorMbs, exact: true },
  // { path: '/patient/client', name: 'Patient ', element: Patient, exact: true },
  // { path: '/generic/client', name: 'Generic ', element: Generic, exact: true },

  { path: '/add/email', name: 'Add Email', element: AddEmail, exact: true },
  { path: '/edit/email', name: 'Edit Email', element: EditEmail, exact: true },
  { path: '/all/email', name: 'All Email', element: AllEmail, exact: true },
  // { path: '/doctor/dbs/email', name: 'Doctor Dbs Email', element: DoctorDBSEmail, exact: true },
  // { path: '/doctor/mbs/email', name: 'Doctor MBS Email', element: DoctorMbsEmail, exact: true },
  // { path: '/patient/email', name: 'Patient Email ', element: PatientEmail, exact: true },
  // { path: '/generic/email', name: 'Generic Email ', element: GenericEmail, exact: true },
]

console.log(routes.concat(route).concat(email_route))
export default routes.concat(route).concat(email_route)
