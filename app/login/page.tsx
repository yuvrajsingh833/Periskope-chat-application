"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSupabase } from "@/providers/supabase-provider";
import {
  FiMessageCircle,
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onLoginSubmit = async (data: LoginValues) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      window.location.href = "/chats";
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupValues) => {
    setIsLoading(true);

    try {
      const { error: signUpError, data: authData } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: {
            data: {
              display_name: data.name,
              phone_number: data.phone,
            },
          },
        }
      );

      if (signUpError) throw new Error(signUpError.message);

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          display_name: data.name,
          phone_number: data.phone,
        });

        if (profileError) throw new Error(profileError.message);

        toast({
          title: "Account created successfully",
          description: "You can now log in with your credentials",
        });

        window.location.href = "/chats";
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <motion.div
          className="flex flex-col items-center space-y-4 text-center"
          variants={fadeIn}
        >
          <motion.div
            className="rounded-full bg-white p-4 shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMessageCircle className="h-8 w-8 text-purple-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Welcome to Periskon</h1>
          <p className="text-white/80">
            Connect with friends and family instantly
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/20 rounded-lg p-1">
            <TabsTrigger
              value="login"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-500"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-500"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="backdrop-blur-lg bg-white/10 border-none">
                <CardHeader>
                  <CardTitle className="text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-white/70">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiMail className="absolute left-3 top-3 text-white/40" />
                                <Input
                                  placeholder="you@example.com"
                                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiLock className="absolute left-3 top-3 text-white/40" />
                                <Input
                                  type="password"
                                  placeholder="••••••"
                                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-white text-purple-500 hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="signup">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="backdrop-blur-lg bg-white/10 border-none">
                <CardHeader>
                  <CardTitle className="text-white">Create Account</CardTitle>
                  <CardDescription className="text-white/70">
                    Enter your details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signupForm}>
                    <form
                      onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiUser className="absolute left-3 top-3 text-white/40" />
                                <Input
                                  placeholder="John Doe"
                                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiMail className="absolute left-3 top-3 text-white/40" />
                                <Input
                                  placeholder="you@example.com"
                                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiPhone className="absolute left-3 top-3 text-white/40" />
                                <Input
                                  placeholder="+1234567890"
                                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiLock className="absolute left-3 top-3 text-white/40" />
                                <Input
                                  type="password"
                                  placeholder="••••••"
                                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-300" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-white text-purple-500 hover:bg-white/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Sign Up"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
