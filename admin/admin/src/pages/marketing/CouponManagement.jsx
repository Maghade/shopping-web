// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { backendUrl } from '../../App'
// import { toast } from 'react-toastify'
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'




// const CouponManagement = ({ token }) => {
//   const [coupons, setCoupons] = useState([])
//   const [code, setCode] = useState('')
//   const [discount, setDiscount] = useState('')
//   const [expiryDate, setExpiryDate] = useState('')
//   const [deleteCouponId, setDeleteCouponId] = useState(null)
 
//   // Fetch all coupons
//   const fetchCoupons = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/coupon/list`, {
//         headers: { token }
//       })
//       if (response.data.success) {
//         setCoupons(response.data.coupons)
//       } else {
//         toast.error(response.data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     fetchCoupons()
//   }, [])

//   // // Add Coupon
//   const addCoupon = async e => {
//     e.preventDefault()
//     if (!code || !discount || !expiryDate) {
//       toast.error('All fields are required!')
//       return
//     }

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/coupon/add`,
//         { code, discount, expiryDate },
//         { headers: { token } }
//       )

//       if (response.data.success) {
//         toast.success('Coupon added successfully!')
//         fetchCoupons()
//         setCode('')
//         setDiscount('')
//         setExpiryDate('')
//       } else {
//         toast.error(response.data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }


//   const confirmDeleteCoupon = id => {
//     setDeleteCouponId(id) // Show confirmation modal
//   }
//   // Delete Coupon
//   const deleteCoupon = async id => {
//     if (!deleteCouponId) return
//     try {
//       const response = await axios.delete(
//         `${backendUrl}/api/coupon/delete/${deleteCouponId}`,
//         { headers: { token } }
//       )

//       if (response.data.success) {
//         toast.success('Coupon deleted!')
//         fetchCoupons()
//       } else {
//         toast.error(response.data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//     setDeleteCouponId(null); // Close confirmation modal
//   }

//   return (
//     <div className='p-5'>
//       <h3 className='text-xl font-bold mb-4'>Coupon Management</h3>

//       {/* Add Coupon Form */}
//       <form
//         onSubmit={addCoupon}
//         className='flex flex-col md:flex-row gap-4 items-center mb-5'
//       >
//         <input
//           type='text'
//           placeholder='Coupon Code'
//           value={code}
//           onChange={e => setCode(e.target.value)}
//           className='border p-2 rounded w-full md:w-1/4'
//         />
//         <input
//           type='number'
//           placeholder='Discount %'
//           value={discount}
//           onChange={e => setDiscount(e.target.value)}
//           className='border p-2 rounded w-full md:w-1/4'
//           min='5'
//           max='100'
//         />
//         <input
//           type='date'
//           value={expiryDate}
//           onChange={e => setExpiryDate(e.target.value)}
//           className='border p-2 rounded w-full md:w-1/4'
//         />
//         <button
//           type='submit'
//           className='mb-2 px-4 py-2 bg-black text-white rounded flex items-center gap-2'
//         >
//           Add Coupon
//         </button>
//       </form>

//       {/* Coupon List */}
//       <table className='w-full border-collapse border border-gray-300'>
//         <thead>
//           <tr className='bg-gray-200'>
//             <th className='border p-2'>Coupon Code</th>
//             <th className='border p-2'>Discount</th>
//             <th className='border p-2'>Expiry Date</th>
//             <th className='border p-2'>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {coupons.length > 0 ? (
//             coupons.map(coupon => (
//               <tr key={coupon._id} className='text-center'>
//                 <td className='border p-2'>{coupon.code}</td>
//                 <td className='border p-2'>{coupon.discount}%</td>
//                 <td className='border p-2'>
//                   {new Date(coupon.expiryDate).toLocaleDateString()}
//                 </td>
//                 <td className='border p-2 flex justify-center items-center'>
//                   <FaTrash
//                     className='cursor-pointer text-red-600'
//                     onClick={() => deleteCoupon(coupon._id)}
//                     title='Delete'
//                   />
                  
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan='4' className='text-center p-4'>
//                 No coupons available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       {/* Coupon List Table */}



//       {/* Delete Confirmation Modal */}
//       {deleteCouponId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//             <p className="text-lg font-semibold mb-4">Are you sure you want to delete this coupon?</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//                 onClick={deleteCoupon}
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded"
//                 onClick={() => setDeleteCouponId(null)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default CouponManagement


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const CouponManagement = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [deleteCouponId, setDeleteCouponId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState('');

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/coupon/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setCoupons(response.data.coupons);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const addCoupon = async (e) => {
    e.preventDefault();
    if (!code || !discount || !expiryDate) {
      toast.error('All fields are required!');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/add`,
        { code, discount, expiryDate },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Coupon added successfully!');
        fetchCoupons();
        setCode('');
        setDiscount('');
        setExpiryDate('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCoupon = async () => {
    if (!deleteCouponId) return;
    try {
      const response = await axios.delete(
        `${backendUrl}/api/coupon/delete/${deleteCouponId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Coupon deleted!');
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setDeleteCouponId(null);
  };

  return (
    <div className='p-5'>
      <h3 className='text-xl font-bold mb-4'>Coupon Management</h3>

      <form onSubmit={addCoupon} className='flex flex-col md:flex-row gap-4 items-center mb-5'>
        <input
          type='text'
          placeholder='Coupon Code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='border p-2 rounded w-full md:w-1/4'
        />
        <input
          type='number'
          placeholder='Discount %'
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className='border p-2 rounded w-full md:w-1/4'
          min='5'
          max='100'
        />
        <input
          type='date'
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className='border p-2 rounded w-full md:w-1/4'
        />
        <button type='submit' className='px-4 py-2 bg-black text-white rounded'>
          Add Coupon
        </button>
      </form>

      <table className='w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2'>Coupon Code</th>
            <th className='border p-2'>Discount</th>
            <th className='border p-2'>Expiry Date</th>
            <th className='border p-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr key={coupon._id} className='text-center'>
                <td className='border p-2'>{coupon.code}</td>
                <td className='border p-2'>{coupon.discount}%</td>
                <td className='border p-2'>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td className='border p-2 flex justify-center items-center'>
                  <FaTrash
                    className='cursor-pointer text-red-600'
                    onClick={() => setDeleteCouponId(coupon._id)}
                    title='Delete'
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='text-center p-4'>No coupons available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* <div className='mt-4'>
        <p className='font-semibold'>Coupons</p>
        <select
          className='border p-2 w-full'
          value={selectedCoupon}
          onChange={(e) => setSelectedCoupon(e.target.value)}
        >
          <option value=''>Select Coupons</option>
          {coupons.map((coupon) => (
            <option key={coupon._id} value={coupon.code}>
              {coupon.code}
            </option>
          ))}
        </select>
      </div> */}

      {deleteCouponId && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg text-center'>
            <p className='text-lg font-semibold mb-4'>Are you sure you want to delete this coupon?</p>
            <div className='flex justify-center gap-4'>
              <button className='px-4 py-2 bg-red-600 text-white rounded' onClick={deleteCoupon}>
                Yes, Delete
              </button>
              <button className='px-4 py-2 bg-gray-300 rounded' onClick={() => setDeleteCouponId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;

