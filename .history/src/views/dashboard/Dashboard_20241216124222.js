import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CLink,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilChartPie,
  cilArrowRight,
  cilContact,
  cibGmail,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { generateClient } from 'aws-amplify/data'
const client = generateClient()
const Dashboard = () => {
  const [categories, setCategory] = useState([])
  const [emails, setEmail] = useState([])
  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Client.list(
      {
        limit: 20000,
      },
      {
        authMode: 'userPool',
      },
    )

    setCategory(items)
  }
  const fetchEmail = async () => {
    const { data: items, errors } = await client.models.EmailList.list(
      {
        limit: 20000,
      },
      {
        authMode: 'userPool',
      },
    )

    setEmail(items)
  }

  useEffect(() => {
    fetchTodos()
    fetchEmail()
  }, [])

  return (
    <>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={30} />}
            title="Total Contact"
            value={categories.length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Contact (MBS)"
            value={categories.filter((item) => item.category_id === 'Doctor MBS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Total Contact (BDS)"
            value={categories.filter((item) => item.category_id === 'Doctor BDS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Total Contact (Patient)"
            value={categories.filter((item) => item.category_id === 'Patient').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Total Contact (Nursing)"
            value={categories.filter((item) => item.category_id === 'Patient').length}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={30} />}
            title="Total Email"
            value={emails.length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Email (MBS)"
            value={emails.filter((item) => item.category_id === 'Doctor MBS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email (BDS)"
            value={emails.filter((item) => item.category_id === 'Doctor BDS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email (Patient)"
            value={emails.filter((item) => item.category_id === 'Patient').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email (Nursing)"
            value={emails.filter((item) => item.category_id === 'Nursing').length}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
