'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import { IoCartOutline, IoHeartOutline } from 'react-icons/io5';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCart } from '@/app/Component/CreateContext';
import { useRouter } from 'next/navigation';

const navBar = [
  { name: 'Home', link: '/' },
  { name: 'Shop', link: '/Shop' },
  { name: 'About', link: '/About' },
  { name: 'Contact', link: '/Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isFocused, setIsFocused] = useState(false);
  const { cartItemCount } = useCart();
  const isHomePage = pathname === '/';
  const trackPage = pathname === '/ShipmentPage';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // ✅ Fix: Properly updating the search query in the URL
  const updateSearchQuery = (query: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (query.trim()) {
      newParams.set("search", query);
    } else {
      newParams.delete("search");
    }
    router.replace(`?${newParams.toString()}`, { scroll: false }); // Update URL
  };

  // ✅ Fix: Separating search handling function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Shop?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/Shop'); // Reset to all products if empty
    }
  };

  return (
    <div>
      <nav
        className={`relative flex h-[100px] ${
          trackPage ? 'bg-gray-900 text-white' : isHomePage ? 'bg-mainColor' : 'bg-white'
        } items-center px-4 lg:px-32 justify-between md:justify-end`}
      >
        {/* Mobile Layout: Menu Icon */}
        <div className="md:hidden flex items-center z-20">
          <button className="text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex w-[530px] h-[24px] gap-12 font-medium z-10">
          {navBar.map((navItem, index) => (
            <li key={index}>
              <Link href={navItem.link} className="hover:text-secondaryColor">
                {navItem.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Layout: Icons */}
        <div className="hidden md:flex gap-6 z-10">
          <Link href={'/Account'}>
            <BsPerson className="text-[24px]" />
          </Link>
          <div className="relative flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
  <input
    type="text"
    value={searchQuery}
    className={`transition-all rounded-sm duration-300 ${isFocused ? 'border-[1px] border-black/70 w-[200px] px-2' : 'w-0'}`}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      updateSearchQuery(e.target.value);
    }}
    placeholder="Search products..."
  />
  <button type="submit">
    <CiSearch
      className="text-[24px] cursor-pointer"
      onClick={() => {
        setIsFocused(!isFocused);
        setSearchQuery(""); // Clear input field
      }}
    />
  </button>
</form>

          </div>
          <Link href={'/wishlist'}>
            <IoHeartOutline className="text-[24px]" />
          </Link>
          <Link href="/Cart" className="relative">
            <IoCartOutline className="text-[24px]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Dropdown Menu for Mobile */}
        {isMenuOpen && (
          <div className="absolute top-[100px] left-0 w-full bg-mainColor backdrop-blur-md p-4 z-30 shadow-lg md:hidden">
            <ul className="flex flex-col gap-4 font-medium">
              {navBar.map((navItem, index) => (
                <li key={index}>
                  <Link
                    href={navItem.link}
                    className="hover:text-secondaryColor"
                    onClick={() => setIsMenuOpen(false)} // Close menu on click
                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
