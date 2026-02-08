import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/resetSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { loading, error, message } = useSelector((state) => state.reset);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match. Please try again.");
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({ token, newPassword, confirmPassword })
      ).unwrap();
      toast.success(result.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast.error(err?.message || "Failed to reset password. Try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <ToastContainer position="top-right" autoClose={4000} />
      <div
        className="card shadow p-4"
        style={{ width: "380px", borderRadius: "10px" }}
      >
        <h2
          className="text-center mb-3"
          style={{ color: "#28a745", fontWeight: "600" }}
        >
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
         <div className="mb-3 position-relative">
  <input
    type={showPassword ? "text" : "password"}
    className="form-control"
    placeholder="New password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
    minLength={6}
    style={{ backgroundColor: "#e9f2ff" }}
  />
  <span
    className="position-absolute end-0 top-50 translate-middle-y me-3"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      cursor: "pointer",
      color: "#6c757d",
      fontSize: "1.2rem",
    }}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


          {/* Confirm Password */}
          {/* <div className="mb-3 position-relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="form-control"
              placeholder="Confirm password"
              
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              style={{ backgroundColor: "#e9f2ff" }}
            />
                <span
              className="position-absolute end-0 top-50 translate-middle-y me-3"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                cursor: "pointer",
                color: "#6c757d",
                fontSize: "1.2rem",
              }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
        
          </div> */}
          
  <div className="mb-3 position-relative">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type={showPassword ? "text" : "password"} // toggle type
              className="form-control"
              placeholder="Confirm password"
              required
            />
            <span
              onClick={() => setConfirmPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="d-grid mt-4 mb-2">
            <button
              type="submit"
              className="btn btn-success btn-lg shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving...
                </>
              ) : (
                "Save Password"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "#28a745" }}
          >
            Back to Login
          </Link>
        </div>

        {message && (
          <p className="text-success mt-3 text-center">{message}</p>
        )}
        {error && (
          <p className="text-danger mt-3 text-center">
            {error.message || "Something went wrong"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
