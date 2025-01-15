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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./context/AuthProvider";

export default function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gpa, setGpa] = useState("");
    const [admin, setAdmin] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useAuth();

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:3000/signup', {
                username: name,
                email: email,
                password: password,
                gpa: parseInt(gpa), 
                isAdmin: admin
            }, {
                withCredentials: true
            });

            if(response.data.success) {
                const {token, user} = response.data;
                Cookies.set('token',token,{ expires: 7, secure: true });
                Cookies.set('user',user._id,{ expires: 7, secure: true });
                Cookies.set('admin',user.admin,{ expires: 7, secure: true });
                setUser(user);
                navigate('/',{replace:true})
            }
        } catch (error) {
            console.log('Error' , error)
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="gpa">GPA</Label>
              <Input 
                id="gpa" 
                type="number" 
                step="1" 
                min="0" 
                max="10" 
                placeholder="Your GPA" 
                value={gpa} 
                onChange={(e) => setGpa(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="admin" 
                checked={admin} 
                onCheckedChange={(checked) => setAdmin(checked as boolean)}
              />
              <Label htmlFor="admin">Is Admin</Label>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => navigate('/login')} variant="outline">Login Page</Button>
        <Button onClick={handleSignup}>Sign Up</Button>
      </CardFooter>
    </Card>
    </div>
  );
}

