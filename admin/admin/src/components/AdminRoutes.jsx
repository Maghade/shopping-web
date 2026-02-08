import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddEdit from '../pages/products/AddEdit';
import List from '../pages/products/List';
import CategoryList from '../pages/categories/List';
import CategoryAddEdit from '../pages/categories/AddEdit';
import SubcategoryList from '../pages/subcategories/List';
import SubcategoryAddEdit from '../pages/subcategories/AddEdit';
import Orders from '../pages/orders/Orders';
import CouponManagement from '../pages/marketing/CouponManagement';
import BundleList from '../pages/bundle/BundleList';
import BundleAdd from '../pages/bundle/BundleAdd';  // Make sure the case matches exactly
import ReviewList from '../pages/orders/ReviewList';
import BundleEdit from '../pages/bundle/BundleEdit';
import UsersList from '../pages/users/UsersList';
const AdminRoutes = ({ token }) => {
  return (
    <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
      <Routes>
        <Route path='/products/list' element={<List token={token} />} />
        <Route path='/products/add' element={<AddEdit token={token} />} />
        <Route path='/products/edit/:id' element={<AddEdit token={token} />} />
        <Route path='/products/category' element={<CategoryList token={token} />} />
        <Route path='/products/category/add' element={<CategoryAddEdit token={token} />} />
        <Route path='/products/category/edit/:id' element={<CategoryAddEdit token={token} />} />
      <Route path='/products/subcategory' element={<SubcategoryList token={token} />} />
        <Route path='/products/subcategory/add' element={<SubcategoryAddEdit token={token} />} />
        <Route path='/products/subcategory/edit/:id' element={<SubcategoryAddEdit token={token} />} />
        <Route path='/orders/list' element={<Orders token={token} />} />
        <Route path='/orders/review' element={<ReviewList token={token} />} />
        <Route path='/marketing/coupons' element={<CouponManagement token={token} />} />
        <Route path='/bundle/list' element={<BundleList token={token} />} />
        <Route path='/bundle/add' element={<BundleAdd token={token} />} />
        <Route path='/bundle/update/:id' element={<BundleAdd token={token} />} />
        <Route path='/bundle/edit/:id' element={<BundleEdit token={token} />} />
<Route path='/users/list' element={<UsersList token={token} />} />
        
      </Routes>
    </div>
  );
};

export default AdminRoutes;
