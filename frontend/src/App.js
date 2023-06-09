import SideNav from "./layout/Sidenav";
import LoginPage from "./pages/login/index";
import SignupPage from "./pages/signup/index";
import ActivationPage from "./pages/activation/index";
import HomePage from "./pages/home/index";
import ProfilePage from "./pages/profile/index";
import MessagePage from "./pages/message/index";
import { getReq } from "./utils/request";
import { useCookies } from "react-cookie";
import { useState, useEffect, useRef } from "react";
import { AuthContext } from "./context/authContext";
import { BlockUIContext } from "./context/blockUIContext";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";

function App() {
	const [blockUI, setBlockUI] = useState(true);
	const [authorized, setAuthorized] = useState(false);
	const [cookies] = useCookies(["sessionId", "userId"]);
	const requested = useRef(false);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={authorized ? <SideNav /> : null}>
				<Route index element={authorized ? <HomePage /> : <LoginPage />} />
				<Route path="account">
					<Route path="login" element={<LoginPage />} />
					<Route path="signup" element={<SignupPage />} />
					<Route path="activation/:session" element={<ActivationPage />} />
				</Route>
				<Route path="/message" element={<MessagePage />} />
				<Route path="/:userId" element={<ProfilePage />} />
			</Route>
		)
	);

	useEffect(() => {
		if (!requested.current) {
			setBlockUI(true);
			getReq(`/api/login/session/${cookies.sessionId}/${cookies.userId}`).then((result) => {
				setAuthorized(result.authorized);
				setBlockUI(false);
			});
			requested.current = true;
		}
	});

	return (
		<>
			{blockUI && <div id="UIBlocker">Loading...</div>}
			<AuthContext.Provider value={{ setAuthorized, authorized: authorized || false }}>
				<BlockUIContext.Provider value={setBlockUI}>
					<RouterProvider router={router} />
				</BlockUIContext.Provider>
			</AuthContext.Provider>
		</>
	);
}

export default App;
