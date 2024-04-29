import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import { SignUp, SignInRenderer } from "../components/Components-User-Account"
import App from '../App';
import ProductDetailsRenderer from '../components/Components-Product-Details/Product-Details-Renderer';
import GroceryItemForm from '../components/Components-Grocery-Item/Grocery-Item-Form';
import ProductListingPageRenderer from '../components/Product-Listing-Page/Product-Listing-Page-Renderer';


export default () => {


    return (
        <Routes>
            <Route path='/' element={<SignInRenderer />} />
            <Route path='login' element={<SignInRenderer />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='home' element={<App />} />

            <Route path='productDetail' element={<ProductDetailsRenderer
                name={"Product Name"}
                description={"Product Description"}
                images={[
                    "https://i5.walmartimages.com/asr/90cdb9fd-c2d6-4f10-90c4-bbc16c6963a2.8590ae0e3e7ab073316455a9dd9cfd87.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
                    "https://i5.walmartimages.com/asr/90cdb9fd-c2d6-4f10-90c4-bbc16c6963a2.8590ae0e3e7ab073316455a9dd9cfd87.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
                    "https://i5.walmartimages.com/asr/90cdb9fd-c2d6-4f10-90c4-bbc16c6963a2.8590ae0e3e7ab073316455a9dd9cfd87.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
                ]}
                price={10.99}
            />} />
            <Route path='addProduct' element={<GroceryItemForm />} />
            <Route path='productList' element={<ProductListingPageRenderer />} />

            {/* <Route path='forgot-password' element={<ForgotPassword />} />
            <Route element={<Layout ensureAuthenticated />}>{getRoutesByRole(role)}</Route>
            <Route path='*' element={<Err404 />} /> */}
        </Routes>
    )
}