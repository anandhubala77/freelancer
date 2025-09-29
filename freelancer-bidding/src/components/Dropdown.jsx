import React, { useState, useRef, useEffect } from 'react';

const Dropdown = () => {
    // State to manage whether the dropdown is open or closed
    const [isOpen, setIsOpen] = useState(false);
    // Ref to the dropdown container div to detect clicks outside
    const dropdownRef = useRef(null);
  
    // Effect to add an event listener for clicks outside the dropdown
    useEffect(() => {
      // Function to handle clicks outside the dropdown element
      const handleClickOutside = (event) => {
        // If the dropdown ref exists and the click was outside its bounds
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false); // Close the dropdown
        }
      };
  
      // Add event listener when the component mounts
      document.addEventListener('mousedown', handleClickOutside);
  
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [dropdownRef]); // Re-run effect if dropdownRef changes (shouldn't happen often)
  
    // Function to toggle the dropdown state
    const toggleDropdown = () => setIsOpen(!isOpen);
  
    // Define the menu items based on the structure in the image
    const menuItems = [
      { title: 'By skill', description: 'Looking for a freelancer with a specific skill? Start here.', href: '#' },
      { title: 'By location', description: 'Search for freelancers based on their location and timezone.', href: '#' },
      { title: 'By category', description: 'Find freelancers that suit a certain project category.', href: '#' },
    ];
  
    return (
      // Relative container for positioning the absolute dropdown panel
      // Assign the ref to this container
      <div className="relative inline-block text-left" ref={dropdownRef}>
        {/* Button to toggle the dropdown */}
        <div>
          <button
            type="button"
            // Styling for the button: flex layout, padding, borders, shadow, background, text, hover/focus states
            className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            id="options-menu-button" // ID for accessibility
            aria-expanded={isOpen} // Accessibility attribute indicating expanded state
            aria-haspopup="true"    // Accessibility attribute indicating it has a popup menu
            onClick={toggleDropdown} // Toggle dropdown on click
          >
            Hire freelancers
            {/* Downward Caret Icon */}
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
  
        {/* Dropdown panel, rendered conditionally based on isOpen state */}
        {isOpen && (
          <div
            // Styling for the dropdown panel: positioning, width, origin, background, rounded corners, shadow, ring
            className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" // Added z-index
            role="menu" // Accessibility role
            aria-orientation="vertical" // Accessibility attribute
            aria-labelledby="options-menu-button" // Accessibility attribute linking to the button
          >
            {/* Container for menu items with padding */}
            <div className="py-1" role="none">
              {/* Map through the menuItems array to create links */}
              {menuItems.map((item, index) => (
                <a
                  key={index} // Unique key for each item
                  href={item.href} // Link destination
                  // Styling for each menu item: block layout, padding, text size/color, hover states
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem" // Accessibility role
                  // Close dropdown when an item is clicked (optional, depends on desired UX)
                  // onClick={() => setIsOpen(false)}
                >
                  {/* Flex container to layout content and icon */}
                  <div className="flex justify-between items-center">
                    {/* Text content container */}
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-gray-500">{item.description}</p>
                    </div>
                    {/* Right Arrow Icon */}
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Dropdown;