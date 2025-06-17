import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import NoPage from './pages/NoPage'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import CreatePost from './components/Create'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} className="float-end">
          <Route index element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App