import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Login, Logout, MyPage } from './pages';

import { AuthProvider } from 'components/AuthProvider';
import Navbar from 'components/NavBar';

const links = [
  { href: '/my', title: 'Go to My Page' },
  { href: '/login', title: 'Go to login' },
  { href: '/', title: 'Go to index' },
];

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navbar links={links} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="*" index element={<Home />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
