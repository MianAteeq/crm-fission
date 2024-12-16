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
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Spinner, Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import { IMaskMixin } from 'react-imask'
import { useNavigate } from 'react-router-dom'
const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const AddClient = () => {
  const [categories, setCategory] = useState([])
  const [state, setSate] = useState({
    name: '',
    categoryId: '',
    phone_no: '',
    cnic: '',
    address: '',
    hospital: '',
    designation: '',
    working_at: '',
    email: '',
  })
  const [id, setID] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHospital, setShowHospital] = useState(false)
  const [error, setError] = useState('')
  const [email_error, setEmailError] = useState('')
  const navigate = useNavigate()
  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Category.list()
    setCategory(items)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

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
    if (!state.phone_no.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }

    let phone_no = state.phone_no.replace('-', '')
    let phoneno = phone_no.replace('+92', '')
    if (phone_no.length < 13) {
      setError('Phone No is Invalidd')
    }

    if (phone_no.length < 11) {
      setError('Phone No is Invalidss')
      return
    }
    var regExp = /^0[0-9].*$/

    if (regExp.test(phoneno) === true) {
      setError('Phone No is Invalids')
      return
    }
    if (state.email.trim() !== '') {
      if (validateEmail(state.email) === false) {
        setEmailError('InValid Email')
        return
      } else {
        setEmailError('')
      }
    }

    setLoading(true)
    const { errors, data: newTodo } = await client.models.Client.create({
      category_id: state.categoryId,
      name: state.name,
      phone_number: phone_no,
      cnic: state.cnic.replace(' ', ''),
      designation: state.designation,
      hospital: state.hospital,
      address: state.address,
    })
    if (errors) {
      console.log(errors[0].errorType)
      if (errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
        setError('Phone Number Already Exist')
        setLoading(false)
      } else {
        setError(errors[0].message)
        setLoading(false)
      }
    } else {
      setSate({
        name: '',
        categoryId: '',
        phone_no: '',
        cnic: '',
        address: '',
        hospital: '',
        designation: '',
        working_at: '',
      })
      navigate('/all/client')
    }
  }
  const handleChange = (e) => {
    let phone_no = e.clipboardData.getData('Text').replace('-', '')
    let phoneno = phone_no.replace('+92', '')

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
  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>{id ? 'Update' : 'Add'} Client</strong>
        </CCardHeader>
        <CForm>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Client Category</CFormLabel>
            <CFormSelect
              aria-label="Select Client Category"
              value={state.categoryId}
              onChange={(e) => {
                setSate({ ...state, categoryId: e.target.value })
                if (e.target.value === 'Nursing') {
                  setShowHospital(true)
                } else {
                  setShowHospital(false)
                }
              }}
            >
              <option>Open this select menu</option>
              {categories.map((item) => {
                // eslint-disable-next-line react/jsx-key
                return (
                  <option value={item.toID}>
                    {item.name === 'Doctor MBS' ? 'Doctor MBBS' : item.name}
                  </option>
                )
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
            <CFormLabel htmlFor="exampleFormControlInput1">Phone No</CFormLabel>
            <CFormInputWithMask
              mask="+{92}-0000000000"
              value={state.phone_no}
              onChange={(e) => setSate({ ...state, phone_no: e.target.value })}
              onPaste={handleChange}
              placeholder="Add Phone Number"
            />
            <p style={{ color: 'red' }}>{error}</p>
          </div>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Email</CFormLabel>
            <CFormInput
              type="email"
              id="exampleFormControlInput1"
              name="email"
              value={state.email}
              onChange={(e) => setSate({ ...state, email: e.target.value })}
              placeholder="Add Email"
              onPaste={handleChange}
            />
            <p style={{ color: 'red' }}>{email_error !== '' ? email_error : ''}</p>
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
          {showHospital === true ? (
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
            </div>
          ) : null}
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
            <CFormLabel htmlFor="exampleFormControlInput1">Working At</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="working_at"
              value={state.working_at}
              onChange={(e) => setSate({ ...state, working_at: e.target.value })}
              placeholder="Add Working At"
            />
            {/* <p style={{ color: 'red' }}>{!state.address ? error : ''}</p> */}
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
              <CButton
                color="primary"
                style={{ marginTop: '4%' }}
                loading={loading}
                onClick={() => saveDate()}
              >
                {loading === true ?? <Spinner as="span" animation="grow" />}
                {loading ? ' ...Saving Record' : id ? 'Update' : 'Submit'}
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

export default AddClient
