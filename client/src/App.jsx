import React from 'react'
import { Route,Routes } from "react-router-dom";
import Conversation from './pages/conversation';
import Home from "./pages/home_page"
import Settings from './pages/settings';
import NotFound from './pages/not_found';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chat' element={<Conversation/>}/>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </>
  )
}

export default App
