// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { forgotPassword } from "../redux/forgotSlice";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get Redux states
//   const { loading, message, error } = useSelector((state) => state.forgot);
//   const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/tours"); // Redirect if user already logged in
//     }
//   }, [isAuthenticated, navigate]);

//   // Show toast when message or error updates
//   useEffect(() => {
//     if (message) {
//       toast.success(message);
//     }
//     if (error) {
//       toast.error(error.message || "Failed to send email");
//     }
//   }, [message, error]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email) {
//       toast.error("Please enter your email address");
//       return;
//     }
//     dispatch(forgotPassword({ email })); // 👈 trigger the async thunk
//   };

//   return (
//     <>
//       <ToastContainer />
//       <section id="common_banner">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="common_bannner_text">
//                 <ul>
//                   <li>
//                     <Link to="/">Home</Link>
//                   </li>
//                   <li>
//                     <span>
//                       <i className="fas fa-circle"></i>
//                     </span>{" "}
//                     Forgot password
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section id="common_author_area" className="section_padding">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-8 offset-lg-2">
//               <div className="common_author_boxed">
//                 <div className="common_author_heading">
//                   <h3>Forgot password</h3>
//                 </div>
//                 <div className="common_author_form">
//                   <form id="main_author_form" onSubmit={handleSubmit}>
//                     <div className="form-group">
//                       <input
//                         type="email"
//                         className="form-control"
//                         placeholder="Enter your email address"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </div>
//                     <div className="common_form_submit">
//                       <button
//                         className="btn btn_theme btn_md"
//                         type="submit"
//                         disabled={loading}
//                       >
//                         {loading ? "Sending..." : "Send Mail"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default ForgotPassword;



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../redux/forgotSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, message, error } = useSelector((state) => state.forgot);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate("/tours");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (message) toast.success(message);
    if (error) toast.error(error.message || "Failed to send reset link");
  }, [message, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    dispatch(forgotPassword({ email }));
  };

  return (
    <>
      <ToastContainer />
      <section
        className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
        style={{
          background: "linear-gradient(135deg, #f7f9fc, #e9f7ef)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div
                className="card shadow-lg border-0 rounded-4"
                style={{ padding: "2.5rem 2rem" }}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-success mb-1">Forgot Password?</h3>
                  <p className="text-muted small">
                    Enter your email below and we’ll send you a reset link.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
<div className="d-flex justify-content-center mt-4 mb-2">
  <button
    type="submit"
    disabled={loading}
    className="btn btn-success btn-lg shadow-sm"
  >
    {loading ? (
      <>
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Sending...
      </>
    ) : (
      "Send Reset Link"
    )}
  </button>
</div>

                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="text-muted small mb-1">
                    Remembered your password?
                  </p>
                  <Link to="/login" className="text-success fw-semibold">
                    Go back to Login
                  </Link>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="text-center mt-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <Link to="/" className="text-decoration-none text-success">
                        Home
                      </Link>
                    </li>
                    <li
                      className="breadcrumb-item active text-dark"
                      aria-current="page"
                    >
                      Forgot Password
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

       
      </section>
    </>
  );
};

export default ForgotPassword;
