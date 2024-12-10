import { generateClient } from 'aws-amplify/data'
const client = generateClient()




export const getCats = async () => {
  const { data: items, errors } = await client.models.Category.list()

};
