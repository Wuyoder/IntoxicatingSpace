import React, { useEffect, useState, createContext } from 'react';
import Main from './components/main';
import Showlist from './pages/showlist/showlist';
import Showchoice from './pages/show/show';
import Episode from './pages/episode/episode';
import Creator from './pages/creator/creator';
import Profile from './pages/profile/profile';
import LoginSignup from './pages/loginsignup/loginsignup';
import Search from './pages/search/search';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/test/index';
import { USER_PROFILE } from './global/constants';
import axios from 'axios';
export const AppContext = createContext();

const App = () => {
  //匯出useContext內容，可以包含useState一起放下去，就可以跨區setState

  //決定show id頁面的出現
  const [showid, setShowid] = useState([]);
  const [episodeid, setEpisodeid] = useState('');
  const [episodeurl, setEpisodeurl] = useState('123');
  const [search, setSearch] = useState([]);
  const [test, setTest] = useState('test');
  //
  const [podcastplayer, setPod] = useState(0);
  const [member, setMember] = useState(true);
  const [audio, setAudio] = useState(0);
  //
  const appContextValue = {
    showid,
    setShowid,
    episodeid,
    setEpisodeid,
    episodeurl,
    setEpisodeurl,
    test: [test, setTest],
    podcastplayer,
    setPod,
    search,
    setSearch,
    member,
    setMember,
    audio,
    setAudio,
  };

  useEffect(() => {
    const getmember = async () => {
      const res = await axios.get(USER_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.data.error) {
        setMember(true);
      }
      if (res.data.id) {
        setMember(false);
      }
    };
    getmember();
  });

  // useEffect(() => {
  //   console.log('found change', podcastplayer);
  // }, [podcastplayer]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={appContextValue}>
        <Main.Topbar />
        <div id='middle'>
          <Main.Sidebar member={member} />
          <Routes>
            <Route path='/' element={<Showlist />}></Route>
            <Route path='/showchoice/:rss_id' element={<Showchoice />}></Route>
            <Route path='/episode/:rss_id/' element={<Episode />}></Route>
            <Route path='/creator' element={<Creator />}></Route>
            <Route path='/login' element={<LoginSignup />}></Route>
            <Route path='/test' element={<Home />}></Route>
            <Route path='/search' element={<Search />}></Route>
          </Routes>
        </div>
        <div id='filler'></div>
        <Main.Player />
      </AppContext.Provider>
    </BrowserRouter>
  );
};
export default App;
