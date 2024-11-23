import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FaBell, FaSearch, FaEthereum, FaUserCircle } from 'react-icons/fa';

export default function AdminNavbar(props) {
	const [scrolled, setScrolled] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const { secondary, message, brandText } = props;

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('navy.700', 'white');
	let secondaryText = useColorModeValue('gray.700', 'white');
	let navbarPosition = 'fixed';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let gap = '0px';
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	return (
		<nav className="flex items-center justify-between backdrop-blur-sm shadow-lg p-4 rounded-lg mt-4 mx-8">
			<div className="flex items-center space-x-4">
				<a href="#" className="text-xl font-semibold text-gray-800">Trang quản lí</a>
			</div>
			<div className="flex items-center space-x-4">
				<div className="relative">
					<input
						type="text"
						placeholder="Search..."
						className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
					/>
					<FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				</div>
				<FaBell className="text-gray-500 text-xl cursor-pointer" />
				<div className="flex items-center bg-gray-200 p-2 rounded-full">
					<FaEthereum className="text-gray-700" />
					<span className="ml-2 font-semibold text-gray-700">1,924 ETH</span>
				</div>
				<div className="relative">
					<FaUserCircle className="text-gray-700 text-2xl cursor-pointer" onClick={toggleDropdown} />
					{dropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
							<a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile Settings</a>
							<a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Newsletter Settings</a>
							<a href="#" className="block px-4 py-2 text-red-600 hover:bg-gray-200">Log out</a>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}

AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	onOpen: PropTypes.func
};
