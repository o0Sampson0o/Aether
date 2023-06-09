import Home from "../pages/home/index";
import Login from "../pages/login/index";
import Signup from "../pages/signup/index";
import ForgotPassword from "../pages/ForgotPassword/index";

const routes = [
    {
        caption: "Home",
        link: "/",
        icon: "",
        Page: Home
    },
    {
        caption: "Login",
        link: "/login",
        icon: "",
        Page: Login
    },
    {
        caption: "Signup",
        link: "/signup",
        icon: "",
        Page: Signup
    },
    {
        caption: "Forgot Password",
        link: "/forgotpassword",
        icon: "",
        Page: ForgotPassword
    }
];

export default routes;
