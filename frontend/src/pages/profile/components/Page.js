import React, { useState, useContext } from "react";
import { postReq } from "../../../utils/request";
import FormInput from "../../../components/FormInput";
import { Link } from "react-router-dom";
import "../profile.css";
import { AuthContext } from "../../../context/authContext";

function Page() {
	const authorized = useContext(AuthContext).authorized;

	return <div id="profile-page-container">profile</div>;
}

export default Page;