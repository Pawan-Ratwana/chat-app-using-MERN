
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';
import NavBar from './modules/navBar';
import Home from './modules/home';

const isLoggedIn = localStorage.getItem('user:token') !== null;
// const user = localStorage.getItem('user:token');
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null;
  const isSignInOrSignUpPage = window.location.pathname.includes('/users/sign-in') || window.location.pathname.includes('/users/sign-up');


  if (!isLoggedIn && !isSignInOrSignUpPage) {
    return <Navigate to={'/users/sign-in'} />
  } else if (isLoggedIn && isSignInOrSignUpPage) {
    return <Navigate to={'/'} />;
  }
  return children;
}

function App() {
  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />

      <Routes>
        <Route path='/home' element={
          <Home isLoggedIn={isLoggedIn} />
        } />
        <Route path='/' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='users/sign-in' element={
          <ProtectedRoute>
            <Form isSignInPage={true} />
          </ProtectedRoute>
        } />
        <Route path='users/sign-up' element={
          <ProtectedRoute>
            <Form isSignInPage={false} />
          </ProtectedRoute>
        } />
      </Routes>
    </>
    // <div className="bg-[#9be1e6] h-screen flex justify-center items-center">
    //   <Form />

    // </div>
  );
}

export default App;
