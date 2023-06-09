import React, { useState, useEffect, useRef } from "react";

function FormInput({ errorMessage, name, label, ...rest }) {
	return (
		<div className="form-input">
			<div>
				{label && <label htmlFor={name}>{label}</label>}
				<span className="form-error-message">{errorMessage}</span>
			</div>
			<input name={name} id={name} {...rest} />
		</div>
	);
}

export default FormInput;
