import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

// Define schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional()
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false
    }
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      acceptTerms: false
    }
  });
  
  const isLoginSubmitting = loginForm.formState.isSubmitting;
  const isRegisterSubmitting = registerForm.formState.isSubmitting;
  
  const handleLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.username, data.password);
      loginForm.reset();
      onClose();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await register({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone
      });
      registerForm.reset();
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Header */}
        <div className="bg-primary/5 p-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('login')} 
              className={`font-medium ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('register')} 
              className={`font-medium ${activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-neutral-600'}`}
            >
              Register
            </button>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="p-6">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <a href="#" className="text-xs text-primary">Forgot Password?</a>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoginSubmitting}
                >
                  {isLoginSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in
                    </>
                  ) : "Login"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">Or login with</p>
              <div className="flex justify-center space-x-4 mt-3">
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-neutral-300 hover:bg-neutral-50 transition">
                  <i className="fab fa-google text-lg"></i>
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-neutral-300 hover:bg-neutral-50 transition">
                  <i className="fab fa-facebook-f text-lg text-blue-600"></i>
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-neutral-300 hover:bg-neutral-50 transition">
                  <i className="fab fa-twitter text-lg text-blue-400"></i>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="p-6">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Enter your mobile number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Create Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-neutral-500 mt-1">Password must be at least 8 characters long</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the <a href="#" className="text-primary">Terms & Conditions</a></FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isRegisterSubmitting}
                >
                  {isRegisterSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering
                    </>
                  ) : "Register"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
