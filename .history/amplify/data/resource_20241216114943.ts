import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';
// const echoHandler = defineFunction({
//   entry: './echo-handler/handler.ts'
// })
/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update",
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Category: a
    .model({
      name: a.string().required(),
      toID: a.id().required(),
      clients: a.hasMany('Client', 'category_id'),
      emails: a.hasMany('EmailList', 'category_id'),
    }).identifier(['toID']).authorization((allow) => [allow.authenticated('identityPool')]),

    Client: a
    .model({
      category_id: a.id(),
      phone_number: a.string().required(),
      name: a.string(),
      cnic: a.string(),
      address: a.string(),
      hospital: a.string(),
      working_at: a.string(),
      designation: a.string(),
      email: a.string(),
      category: a.belongsTo('Category', 'category_id'),
    }).identifier(['phone_number']).authorization((allow) => [allow.authenticated('identityPool')]),


    EmailList: a
    .model({
      category_id: a.id(),
      email: a.string().required(),
      name: a.string(),
      cnic: a.string(),
      address: a.string(),
      working_at: a.string(),
      hospital: a.string(),
      designation: a.string(),
      category: a.belongsTo('Category', 'category_id'),
    }).identifier(['email']).authorization((allow) => [allow.authenticated('identityPool')]),






});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
