import React, { useState } from "react";
import FormInput from "../../../components/FormInput";
import { Link } from "react-router-dom";
import "../signup.css";
import { postReq } from "../../../utils/request";

function verifyPassword(password) {
	if (password.length < 8) {
		return "password have to be at least 8 characters";
	}

	return "";
}

function Page() {
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

	async function handleFormSubmit(e) {
		e.preventDefault();
		const formInput = Object.fromEntries(new FormData(e.target).entries());
		let message;
		let haveError = false;

		message = verifyPassword(formInput.password);
		setPasswordErrorMessage(message);
		haveError = message !== "" || haveError;

		message = formInput.password !== formInput.confirmPassword ? "password does not match" : "";
		setConfirmPasswordErrorMessage(message);
		haveError = message !== "" || haveError;

		if (haveError) return;

		const result = await postReq("/api/signup", formInput);

		message = result.emailErrorMessage;
		setEmailErrorMessage(message);
		haveError = message != "" || haveError;

		if (haveError) return;

		alert("Please check your email to activate your account");
	}

	return (
		<div id="signup-page-container">
			<div id="main-content">
				<div id="form-container">
					<h1 style={{ marginBottom: 40 }}>Signup</h1>
					<form onSubmit={handleFormSubmit}>
						<FormInput
							required
							label="Username"
							name="username"
							type="text"
							placeholder="Your Name"
						/>
						<FormInput
							required
							label="Email"
							name="email"
							type="email"
							placeholder="example@domain.com"
							errorMessage={emailErrorMessage}
						/>
						<FormInput
							required
							label="Password"
							name="password"
							type="password"
							placeholder="Password"
							errorMessage={passwordErrorMessage}
						/>
						<FormInput
							required
							label="Confirm Password"
							name="confirmPassword"
							type="password"
							placeholder="Confirm Password"
							errorMessage={confirmPasswordErrorMessage}
						/>
						<FormInput type="submit" value="Signup" />
						Already have an account?&nbsp;
						<Link to="/account/login">Login</Link>
					</form>
				</div>
				<div id="hero"></div>
			</div>
		</div>
	);
}

export default Page;
