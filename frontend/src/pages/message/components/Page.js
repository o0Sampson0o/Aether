import React, { useEffect, useState, useContext } from "react";
import { postReq } from "../../../utils/request";
import FormInput from "../../../components/FormInput";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import "../message.css";
import { AuthContext } from "../../../context/authContext";

function Page() {
	const navigate = useNavigate();
	const authorized = useContext(AuthContext).authorized;

	useEffect(() => {
		console.log(authorized);
		if (!authorized) {
			navigate("/account/login");
		}
	}, []);

	return (
		<div id="message-page-container">
			<Sidebar>
				<div id="main-content">
					
				</div>
			</Sidebar>
		</div>
	);
}

export default Page;
