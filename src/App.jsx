import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/index.js";
import HomePage from "./pages/Home.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
