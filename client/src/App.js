import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components"
import "./index.css";
import { lightTheme, darkTheme } from "./utils/Themes";
import Sidebar from "./components/common/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Profile from "./pages/profile/Profile";
import PlaylistEpisodes from "./components/common/PlaylistEpisodes";
import PodcastDetails from "./pages/podcastDetail/PodcastDetails"
import SearchResult from "./components/common/SearchResult";
import { useQuery } from "@tanstack/react-query";
import { endPoint } from "./utils/Constants";
import Favourite from "./pages/profile/Favourite";
import UploadPodcast from "./pages/profile/UploadPodcast";
import Dashboard from "./pages/dashboard_page/Dashboard";

const Container = styled.div`
display:flex;
background:${({ theme }) => theme.bgLight};
width: 100%;
height: 100vh;
overflow-x:hidden;
overflow-y:hidden;
`;
const Frame = styled.div`
display:flex;
flex-direction:column;
flex:3;
`;

function App() {
  const savedMode = localStorage.getItem('mode')
  const themeChange = savedMode === 'darkTheme' ? lightTheme : darkTheme;
  const [theme, setTheme] = useState('lightTheme');
  const [menuOpen, setMenuOpen] = useState(false)


  const { isRefetching, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
        try {
            const res = await fetch(`${endPoint}/api/auth/me`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            },

        );
            const data = await res.json();
            if (data.error) return null
            if (!res.ok || data.error) {
                throw new Error(data.error || "Something went wrong")
            }
            return data;
        } catch (error) {
            throw new Error(error)
        }
    },
})

  const handleResize = () => {
    if (window.innerWidth > 1200) {
        setMenuOpen(true);
    } else {
        setMenuOpen(false);
    }
};


useEffect(() => {
    // Check screen size on initial render
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

useEffect(() => {
  // Check localStorage for saved theme preference on mount
  const savedTheme = localStorage.getItem('mode');
  if (savedTheme) {
      setTheme(savedTheme);
  }
}, []);


  const toggleFn = () => {
    const newTheme = theme === 'lightTheme' ? 'darkTheme': 'lightTheme';
    setTheme(newTheme)
    localStorage.setItem('mode', newTheme)
  }

  return (
    <ThemeProvider theme={themeChange}>
      <BrowserRouter>
        <Container>
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} toggleFn={toggleFn} savedMode={savedMode} />
          <Frame>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} isRefetching={isRefetching} isLoading={isLoading} />
            <Routes>
              <Route path="/" element={<Dashboard/>}></Route>
              <Route path="/favourite" element={<Favourite/>}></Route>
              <Route element={<UploadPodcast/>}></Route>
              <Route path="/profile/:userid/:feedType?/*" element={<Profile />}></Route>
              <Route path="/:type" element={<Dashboard />}></Route>
              <Route path='/podcast/:id' element={ <PodcastDetails />} />
              <Route path='/:username/playlist/:playlistId' element={ <PlaylistEpisodes/>} />
              <Route path="/search/:query" element={<SearchResult/>}></Route>
            </Routes>
          </Frame>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
