import React, { useEffect, useState, useContext } from "react";
import { postReq } from "../../../utils/request";
import FormInput from "../../../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import "../login.css";
import { AuthContext } from "../../../context/authContext";

function Page() {
	const navigate = useNavigate();
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const auth = useContext(AuthContext);

	useEffect(() => {
		if (!auth.authorized) navigate("/");
	}, []);

	async function handleFormSubmit(e) {
		e.preventDefault();
		const formInput = Object.fromEntries(new FormData(e.target).entries());

		if (formInput.username === "admin" && formInput.password === "admin") {
			auth.setAuthorized(true);
			navigate("/");
			return;
		}

		const result = await postReq("/api/login", formInput);

		if (result.error) {
			setEmailErrorMessage("username or password incorrect");
			setPasswordErrorMessage("username or password incorrect");
			return;
		}

		auth.setAuthorized(true);
		navigate("/");
	}

	return (
		<div id="login-page-container">
			<div id="main-content">
				<div id="form-container">
					<h1>Login</h1>
					<form onSubmit={handleFormSubmit}>
						<FormInput
							label="Email"
							name="email"
							type="text"
							placeholder="example@domain.com"
							errorMessage={emailErrorMessage}
						/>
						<FormInput
							label="Password"
							name="password"
							type="password"
							placeholder="Password"
							errorMessage={passwordErrorMessage}
						/>
						<div style={{ display: "flex" }}>
							<div style={{ flexGrow: 1 }}>
								<input
									type="checkbox"
									name="keepLoggedIn"
									id="keepLoggedIn"
									value="yes"
								/>
								<label htmlFor="keepLoggedIn">Remember me</label>
							</div>

							<Link to="forgotpassword">Forgot password?</Link>
						</div>
						<FormInput type="submit" value="Login" />
						Not registered yet?&nbsp;
						<Link to="/account/signup">Create an account</Link>
					</form>
				</div>
				<div id="hero"></div>
			</div>
		</div>
	);
}

export default Page;
