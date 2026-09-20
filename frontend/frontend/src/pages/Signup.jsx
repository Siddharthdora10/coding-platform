import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { useEffect ,useState} from "react";
import { registerUser } from "../authSlice";
import { Eye, EyeOff } from "lucide-react";

// Zod validation schema
const formSchema = z.object({
   firstName: z
    .string()
    .min(3, " firstName must be at least 3 characters"),

   emailId: z
    .string()
    . email("Please enter a valid  emailId"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

function Signup() {
 const [showPassword, setShowPassword] = useState(false);
 const dispatch=useDispatch();
 const navigate=useNavigate();
 const location=useLocation();
 const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);

  // Connect Zod with React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });


  useEffect(()=>{
    if(isAuthenticated){
      navigate(location.state?.from || '/problems');
    }
  },[isAuthenticated,navigate]);


  // Submit function
  const onSubmit = (data) => {
      dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          {/* Heading */}
          <h1 className="card-title text-3xl justify-center mb-2">
            Create Account
          </h1>

          <p className="text-center text-base-content/60 mb-6">
            Sign up to create your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

            {/*  firstName */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">
                   firstName
                </span>
              </label>

              <input
                type="text"
                placeholder="Enter  firstName"
                {...register("firstName")}
                className={`input input-bordered w-full ${
                  errors. firstName ? "input-error" : ""
                }`}
              />

              {errors. firstName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors. firstName.message}
                  </span>
                </label>
              )}
            </div>

            {/*  emailId */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">
                   emailId
                </span>
              </label>

              <input
                type=" email"
                placeholder="Enter  emailId"
                {...register("emailId")}
                className={`input input-bordered w-full ${
                  errors. emailId ? "input-error" : ""
                }`}
              />

              {errors. emailId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors. emailId.message}
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

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter password"
      {...register("password")}
      className={`input input-bordered w-full pr-12 ${
        errors.password ? "input-error" : ""
      }`}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
    >
      {showPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>
  </div>

  {errors.password && (
    <label className="label">
      <span className="label-text-alt text-error">
        {errors.password.message}
      </span>
    </label>
  )}
</div>

            {/* Submit button */}
            <button
  type="submit"
  disabled={loading}
  className="btn btn-primary w-full"
>
  {loading ? "Signing up..." : "Signup"}
</button>
          </form>
<div className="text-center mt-4">
  <span className="text-sm text-base-content/60">
    Already have an account?{" "}
  </span>

  <button
    type="button"
    onClick={() => navigate("/login", { state: location.state })}
    className="link link-primary text-sm"
  >
    Login
  </button>
</div>

        </div>
      </div>
    </div>
  );
}

export default Signup;
