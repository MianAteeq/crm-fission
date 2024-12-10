import React from 'react'
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
const AllContact = () => {
  const [categories, setCategory] = useState([])
  const [filteredItems, setFilterItem] = useState([])
  const [visible, setVisible] = useState(false)
  const [file, setFile] = useState(null)
  const [loadingTable, setLoadingActive] = useState(true)
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Client.list({
      limit: 2000,
    })
    setCategory(items)
    setFilterItem(items.sort((a, b) => a.name.localeCompare(b.name)))
    setLoadingActive(false)
  }

  useEffect(() => {
    fetchTodos()
  }, [])
  useEffect(() => {
    const sub = client.models.Client.observeQuery().subscribe({
      next: ({ items }) => {
        setCategory([...items.sort((a, b) => a.name.localeCompare(b.name))])
        setFilterItem([...items.sort((a, b) => a.name.localeCompare(b.name))])
      },
    })

    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    const filtered = categories.filter(
      (item) =>
        item.phone_number && item.phone_number.toLowerCase().includes(filterText.toLowerCase()),
    )
    setFilterItem(filtered)
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

      let isSaved = await SaveRecord(sheetData)
      console.log(isSaved)
      if (isSaved === true) {
        setVisible(false)
        setFile(null)
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
      name: 'Phone No',
      selector: (row) => row.phone_number,
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

  const SaveRecord = async (records) => {
    // var regexp = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/
    // var no = 433464339
    // console.log(regexp.test(no))
    // if (!regexp.test(no) && no.length < 0) {
    //   alert('Wrong phone no')
    // }
    records.forEach(async (item) => {
      if (item.phone_number !== undefined) {
        let phone_number = getNumber(item.phone_number)

        const { errors, data: newTodo } = await client.models.Client.create({
          category_id: item['category']??'Generic',
          name: 'No Name',
          phone_number: phone_number,
        })
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
              // value={file}
              onChange={(e) => setFile(e.target.files[0])}
              placeholder="Add File"
            />
            {/* <p style={{ color: 'red' }}>{error}</p> */}
            <div className="d-grid gap-2 col-6 mx-auto">
              <CButton color="primary" style={{ marginTop: '4%' }} onClick={() => saveDate()}>
                Import
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
            <strong>All Contact List</strong>{' '}
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

export default AllContact
