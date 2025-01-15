import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import Cookies from "js-cookie";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setUser} = useAuth();

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email: email,
                password: password,
            }, {
                withCredentials: true
            });

            if(response.data.success) {
                console.log(response.data);
                const {token, user} = response.data;
                Cookies.set('token',token,{ expires: 7, secure: true });
                Cookies.set('user',user._id,{ expires: 7, secure: true });
                Cookies.set('admin',user.admin,{ expires: 7, secure: true });
                setUser(user);
                navigate('/',{replace:true});
            }
        } catch (error) {
            console.log('Error' , error)
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => navigate('/signup')} variant="outline">SignUp</Button>
        <Button onClick={handleSignIn}>Sign In</Button>
      </CardFooter>
    </Card>
    </div>
  );
}

