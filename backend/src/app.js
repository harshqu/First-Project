import express from 'express'
import { loginUser, logout, registerUser } from './controllers/usercontroller.js';
import { isAuthenticated,isAdmin } from './middleware/auth.js';
import { addCompanies,apply,getAppliedCompanies,fetchCompanyData } from './controllers/dashboardcontroller.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.post('/signup',registerUser);
app.post('/login',loginUser);
app.post('/logout',isAuthenticated,logout);

app.post('/addCompanies',isAuthenticated,isAdmin,addCompanies);
app.get('/fetchData',isAuthenticated,fetchCompanyData);
app.get('/appliedData',isAuthenticated,getAppliedCompanies);

export {app};