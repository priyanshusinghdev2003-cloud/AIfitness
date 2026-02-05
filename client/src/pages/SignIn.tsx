import SoftBackdrop from "@/components/SoftBackdrop";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function SignIn() {
  const [state, setState] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleAuthSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("clicked");

    if (state == "login") {
      if (!email || !password) {
        return toast.error("Please fill all the fields");
      }
    } else {
      if (!username || !email || !password) {
        return toast.error("Please fill all the fields");
      }
    }

    setIsSubmitting(true);
    try {
      if (state === "login") {
        login({ email, password });
        toast.success("Login successful");
        navigate("/");
      } else {
        console.log("clicked");
        signup({ username, email, password });
        toast.success("Signup successful");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  const { login, signup, user } = useAppContext();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <SoftBackdrop />
      <Card className="w-full max-w-sm dark:bg-green-400/2 ">
        <CardHeader>
          <CardTitle>
            {state === "login" ? "Login to your account" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {state === "login"
              ? "Enter your email below to login to your account"
              : "Enter your email below to sign up for an account"}
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="cursor-pointer"
              onClick={() => setState(state === "login" ? "signup" : "login")}
            >
              {state === "login" ? "Sign Up" : "Login"}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {state !== "login" && (
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            onClick={handleAuthSubmission}
          >
            {state === "login" ? "Login" : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignIn;
