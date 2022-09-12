import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Login, MyPage } from './pages';

import Navbar from './components/NavBar';
// import ResponsiveAppBar from './components/ResponsiveAppBar';

const links = [
  { href: '/my', title: 'Go to My Page' },
  { href: '/login', title: 'Go to login' },
  { href: '/', title: 'Go to index' },
];

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar links={links} />
        {/* <ResponsiveAppBar /> */}
        <Routes>
          <Route path="/my" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" index element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
