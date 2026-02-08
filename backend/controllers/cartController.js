import userModel from '../models/userModel.js'

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, quantity, strength, price } = req.body

    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData

    if (cartData[itemId]) {
      cartData[itemId].quantity += quantity
      cartData[itemId].price += price
      // Update the strength (if needed, you can handle merging or selecting the most common strength)
      cartData[itemId].strength = strength
    } else {
      // Create a new cart entry for this item
      cartData[itemId] = {
        quantity: quantity,
        price: price,
        strength: strength
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData })

    res.json({ success: true, message: 'Added To Cart' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity, strength, price } = req.body

    // Retrieve the user's cart data
    const userData = await userModel.findById(userId)
    let cartData = userData.cartData // assuming cartData is an object

    if (cartData[itemId]) {
      // Update existing item with new values
      cartData[itemId].quantity = quantity
      cartData[itemId].price = price // assume this is the updated total price (or unit price multiplied by quantity)
      cartData[itemId].strength = strength
    } else {
      // Add new cart entry if it doesn't exist
      cartData[itemId] = {
        quantity: quantity,
        price: price,
        strength: strength
      }
    }

    // Update the user's cartData field in the database
    await userModel.findByIdAndUpdate(userId, { cartData })

    res.json({ success: true, message: 'Cart Updated' })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body

    const userData = await userModel.findById(userId)
    let cartData = await userData.cartData

    res.json({ success: true, cartData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addToCart, updateCart, getUserCart }
