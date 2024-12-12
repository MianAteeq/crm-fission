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
import { NavLink, useLocation, useParams } from 'react-router-dom'
const client = generateClient()
const DoctorDBS = () => {
  const [categories, setCategory] = useState([])
  const [filteredItems, setFilterItem] = useState([])
  const [visible, setVisible] = useState(false)
  const [file, setFile] = useState(null)
  const [loadingTable, setLoadingActive] = useState(true)
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const location = useLocation()
  const inputFile = useRef(null)
  const [showNumber, setNumber] = useState(false)
  const [totalRecord, setTotalRecord] = useState(0)
  const [savedRecord, setSavedReocrd] = useState(0)
  const [failedRecord, setFailedRecord] = useState(0)
  const [name, setName] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
  }
  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Client.list({
      limit: 20000,
      filter: {
        category_id: {
          beginsWith: name,
        },
      },
    })

    // await client.models.Client.list({
    //   limit: 20000,
    // })
    setCategory(items)
    setFilterItem(items.sort((a, b) => a.name.localeCompare(b.name)))
    await deleteAll(items)
    console.log(items.length, 'items.length')
    setLoadingActive(false)
  }

  useEffect(() => {
    let pathName = location.pathname
      .replace('client', '')
      .replace('/', '')
      .replace('/', '')
      .replace('-', ' ')
    if (capitalizeFirstLetter(pathName) === 'Doctor bds') {
      setName('Doctor BDS')
    } else if (capitalizeFirstLetter(pathName) === 'Doctor mbs') {
      setName('Doctor MBBS')
    } else {
      setName(capitalizeFirstLetter(pathName))
    }
  }, [location])

  useEffect(() => {
    if (name !== '') {
      setLoadingActive(true)
      fetchTodos()
    }
  }, [name])

  useEffect(() => {
    const sub = client.models.Client.observeQuery({
      limit: 20000,
      filter: {
        category_id: {
          beginsWith: name,
        },
      },
    }).subscribe({
      next: ({ items }) => {
        setCategory([...items])
        setFilterItem([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [name])

  useEffect(() => {
    if (failedRecord + savedRecord === totalRecord) {
      setLoading(false)
    }
  }, [savedRecord, failedRecord])

  useEffect(() => {
    const filteredData = categories.filter((sheet) => {
      return (
        sheet?.name?.toLowerCase().includes(filterText) ||
        sheet?.phone_number
          ?.replace(' ', '')
          ?.toLowerCase()
          .includes(filterText.replace(' ', '')?.toLowerCase()) ||
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
      setTotalRecord(sheetData.length)
      let exists = Object.keys(sheetData[0]).filter(
        (record) => record.replace(' ', '') === 'phone_number',
      )
      if (exists.length === 0) {
        setError('Invalid File Format')
        inputFile.current.value = null
        setFile(null)
        return
      }
      setLoading(true)
      setNumber(true)

      let isSaved = await SaveRecord(sheetData)
      if (isSaved === true) {
        setFile(null)
        inputFile.current.value = null
        setError('')
      }
    }

    reader.readAsBinaryString(file)
  }
  const deleteRow = async (row) => {
    const shouldRemove = confirm('are you sure you want to delete?')
    if (shouldRemove) {
      const toBeDeletedTodo = {
        phone_number: row.phone_number,
      }

      const { data: deletedTodo, error } = await client.models.Client.delete(toBeDeletedTodo)

      // fetchTodos()
    }
  }

  const columns = [
    {
      name: 'ID',
      selector: (row, i) => i + 1,
    },

    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Phone No',
      selector: (row) => row.phone_number.replace(' ', ''),
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
      name: 'Designation',
      selector: (row) => (row.designation ? row.designation : 'N.A'),
    },

    {
      name: 'Action',
      selector: (row) => {
        return (
          <>
            <NavLink to={{ pathname: '/edit/client' }} state={JSON.stringify(row)}>
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

  const deleteAll = async (records) => {
    records.forEach(async (item) => {
      // if (item.phone_number.length === 12) {
        const toBeDeletedTodo = {
          phone_number: item.phone_number,
        // }

        const { data: deletedTodo, error } = await client.models.Client.delete(toBeDeletedTodo)
      }
    })
  }

  const getNumber = (phone_number) => {
    if (phone_number === undefined) {
      return 0
    }
    var regex = /(9|04)\d{8}/g

    if (regex.test(phone_number) === true) {
      return `+${phone_number}`
    }
    console.log(phone_number.toString()[0])
    if (phone_number.toString()[0] == '0' || phone_number.toString()[0] === 0) {
      let numberStr = phone_number.toString()

      const res = numberStr.replace(numberStr[0], '')

      return `+92${res}`
    }
    if (phone_number.toString()[0] === '3') {
      return `+92${phone_number}`
    } else {
      return 0
    }
  }

  const SaveRecord = async (records) => {
    var failed = 0
    var incomplete_digit = []
    var wrong_digit = []
    var saved = 0
    records.forEach(async (item) => {
      let no = item?.phone_number?.toString().replace(' ', '').replace('-', '')
      if (no !== undefined && no !== '' && no !== null) {
        let phone_number = getNumber(
          item?.phone_number?.toString().replace(' ', '').replace('-', ''),
        )

        if (phone_number.length < 13) {
          failed++
          incomplete_digit.push(phone_number)
          wrong_digit.push(item?.phone_number?.toString().replace(' ', '').replace('-', ''))
          return
        }

        const { errors, data: newTodo } = await client.models.Client.create({
          category_id: name,
          name: item.name ? item.name : 'No Name',
          designation: item.designation ? item.designation : '',
          cnic: item.cnic ? item.cnic : '',
          hospital: item.hospital ? item.hospital : '',
          address: item.address ? item.address : '',
          phone_number: phone_number,
        })
        if (newTodo !== null) {
          saved++
          setSavedReocrd(saved)
        } else {
          failed++

          setFailedRecord(failed)
        }
      } else {
        failed++
        setFailedRecord(failed)
        // wrong_digit.push(item.phone_number)
      }
    })

    console.log(incomplete_digit, 'incomplete_digit')
    console.log(wrong_digit, 'incomplete_digit')

    return true
  }

  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>Import Data</strong>{' '}
          <CButton
            color="primary"
            style={{ float: 'right' }}
            onClick={() => {
              setVisible(false)
              setNumber(false)
              setTotalRecord(0)
              setSavedReocrd(0)
              setFailedRecord(0)
            }}
          >
            Close Model
          </CButton>
        </CCardHeader>

        <CForm>
          <div className="m-3">
            {showNumber === true ? (
              <p>
                <span>
                  <strong>Total Record</strong>: {totalRecord}
                </span>{' '}
                <br />
                <span>
                  <strong>Total Saved Record</strong>: {savedRecord}
                </span>
                <br />
                <span>
                  <strong>Total Record Failed</strong>: {failedRecord}
                </span>
              </p>
            ) : (
              ''
            )}

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
                {loading === true ? 'Saving Data ...' : 'Import Data'}
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

  return (
    <CRow>
      <CCol xs={12}>
        {visible == true ? createForm() : null}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{name} Contact List</strong>{' '}
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

export default DoctorDBS
