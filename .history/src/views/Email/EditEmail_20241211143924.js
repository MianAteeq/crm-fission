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
const EditEmail = (contact) => {
  const [categories, setCategory] = useState([])
  const navigate = useNavigate()
  const [state, setSate] = useState({
    name: '',
    categoryId: '',
    email: '',
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

  useEffect(() => {
    let obj = JSON.parse(location.state)
    setSate({
      name: obj.name,
      categoryId: obj.category_id,
      email: obj.email,
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

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
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
    if (!state.email.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (validateEmail(state.email) === false) {
      setError('Email is Invalid')

      return
    }

    const toBeDeletedTodo = {
      email: JSON.parse(location.state).email,
    }

    const { data: deletedTodo, error } = await client.models.EmailList.delete(toBeDeletedTodo)

    const { errors, data: newTodo } = await client.models.EmailList.create({
      category_id: state.categoryId,
      name: state.name,
      email: state.email,
      cnic: state.cnic.replace(' ', ''),
      designation: state.designation,
      hospital: state.hospital,
      address: state.address,
    })
    if (errors) {
      if (errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
        setError('Email Already Exist')
      } else {
        setError(errors[0].message)
      }
    } else {
      navigate(-1)
    }
  }
  const handleChange = (e) => {
    let email = e.clipboardData.getData('Text')

    setSate({
      ...state,
      email: email,
    })
  }
  console.log(state)
  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>Update Email</strong>
        </CCardHeader>
        <CForm>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Client Category</CFormLabel>
            <CFormSelect
              aria-label="Select Client Category"
              value={state.categoryId}
              onChange={(e) => setSate({ ...state, categoryId: e.target.value })}
            >
              <option>Open this select menu</option>
              {categories.map((item) => {
                // eslint-disable-next-line react/jsx-key
                return <option value={item.toID}>{item.name}</option>
              })}
            </CFormSelect>
            <p style={{ color: 'red' }}>{!state.categoryId ? error : ''}</p>
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Name</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="name"
              value={state.name}
              onChange={(e) => setSate({ ...state, name: e.target.value })}
              placeholder="Add Name"
            />
            <p style={{ color: 'red' }}>{!state.name ? error : ''}</p>
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Email</CFormLabel>
            <CFormInput
              type="email"
              id="exampleFormControlInput1"
              name="email"
              value={state.email}
              onChange={(e) => setSate({ ...state, email: e.target.value })}
              onPaste={handleChange}
              placeholder="Add Email"
            />
           <p style={{ color: 'red' }}>{!state.email ? error : ''}</p>
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">CNIC No</CFormLabel>
            <CFormInputWithMask
              mask="0000000000000"
              name="cnic"
              value={state.cnic}
              onChange={(e) => setSate({ ...state, cnic: e.target.value })}
              onPaste={handleChangeCnic}
              placeholder="Add Cnic Number"
            />
            {/* <p style={{ color: 'red' }}>{error}</p> */}
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Hospital</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="hospital"
              value={state.hospital}
              onChange={(e) => setSate({ ...state, hospital: e.target.value })}
              placeholder="Add Hospital"
            />
            {/* <p style={{ color: 'red' }}>{!state.hospital ? error : ''}</p> */}
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Designation</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="designation"
              value={state.designation}
              onChange={(e) => setSate({ ...state, designation: e.target.value })}
              placeholder="Add Designation"
            />
            {/* <p style={{ color: 'red' }}>{!state.designation ? error : ''}</p> */}
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Address</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="address"
              value={state.address}
              onChange={(e) => setSate({ ...state, address: e.target.value })}
              placeholder="Add Address"
            />
            {/* <p style={{ color: 'red' }}>{!state.address ? error : ''}</p> */}
          </div>
          <div className="m-3">
            <div className="d-grid gap-2 col-6 mx-auto">
              <CButton color="primary" style={{ marginTop: '4%' }} onClick={() => saveDate()}>
                Update
              </CButton>
            </div>
          </div>
        </CForm>
      </CCard>
    )
  }
  return (
    <CRow>
      <CCol xs={12}>{createForm()}</CCol>
    </CRow>
  )
}

export default EditEmail
