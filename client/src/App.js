
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null;

  if (!isLoggedIn) {
    return <Navigate to={'/users/sign-in'} />
  } else if (isLoggedIn && ['/users/sign-in', '/users/sign-up'].includes(window.location.pathname)) {
    return <Navigate to={'/'} />
  }
  return children;
}

function App() {
  return (
    <Routes>
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
    // <div className="bg-[#9be1e6] h-screen flex justify-center items-center">
    //   <Form />

    // </div>
  );
}

export default App;
