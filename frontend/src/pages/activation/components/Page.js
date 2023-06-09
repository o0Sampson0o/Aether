import React, { useEffect, useState, useRef } from "react";
import { getReq } from "../../../utils/request";
import { Link, useParams } from "react-router-dom";
import "../activation.css";

function Page() {
	const called = useRef(false);
	const [message, setMessage] = useState("Your account is activating...");
	const { session } = useParams();
	console.log(session);
	useEffect(() => {
		if (!called.current) {
			getReq(`/api/signup/activate/${session}`).then((result) => {
				if (result.error) {
					setMessage("Some error have occurred, your account is not activated");
				} else if (result.invalid) {
					setMessage("This link is either expired or invalid");
				} else {
					setMessage("Your account is activated");
				}
			});
			called.current = true;
		}
	}, []);

	return <div id="activation-page-container">{message}</div>;
}

export default Page;
