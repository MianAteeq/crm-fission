import { generateClient } from 'aws-amplify/data'
const client = generateClient()




export const getCats = () => {

  return new Promise(resolve =>  client.models.Category.list());

};
