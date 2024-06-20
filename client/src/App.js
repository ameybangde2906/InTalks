import { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components"
import "./index.css";
import { lightTheme, darkTheme } from "./utils/Themes";
import Sidebar from "./components/common/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import Favourite from "./pages/Favourite";
import Profile from "./pages/profile/Profile";
import UploadPodcast from "./pages/UploadPodcast";
import PlaylistEpisodes from "./components/common/PlaylistEpisodes";
import PodcastDetails from "./pages/podcastDetail/PodcastDetails"
import SearchResult from "./components/common/SearchResult";
import { useQuery } from "@tanstack/react-query";
import { endPoint } from "./utils/Constants";

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
  const savedMode = JSON.parse(localStorage.getItem('mode')) || false;
  const themeChange = savedMode === true ? lightTheme : darkTheme;
  const [darkMode, setDarkMode] = useState(savedMode);
  const [menuOpen, setMenuOpen] = useState(false)

  const { data: authUser } = useQuery({
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
            console.log('authUser is here:', data)
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


  const toggleFn = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('mode', JSON.stringify(darkMode))
  }

  return (
    <ThemeProvider theme={themeChange}>
      <BrowserRouter>
        <Container>
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} toggleFn={toggleFn} savedMode={savedMode} />
          <Frame>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Routes>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="/favourite" element={<Favourite />}></Route>
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
