import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch,useSelector } from "react-redux";
import { loginUser } from "../authSlice";
import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
 

// Zod validation schema
const formSchema = z.object({
  emailId: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

function Login() {
  // Connect Zod with React Hook Form
 const dispatch = useDispatch();
 const navigate=useNavigate();
 const location=useLocation();
 const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  // Submit function
  useEffect(()=>{
      if(isAuthenticated){
        navigate(location.state?.from || '/problems');
      }
    },[isAuthenticated,navigate]);
  
  const onSubmit = (data) => {
    console.log(data);
      dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          {/* Heading */}
          <h1 className="card-title text-3xl justify-center mb-2">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Email */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Email
                </span>
              </label>

              <input
                type="email"
                placeholder="Enter email"
                {...register("emailId")}
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
              />

              {errors.emailId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.emailId.message}
                  </span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold">
                  Password
                </span>
              </label>

              <input
                type="password"
                placeholder="Enter password"
                {...register("password")}
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
              />

              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            {/* Submit button */}
            {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
          <p className="mt-5 text-center text-sm text-base-content/60">New to CodeByte? <button onClick={() => navigate('/signup', { state: location.state })} className="link link-primary">Create an account</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
