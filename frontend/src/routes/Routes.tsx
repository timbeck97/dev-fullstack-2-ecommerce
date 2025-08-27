import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Login } from "../pages/Login";
import { Users } from "../pages/Users";
import { Wrapper } from "../components/Wrapper";
import { Orders } from "../pages/Orders";
import { Products } from "../pages/Products";
import { ProductDetail } from "../pages/ProductDetail";

const Routes = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Wrapper />}>
                <Route path="/" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
            

            </Route>
        ),
        {
            future: {
                v7_fetcherPersist: true,
                v7_normalizeFormMethod: true,
                v7_partialHydration: true,
                v7_relativeSplatPath: true,
                v7_skipActionErrorRevalidation: true
            },
        },
    );
    return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
Routes.displayName = 'Routes';
export default Routes;