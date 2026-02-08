import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosInstance.get(`/api/user/verify/${token}`);
        toast.success(res.data.message);
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Invalid or expired link");
      }
    };
    verify();
  }, [token, navigate]);

  return <div>Verifying...</div>;
};

export default VerifyEmail;
