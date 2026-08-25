import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/index.js'
import HomePage from './pages/Home.jsx'
import Login from "./pages/Login.jsx"
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "login",
          element: <Login />
        }
      ]
    }
  ]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
