import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import '@aws-amplify/ui-react/styles.css'
import App from './App'
import store from './store'
import { getCats } from './helpers/helper'


Amplify.configure(outputs)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Authenticator hideSignUp={true}>
      <App />
    </Authenticator>
  </Provider>,
)
