"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignInPage() {
  const [showPass, setShowPass] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Registration failed.");
          setLoading(false);
          return;
        }
        toast.success("Account created! Signing you in...");
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (signInRes?.error) {
          toast.error(signInRes.error);
        } else {
          router.push(callbackUrl);
        }
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
        setLoading(false);
        return;
      }
      toast.success("Signed in!");
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-medium text-stone-900">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-stone-400 mt-2">
            {isSignUp ? "Join us today" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label className="text-xs text-stone-500">Name</Label>
              <Input
                className="rounded-none mt-1"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <Label className="text-xs text-stone-500">Email</Label>
            <Input
              type="email"
              className="rounded-none mt-1"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-xs text-stone-500">Password</Label>
            <div className="relative mt-1">
              <Input
                type={showPass ? "text" : "password"}
                className="rounded-none pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {!isSignUp && (
              <div className="text-right mt-1">
                <Link href="/auth/forgot-password" className="text-xs text-stone-400 hover:text-stone-900">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-none w-full h-12 bg-stone-900 hover:bg-stone-800 text-white"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-stone-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-stone-900 underline underline-offset-2"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-stone-400">or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="rounded-none w-full h-12 border-stone-200"
          onClick={() => signIn("google", { callbackUrl })}
        >
          <Mail className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
