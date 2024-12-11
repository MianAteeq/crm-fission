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
const EditClient = (contact) => {
  const [categories, setCategory] = useState([])
  const navigate = useNavigate()
  const [state, setSate] = useState({
    name: '',
    categoryId: '',
    phone_no: '',
  })
  const [id, setID] = useState('')
  const [error, setError] = useState('')

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Category.list()
    setCategory(items)
  }
  let location = useLocation()

  useEffect(() => {
    let obj=JSON.parse(location.state)
    setSate({
      name: obj.name,
      categoryId: obj.category_id,
      phone_no: obj.phone_number,
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

    })
    if (errors) {
     if (errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
        setError('Phone Number Already Exist')
      }else{
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
  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>Update Client</strong>
        </CCardHeader>
        <CForm>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Client Category</CFormLabel>
            <CFormSelect
              aria-label="Select Client Category" value={state.categoryId}
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

export default EditClient
