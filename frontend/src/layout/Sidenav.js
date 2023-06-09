import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
	AiOutlineHome,
	AiFillHome,
	AiOutlineMessage,
	AiFillMessage,
	AiOutlineUser
} from "react-icons/ai";

import { RiSearchLine, RiSearchFill } from "react-icons/ri";

const userId = decodeURIComponent(document.cookie)
	.split(";")
	.find((x) => x.trim().split("=")[0] === "userId")
	.split("=")[1];

const WIDTH = Object.freeze({
	full: 320,
	half: 80
});

const navItems = [
	{
		label: "Home",
		path: "/",
		icon: AiOutlineHome,
		iconSelected: AiFillHome,
		width: WIDTH.full
	},
	{
		label: "Chat",
		path: "/message",
		icon: AiOutlineMessage,
		iconSelected: AiFillMessage,
		width: WIDTH.half
	},
	{
		label: "Search",
		path: "#",
		icon: RiSearchLine,
		iconSelected: RiSearchFill,
		width: WIDTH.full
	},
	{
		label: "Profile",
		path: `/${userId}`,
		icon: AiOutlineUser,
		width: WIDTH.full
	}
];

navItems.forEach((navItem, index) => {
	navItem.id = index;
});

function Sidenav() {
	const [width, setWidth] = useState(WIDTH.full);
	const [selectedId, setSelectedId] = useState(0);

	const navItemOnClickHandler = (navItem) => {
		setWidth(navItem.width);
		setSelectedId(navItem.id);
	};

	return (
		<div className="sidenav-layout">
			<div className="sidenav" style={{ width }}>
				<h1
					style={{
						visibility: width === WIDTH.full ? "visible" : "hidden"
					}}
				>
					Aether
				</h1>
				<ul>
					{navItems.map((navItem) => (
						<li key={navItem.id}>
							<Link
								to={navItem.path}
								onClick={() => {
									navItemOnClickHandler(navItem);
								}}
							>
								<div
									style={{
										fontWeight: selectedId === navItem.id ? "bold" : "normal"
									}}
								>
									{navItem.iconSelected && selectedId === navItem.id ? (
										<navItem.iconSelected className="sidenav-icon" />
									) : (
										<navItem.icon className="sidenav-icon" />
									)}
									{width === WIDTH.full ? navItem.label : ""}
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<Outlet />
		</div>
	);
}

export default Sidenav;
