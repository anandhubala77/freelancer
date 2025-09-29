import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

import { Provider } from 'react-redux'
import {store,persistor } from './store/store'
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </PersistGate>
  </Provider>
)
