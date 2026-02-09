
// import jwt from "jsonwebtoken";

// const authUser = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Check header exists and starts with Bearer
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized Login Again",
//       });
//     }

//     // Extract token
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user info
//     req.auth = { userId: decoded.id };
//     req.body.userId = decoded.id;

//     next();
//   } catch (error) {
//     console.log("JWT ERROR:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Not Authorized Login Again",
//     });
//   }
// };

// export default authUser;
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;   // ✅ THIS LINE IS CRITICAL

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;