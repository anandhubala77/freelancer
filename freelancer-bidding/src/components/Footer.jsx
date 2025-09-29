import React from "react";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Logo and description */}
          <div className="flex flex-col items-start space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <Logo/>
            </div>
            <p className="text-gray-600 max-w-sm">
              Making the world a better place through constructing elegant hierarchies.
            </p>

            {/* Social icons */}
            <div className="flex gap-4 text-gray-600">
              <FaFacebook className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
              <FaInstagram className="w-5 h-5 hover:text-pink-600 cursor-pointer" />
              <FaXTwitter className="w-5 h-5 hover:text-black cursor-pointer" />
              <FaYoutube className="w-5 h-5 hover:text-red-600 cursor-pointer" />
            </div>
          </div>

          {/* Footer links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="text-gray-900 font-semibold">Solutions</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#">Marketing</a></li>
                <li><a href="#">Analytics</a></li>
                <li><a href="#">Automation</a></li>
                <li><a href="#">Commerce</a></li>
                <li><a href="#">Insights</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-gray-900 font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#">Submit ticket</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Guides</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-gray-900 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Jobs</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-gray-900 font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#">Terms of service</a></li>
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">License</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-8 text-center text-xs text-gray-500">
          © 2025 FreelanceBid, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
