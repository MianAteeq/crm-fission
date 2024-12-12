/* eslint-disable react/jsx-key */
import React from 'react'
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import { IMaskMixin } from 'react-imask'
import { useLocation, useNavigate } from 'react-router-dom'
const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const ViewClient = (contact) => {
  const [categories, setCategory] = useState([])
  const navigate = useNavigate()
  const [state, setSate] = useState({
    name: '',
    categoryId: '',
    phone_no: '',
    cnic: '',
    address: '',
    hospital: '',
    designation: '',
  })
  const [id, setID] = useState('')
  const [error, setError] = useState('')

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Category.list()
    setCategory(items)
  }
  let location = useLocation()
  let contacts = JSON.parse(location.state)

  useEffect(() => {
    let obj = JSON.parse(location.state)
    setSate({
      name: obj.name,
      categoryId: obj.category_id,
      phone_no: obj.phone_number,
      cnic: obj.cnic,
      address: obj.address,
      hospital: obj.hospital,
      designation: obj.designation,
    })
  }, [location])
  useEffect(() => {
    fetchTodos()
  }, [])

  const editRecord = (record) => {
    setVisible(true)
    setID(record.toID)
    setName(record.name)
  }

  const saveDate = async () => {
    if (!state.categoryId.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (!state.name.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (!state.phone_no.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }

    let phone_no = state.phone_no.replace('-', '')
    let phoneno = phone_no.replace('+92', '')
    if (phone_no.length < 13) {
      setError('Phone No is Invalid')
    }
    if (phone_no.length < 13) {
      setError('Phone No is Invalid')
      return
    }
    var regExp = /^0[0-9].*$/

    if (regExp.test(phoneno) === true) {
      setError('Phone No is Invalid')
      return
    }

    const toBeDeletedTodo = {
      phone_number: JSON.parse(location.state).phone_number,
    }

    const { data: deletedTodo, error } = await client.models.Client.delete(toBeDeletedTodo)

    const { errors, data: newTodo } = await client.models.Client.create({
      category_id: state.categoryId,
      name: state.name,
      phone_number: phone_no,
      cnic: state.cnic.replace('-', ''),
      designation: state.designation,
      hospital: state.hospital,
      address: state.address,
    })
    if (errors) {
      if (errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
        setError('Phone Number Already Exist')
      } else {
        setError(errors[0].message)
      }
    } else {
      navigate(-1)
    }
  }
  const handleChange = (e) => {
    let phone_no = e.clipboardData.getData('Text').replace('-', '')
    let phoneno = phone_no.replace('+92', '')
    console.log(phoneno.replace(/\b0+/g, ''))
    setSate({
      ...state,
      phone_no: '+92' + phoneno.replace(/\b0+/g, ''),
    })
  }

  const handleChangeCnic = (e) => {
    let cnic = e.clipboardData.getData('Text').replace('-', '')

    setSate({
      ...state,
      cnic: cnic,
    })
  }
  console.log(contacts)
  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>View Client</strong>
        </CCardHeader>
        <CListGroup>
          {Object.keys(contacts).map((item, key) => {
            // eslint-disable-next-line react/jsx-key
            return (
              <CListGroupItem>
                {' '}
                <strong>{item}</strong>
                <span>{item[key]}</span>
              </CListGroupItem>
            )
          })}
        </CListGroup>
      </CCard>
    )
  }
  return (
    <CRow>
      <CCol xs={12}>{createForm()}</CCol>
    </CRow>
  )
}

export default ViewClient
