import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import DataTable from 'react-data-table-component'
const client = generateClient()
const CategoryList = () => {
  const [categories, setCategory] = useState([])
  const [name, setName] = useState('')
  const [id, setID] = useState('')
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Category.list()
    setCategory(items)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const editRecord = (record) => {
    setVisible(true)
    setID(record.toID)
    setName(record.name)
  }

  const saveDate = async () => {
    if (!name.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }
    if (id !== '') {
      const toBeDeletedTodo = {
        toID: id,
      }

      const { data: deletedTodo, error } = await client.models.Category.delete(toBeDeletedTodo)

      const todo = {
        toID: name,
        name: name,
      }
      const { data: updatedTodo, errors } = await client.models.Category.create(todo)
      if (errors) {
        setError(errors[0].message)
      } else {
        fetchTodos()
        setID('')
        setName('')
        setVisible(false)
      }
    } else {
      const { errors, data: newTodo } = await client.models.Category.create({
        name: name,
        toID: name,
      })
      if (errors) {
        setError(errors[0].message)
      } else {
        fetchTodos()
        setID('')
        setName('')
        setVisible(false)
      }
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
      name: 'Action',
      selector: (row) => {
        return (
          <a
            onClick={() => editRecord(row)}
            style={{ cursor: 'pointer' }}
            className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
          >
            Edit
          </a>
        )
      },
    },
  ]

  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>{id ? 'Update' : 'Add'} Category</strong>
        </CCardHeader>
        <CForm>
          <div className="m-3">
            <CFormLabel htmlFor="exampleFormControlInput1">Email address</CFormLabel>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add Category"
            />
            <p style={{ color: 'red' }}>{error}</p>
            <div className="d-grid gap-2 col-6 mx-auto">
              <CButton color="primary" style={{ marginTop: '4%' }} onClick={() => saveDate()}>
                {id ? 'Update' : 'Submit'}
              </CButton>
            </div>
          </div>
        </CForm>
      </CCard>
    )
  }
  return (
    <CRow>
      <CCol xs={12}>
        {visible == true ? createForm() : null}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Categories</strong>{' '}
            <CButton
              color="primary"
              style={{ float: 'right' }}
              onClick={() => {
                setVisible(!visible)
                setName('')
                setID('')
              }}
            >
              Add Category
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={categories} pagination />
              {/* <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>ID</Table.HeadCell>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {categories.map((item, i) => {
                    return (
                      <>
                        <Table.Row
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          key={item.toID.toString()}
                        >
                          <Table.Cell>{i + 1}</Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-black">
                            {item.name}
                          </Table.Cell>

                          <Table.Cell>
                            <a
                              onClick={() => editRecord(item)}
                              style={{ cursor: 'pointer' }}
                              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                            >
                              Edit
                            </a>
                          </Table.Cell>
                        </Table.Row>
                      </>
                    )
                  })}
                </Table.Body>
              </Table> */}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CategoryList
