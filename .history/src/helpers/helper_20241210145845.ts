import { generateClient } from 'aws-amplify/data'
const client = generateClient()




export const getCats =  () => {
  const { data: items, errors } =  client.models.Category.list()

  return items
};
