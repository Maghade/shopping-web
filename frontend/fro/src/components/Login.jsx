




// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";
// import { useNavigate, useLocation } from "react-router-dom";
// import axiosInstance from "../axiosInstance";
// import { setToken, setUser } from "../redux/authSlice";
// import { sendRequest } from "../redux/requestSlice"; // ✅ Import Redux action
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [currentState, setCurrentState] = useState("Login");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [authCompleted, setAuthCompleted] = useState(false);
// const [countery, setCountry] = useState("");
// const [mobile, setMobile] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { token, user } = useSelector((state) => state.auth);
//   const redirect = new URLSearchParams(location.search).get("redirect") || "/";

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentState === "Sign Up") {
//         const res = await axiosInstance.post("/api/user/register", {
//           name,
//           email,
//           password,
//         });
//         if (res.data.success) {
//           dispatch(setToken(res.data.token));
//           dispatch(setUser(res.data.user));
//           toast.success("Registration successful!");
//           setAuthCompleted(true);
//         } else toast.error(res.data.message);
//       } else {
//         const res = await axiosInstance.post("/api/user/login", { email, password });
//         if (res.data.success) {
//           dispatch(setToken(res.data.token));
//           dispatch(setUser(res.data.user));
//           toast.success("Login successful!");
//           setAuthCompleted(true);
//         } else toast.error(res.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Login failed");
//     }
//   };

//   // ✅ Handle redirect + send request after login
//   useEffect(() => {
//     const handlePostLogin = async () => {
//       if (token && authCompleted) {
//         if (redirect.startsWith("/product/")) {
//           const productId = redirect.split("/product/")[1];
//           try {
//             await dispatch(
//               sendRequest({
//                 userId: user?._id,
//                 productId,
//                 message: "User is interested in this product.",
//               })
//             ).unwrap();

//             toast.success("Your request has been received! We will get back to you shortly.");
//             setTimeout(() => navigate("/orders"), 1500);
//           } catch (err) {
//             console.error(err);
//             toast.error("Failed to send product request.");
//           }
//         } else {
//           navigate("/");
//         }
//       }
//     };
//     handlePostLogin();
//   }, [token, authCompleted, redirect, navigate, user, dispatch]);

//   return (
//     <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
//         <form onSubmit={onSubmitHandler}>
//           <div className="text-center mb-3">
//             <h4 className="text-success">{currentState}</h4>
//           </div>

//           {currentState === "Sign Up" && (
//             <div className="mb-3">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <div className="mb-3">
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3 position-relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="form-control"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="position-absolute"
//               style={{
//                 right: "10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 cursor: "pointer",
//                 color: "#6c757d",
//               }}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>

//           <div className="d-flex justify-content-between text-muted mb-3">
//             <p
//               className="mb-0 small text-decoration-underline"
//               role="button"
//               onClick={() => navigate("/forgot-password")}
//             >
//               Forgot password?
//             </p>

//             {currentState === "Login" ? (
//               <p
//                 className="mb-0 small text-success fw-bold"
//                 role="button"
//                 onClick={() => setCurrentState("Sign Up")}
//               >
//                 Create account
//               </p>
//             ) : (
//               <p
//                 className="mb-0 small text-primary fw-bold"
//                 role="button"
//                 onClick={() => setCurrentState("Login")}
//               >
//                 Login Here
//               </p>
//             )}
//           </div>

//           <button type="submit" className="btn btn-success w-100">
//             {currentState === "Login" ? "Sign In" : "Sign Up"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { setToken, setUser } from "../redux/authSlice";
import { sendRequest } from "../redux/requestSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);

  // ✅ Added fields
  const [country, setCountry] = useState("");
  const [mobile, setMobile] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign Up") {
        const res = await axiosInstance.post("/api/user/register", {
          name,
          email,
          password,
          country,
          mobile,
        });

        if (res.data.success) {
          dispatch(setToken(res.data.token));
          dispatch(setUser(res.data.user));
          toast.success("Registration successful!");
          setAuthCompleted(true);
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axiosInstance.post("/api/user/login", {
          email,
          password,
        });

        if (res.data.success) {
          dispatch(setToken(res.data.token));
          dispatch(setUser(res.data.user));
          toast.success("Login successful!");
          setAuthCompleted(true);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  // ✅ Redirect + send request after login
  useEffect(() => {
    const handlePostLogin = async () => {
      if (token && authCompleted) {
        if (redirect.startsWith("/product/")) {
          const productId = redirect.split("/product/")[1];
          try {
            await dispatch(
              sendRequest({
                userId: user?._id,
                productId,
                message: "User is interested in this product.",
              })
            ).unwrap();

            toast.success("Your request has been received!");
            setTimeout(() => navigate("/orders"), 1500);
          } catch {
            toast.error("Failed to send product request.");
          }
        } else {
          navigate("/");
        }
      }
    };

    handlePostLogin();
  }, [token, authCompleted, redirect, navigate, user, dispatch]);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <form onSubmit={onSubmitHandler}>
          <div className="text-center mb-3">
            <h4 className="text-success">{currentState}</h4>
          </div>

          {/* Name */}
          {currentState === "Sign Up" && (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

     

         

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Links */}
          <div className="d-flex justify-content-between text-muted mb-3">
            <p
              className="mb-0 small text-decoration-underline"
              role="button"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </p>

            {currentState === "Login" ? (
              <p
                className="mb-0 small text-success fw-bold"
                role="button"
                onClick={() => setCurrentState("Sign Up")}
              >
                Create account
              </p>
            ) : (
              <p
                className="mb-0 small text-primary fw-bold"
                role="button"
                onClick={() => setCurrentState("Login")}
              >
                Login Here
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
