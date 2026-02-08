// import jwt from 'jsonwebtoken'

// const authUser = async (req, res, next) => {
//   const { token } = req.headers
//   if (!token) {
//     return res.json({ success: false, message: 'Not Authorized Login Again' })
//   }

//   try {
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET)
//     req.body.userId = token_decode.id
//     req.auth = {
//       userId: token_decode.id
//     }
//     next()
//   } catch (error) {
//     console.log(error)
//     res.json({ success: false, message: error.message })
//   }
// }

// export default authUser

import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info
    req.auth = { userId: decoded.id };
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }
};

export default authUser;