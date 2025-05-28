"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import instance from "@/lib/axios";
import { auth_schema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import {  useRouter } from "next/navigation";

type AuthSchema = z.infer<typeof auth_schema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  type LoginErrorType = string | { msg?: string } | { msg?: string }[] | null;
  const [loginError, setLoginError] = useState<LoginErrorType>("");

  const form = useForm<AuthSchema>({
    resolver: zodResolver(auth_schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
const router = useRouter()
  const { setError } = form;
  const onSubmit = async (data: AuthSchema) => {
    setIsLoading(true);
    try {
      const res = await instance.post("/auth/login", data);
      Cookies.set("token", res.data.data.token, {
        expires: 30,
        secure: true,
        sameSite: "lax",
      });
      router.push('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const messages = err.response?.data?.message;
        setLoginError(messages);
        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            if (msg.type === "field" && msg.path && msg.msg) {
              setError(msg.path, { message: msg.msg });
            }
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loginError) {
      if (typeof loginError === "string") {
        toast.error(loginError);
      } else if (Array.isArray(loginError)) {
        loginError.forEach((err) => {
          if (err.msg) toast.error(err.msg);
        });
      } else if (typeof loginError === "object" && loginError?.msg) {
        toast.error(loginError.msg);
      }
      setLoginError(null);
    }
  }, [loginError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your username below to login to your account
          </p>
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  {...field}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
    </Form>
  );
}
