import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = props => {
  const currency = '£'
  const delivery_fee = 10
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState({})
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState([])
  const [orderData, setOrderData] = useState({})
  const [coupons, setCoupons] = useState([]);


  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const getCartCount = () => { 
    let totalCount = 0
    for (const items in cartItems) { 
      totalCount += cartItems[items]["quantity"]
    }
    return totalCount
  }
  
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/coupons/list`);
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupon:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);



  
  
  const addToCart = async (itemId, price, quantity, strength) => {
    // Clone current cart items so we don't mutate state directly.
    let cartData = structuredClone(cartItems);
  
    // If the item already exists in the cart, update its quantity and total price.
    if (cartData[itemId]) {
      cartData[itemId].quantity += quantity;
      cartData[itemId].price += price;
      // Update the strength (if needed, you can handle merging or selecting the most common strength)
      cartData[itemId].strength = strength;
    } else {
      // Create a new cart entry for this item
      cartData[itemId] = {
        quantity: quantity,
        price: price,
        strength: strength,
      };
    }
  
    // Update the cart items in state
    setCartItems(cartData);
  
    // If the user is authenticated, update the cart on the server as well.
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, price, quantity, strength },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (itemId, strength, price, quantity) => {
    if (price === undefined) {
      toast.error("Error: Could not find price for the selected strength.");
      return;
    }
  
    // Clone current cart data so we don't mutate state directly
    let cartData = structuredClone(cartItems);
  
    if (quantity <= 0) {
      // Remove the item completely if quantity is zero or less
      delete cartData[itemId];
    } else {
      // Update the cart entry for this item with the new quantity, calculated total price, and strength
      cartData[itemId] = {
        quantity: quantity,
        price: price,
        totalPrice: price * quantity,
        strength: strength,
      };
    }
  
    setCartItems(cartData);
  
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, price, quantity, strength },
          { headers: { token } }
        );
        console.log("Update request successful");
      } catch (error) {
        console.error("Error during update:", error);
        toast.error(error.message);
      }
    }
  };
    
  const getCartAmount = () => {
    let totalAmount = 0
    for (const items in cartItems) { 
      totalAmount += cartItems[items]['price'] * cartItems[items]["quantity"]
    }
    return totalAmount
  }
  
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getUserCart = async token => {
    try {
      const response = await axios.post(
        backendUrl + '/api/cart/get',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  

  const getCategories = async token => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        setCategory(response.data.categories.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const setOrderDataFn = (orderData) => {
    setOrderData(orderData)
  }

  useEffect(() => {
    getProductsData()
    getCategories()
  }, [])

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }
    if (token) {
      getUserCart(token)
    }
  }, [token])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    category,
    setOrderDataFn,
    orderData,
    fetchCoupons,
    coupons,  
  }

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  )
}

export default ShopContextProvider
