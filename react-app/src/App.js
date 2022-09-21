import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Auth, Home, MyPage } from './pages';

import { AuthProvider } from 'providers/AuthProvider';
import Navbar from 'components/NavBar';

const links = [
  { href: '/', title: 'Home' },
  { href: '/my', title: 'My Page' },
  { href: '/login', title: 'Login', credential: true },
  { href: '/logout', title: 'Logout', credential: false },
];

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navbar links={links} />
          <Routes>
            <Route path="/login">
              <Route index element={<Auth.Login />} />
              <Route path="google" element={<Auth.Redirects.Google />} />
              <Route path="github" element={<Auth.Redirects.Github />} />
              <Route path="kakao" element={<Auth.Redirects.Kakao />} />
              <Route path="naver" element={<Auth.Redirects.Naver />} />
            </Route>
            <Route path="/logout" element={<Auth.Logout />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="*" index element={<Home />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
