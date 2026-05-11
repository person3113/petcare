import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.jsx'
import './App.css'

function App() {
  return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* 여기에 layout파일을 상속받는 페이지들을 넣으면 됨*/}
                    {/* 아래는 layout잘 나오는지 확인용 */}
                    <Route index element={<div><p>lqyout이 프론트에 잘 나오는지 확인용 이건 Outlet에 들어갈 말</p></div>} />
                </Route>
                {/* 레이아웃이 필요없거나 다른 상속을 받을 페이지들은 이곳에 */}
            </Routes>
        </BrowserRouter>
  )
}

export default App;
