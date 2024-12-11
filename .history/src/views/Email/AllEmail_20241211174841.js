import React, { useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CButton,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import DataTable from 'react-data-table-component'
import * as XLSX from 'xlsx'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
const client = generateClient()
const AllEmail = () => {
  const [categories, setCategory] = useState([])
  const [filteredItems, setFilterItem] = useState([])
  const [visible, setVisible] = useState(false)
  const [file, setFile] = useState(null)
  const [loadingTable, setLoadingActive] = useState(true)
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputFile = useRef(null)
  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.EmailList.list({
      limit: 20000,
    })
    setCategory(items)
    setFilterItem(items.sort((a, b) => a.name.localeCompare(b.name)))
    setLoadingActive(false)
  }

  useEffect(() => {
    fetchTodos()
  }, [])
  useEffect(() => {
    const sub = client.models.EmailList.observeQuery({ limit: 20000 }).subscribe({
      next: ({ items }) => {
        setCategory([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    const filteredData = categories.filter((sheet) => {
      return (
        sheet?.name?.toLowerCase().includes(filterText) ||
        sheet?.email?.toLowerCase().includes(filterText) ||
        sheet?.cnic?.toLowerCase().includes(filterText) ||
        sheet?.address?.toLowerCase().includes(filterText) ||
        sheet?.hospital?.toLowerCase().includes(filterText) ||
        sheet?.Designation?.toLowerCase().includes(filterText)
      )
    })
    setFilterItem(filteredData)
  }, [filterText])

  const editRecord = (record) => {
    setVisible(true)
    setID(record.toID)
    setName(record.name)
  }

  const saveDate = async () => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(sheet)
      let exists = Object.keys(sheetData[0]).filter((record) => record === 'email')
      if (exists.length === 0) {
        setError('Invalid File Format')
        inputFile.current.value = null
        setFile(null)
        return
      }
      setLoading(true)
      let isSaved = await SaveRecord(sheetData)

      if (isSaved === true) {
        setVisible(false)
        setFile(null)

        setError('')
        setLoading(false)
      }
    }

    reader.readAsBinaryString(file)
  }
  const deleteRow = async (row) => {
    const shouldRemove = confirm('are you sure you want to delete?')
    if (shouldRemove) {
      const toBeDeletedTodo = {
        email: row.email,
      }

      const { data: deletedTodo, error } = await client.models.EmailList.delete(toBeDeletedTodo)
      fetchTodos()
    }
  }

  const columns = [
    {
      name: 'ID',
      selector: (row, i) => i + 1,
    },
    {
      name: 'Category',
      selector: (row) => row.category_id,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Email',
      selector: (row) => row.email.toLowerCase().replace('<', '').replace('>', ''),
    },
    {
      name: 'CNIC',
      selector: (row) => (row.cnic ? row.cnic : 'N.A'),
    },
    {
      name: 'Address',
      selector: (row) => (row.address ? row.address : 'N.A'),
    },

    {
      name: 'Action',
      selector: (row) => {
        return (
          <>
            <NavLink to={{ pathname: '/edit/email' }} state={JSON.stringify(row)}>
              Edit
            </NavLink>{' '}
            <span style={{ color: 'black' }}>|</span>
            <a
              onClick={() => deleteRow(row)}
              style={{ color: 'red', marginLeft: 5, cursor: 'pointer' }}
            >
              Delete
            </a>
          </>
        )
      },
    },
  ]

  const getNumber = (phone_number) => {
    if (phone_number === undefined) {
      return
    }
    var regex = /(9|04)\d{8}/g
    var regexThree = /(3)\d{8}/g
    var regExpZero = /^0[0-9].*$/

    if (regex.test(phone_number) === true) {
      return `+${phone_number}`
    }
    if (phone_number.toString()[0] === '0') {
      // Convert number into a string
      let numberStr = phone_number.toString()

      // Replace the 0 with empty string
      const res = numberStr.replace(numberStr[3], '')

      return `+92${Number(res)}`
    }
    if (phone_number.toString()[0] === '3') {
      return `+92${Number(phone_number)}`
    } else {
      return 0
    }
  }
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const SaveRecord = async (records) => {
    records.forEach(async (item) => {
      let email = item.email.replace('<', '').replace('>', '')
      if (validateEmail(email) === true) {
        if (item.email !== undefined) {
          const { errors, data: newTodo } = await client.models.EmailList.create({
            category_id: item['category'] ?? 'Generic',
            email: email,
            name: item.name ? item.name : 'No Name',
            designation: item.designation ? item.designation : '',
            cnic: item.cnic ? item.cnic : '',
            hospital: item.hospital ? item.hospital : '',
            address: item.address ? item.address : '',
          })
        }
      }
    })

    return true
  }
  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>Import Data</strong>
        </CCardHeader>
        <CForm>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">File</CFormLabel>
            <CFormInput
              type="file"
              id="exampleFormControlInput1"
              name="file"
              ref={inputFile}
              onChange={(e) => setFile(e.target.files[0])}
              placeholder="Add File"
            />
            <p style={{ color: 'red' }}>{error}</p>
            <div className="d-grid gap-2 col-6 mx-auto">
              <CButton color="primary" style={{ marginTop: '4%' }} onClick={() => saveDate()}>
                {loading ? 'Saving Data' : 'Import Data'}
              </CButton>
            </div>
          </div>
        </CForm>
      </CCard>
    )
  }
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(categories[0])
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (key !== 'category') {
          if (ctr > 0) result += columnDelimiter

          result += item[key]

          ctr++
        }
      })
      result += lineDelimiter
    })

    return result
  }
  function downloadCSV(array) {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv == null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }
  const Export = ({ onExport }) => (
    <CButton color="primary" onClick={(e) => onExport(e.target.value)}>
      Export
    </CButton>
  )

  // const actionsMemo =

  return (
    <CRow>
      <CCol xs={12}>
        {visible == true ? createForm() : null}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Email List</strong>{' '}
            <CButton
              color="primary"
              style={{ float: 'right' }}
              onClick={() => {
                setVisible(!visible)
              }}
            >
              Import Data
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="overflow-x-auto">
              <CFormInput
                id="search"
                type="text"
                placeholder="Filter Table"
                aria-label="Search Input"
                style={{ marginBottom: 10 }}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              {categories.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  progressPending={loadingTable}
                  pagination
                  actions={<Export onExport={() => downloadCSV(categories)} />}
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                />
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  progressPending={loadingTable}
                  pagination
                  // actions={actionsMemo}
                />
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AllEmail