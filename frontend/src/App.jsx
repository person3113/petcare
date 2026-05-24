import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import AnimalDetailpage from './pages/AnimalDetailpage.jsx';
import AnimalSwipepage from "./pages/AnimalSwipepage.jsx";
import AnimalFeedPage from './pages/AnimalFeedPage.jsx';
import MatchResult from './pages/MatchResult.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Survey from './pages/Survey.jsx';
import ShelterMapPage from './pages/ShelterMapPage.jsx';
import LostAnimalPage from './pages/LostAnimalPage.jsx';
import MyPage from './pages/MyPage.jsx';
import CommunityListPage from './pages/CommunityListPage.jsx';
import CommunityDetailPage from './pages/CommunityDetailPage.jsx';
import CommunityFormPage from './pages/CommunityFormPage.jsx';
import './App.css';

function App() {
  return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* 여기에 layout파일을 상속받는 페이지들을 넣으면 됨*/}
                <Route index element={<Home />} />
                <Route path="animal/:id" element={<AnimalDetailpage />} /> {/*동물 상세페이지*/}
                <Route path="/animalswipe/:id" element={<AnimalSwipepage />} />{/*동물 스와이프페이지*/}
                <Route path="animals" element={<AnimalFeedPage />} /> {/*구조동물 피드*/}
                <Route path="survey" element={<Survey />} />
                <Route path="mypage" element={<MyPage />} />
                <Route path="match-result" element={<MatchResult />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="map" element={<ShelterMapPage />} /> {/*보호소 지도*/}
                <Route path="lost-animals" element={<LostAnimalPage />} /> {/*분실동물 탭*/}
                <Route path="community" element={<CommunityListPage />} />
                <Route path="community/new" element={<CommunityFormPage />} />
                <Route path="community/:id" element={<CommunityDetailPage />} />
                <Route path="community/:id/edit" element={<CommunityFormPage />} />
            </Route>
            {/* 레이아웃이 필요없거나 다른 상속을 받을 페이지들은 이곳에 */}
        </Routes>
  )
}

export default App;
