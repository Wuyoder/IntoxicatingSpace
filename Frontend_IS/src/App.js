import React, { useEffect, useState, createContext } from 'react';
import './index.css';
import Main from './components/main';
import Showlist from './pages/showlist/showlist';
import Showchoice from './pages/show/show';
import Episode from './pages/episode/episode';
import Creator from './pages/creator/creator';
import Profile from './pages/profile/profile';
import LoginSignup from './pages/loginsignup/loginsignup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/test/index';
export const AppContext = createContext();

const App = () => {
  //匯出useContext內容，可以包含useState一起放下去，就可以跨區setState

  //決定show id頁面的出現
  const [showid, setShowid] = useState(1);
  const [episodeid, setEpisodeid] = useState(0);
  const [episodeurl, setEpisodeurl] = useState('123');
  //
  const [test, setTest] = useState('test');
  //

  const appContextValue = {
    showid,
    setShowid,
    episodeid,
    setEpisodeid,
    episodeurl,
    setEpisodeurl,
    test: [test, setTest],
  };

  // 下方return中，已經帶入一包context，詳見showlist.js

  const [gopages, setGopages] = useState('go ahead!');

  console.log(gopages);
  return (
    <BrowserRouter>
      <AppContext.Provider value={appContextValue}>
        <Main.Topbar />
        <div id='middle'>
          <Main.Sidebar />
          <Routes>
            <Route
              path='/'
              element={<Showlist setGopages={setGopages} />}
            ></Route>
            <Route path='/showchoice' element={<Showchoice />}></Route>
            <Route path='/episode' element={<Episode />}></Route>
            <Route path='/creator' element={<Creator />}></Route>
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/login' element={<LoginSignup />}></Route>
            <Route path='/test' element={<Home />}></Route>
          </Routes>
        </div>
        <Main.Player />
      </AppContext.Provider>
    </BrowserRouter>
  );
};
export default App;
