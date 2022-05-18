import React, { useEffect, useState, createContext } from 'react';
import Main from './components/main';
import Showlist from './pages/showlist/showlist';
import Showchoice from './pages/show/show';
import Episode from './pages/episode/episode';
import Creator from './pages/creator/creator';
import LoginSignup from './pages/loginsignup/loginsignup';
import Search from './pages/search/search';
import Notfound from './pages/404/404';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { USER_PROFILE } from './global/constants';
import ajax from './util/ajax';
export const AppContext = createContext();

const App = () => {
  const [showid, setShowid] = useState([]);
  const [episodeid, setEpisodeid] = useState('');
  const [episodeurl, setEpisodeurl] = useState('');
  const [search, setSearch] = useState([]);
  const [podcastplayer, setPod] = useState(0);
  const [member, setMember] = useState(true);
  const [audio, setAudio] = useState(0);
  const [playing, setPlaying] = useState(0);

  const appContextValue = {
    showid,
    setShowid,
    episodeid,
    setEpisodeid,
    episodeurl,
    setEpisodeurl,
    podcastplayer,
    setPod,
    search,
    setSearch,
    member,
    setMember,
    audio,
    setAudio,
    playing,
    setPlaying,
  };

  useEffect(() => {
    const getmember = async () => {
      const res = await ajax('get', USER_PROFILE);
      if (res.data.error) {
        setMember(true);
      }
      if (res.data.id) {
        setMember(false);
      }
    };
    getmember();
  }, []);
  return (
    <BrowserRouter>
      <AppContext.Provider value={appContextValue}>
        <Main.Topbar />
        <div id='filler_container'>
          <div id='middle'>
            <Main.Sidebar member={member} />
            <Routes>
              <Route path='/' element={<Showlist />}></Route>
              <Route
                path='/showchoice/:rss_id'
                element={<Showchoice />}
              ></Route>
              <Route path='/episode/:rss_id/' element={<Episode />}></Route>
              <Route path='/creator' element={<Creator />}></Route>
              <Route path='/login' element={<LoginSignup />}></Route>
              <Route path='/search' element={<Search />}></Route>
              <Route path='/*' element={<Notfound />}></Route>
            </Routes>
          </div>
          <div id='filler'></div>
        </div>
        <Main.Player />
      </AppContext.Provider>
    </BrowserRouter>
  );
};
export default App;
