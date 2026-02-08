import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBox, FaClipboardList, FaChartBar, FaUsers, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { useMessages } from "../context/MessageContext"; // ⭐ NEW

const Sidebar = () => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalUnread } = useMessages(); // ⭐ GET UNREAD COUNT

  const submenuItems = [
    {
      title: "Products",
      icon: <FaBox />,
      submenu: [
        { label: "List", to: "/products/list" },
        { label: "Category Management", to: "/products/category" },
        { label: "Subcategory Management", to: "/products/subcategory" },
      ],
    },
    {
      title: "Orders",
      icon: <FaClipboardList />,
      submenu: [{ label: "List", to: "/orders/list" }],
    },
    {
      title: "Analytics and Reporting",
      icon: <FaChartBar />,
      submenu: [{ label: "Sales Report", to: "/report/sales" }],
    },
    {
      title: "Messages",
      icon: <FaUsers />,
      submenu: [{ label: "List", to: "/users/list" }],
    },
  ];

  useEffect(() => {
    const currentRoute = location.pathname;
    submenuItems.forEach((item, index) => {
      const isActive = item.submenu.some((submenuItem) => submenuItem.to === currentRoute);
      if (isActive) setOpenSubmenu(index);
    });
  }, [location.pathname]);

  const toggleDropdown = (index) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-[18%] min-h-screen border-r-2 bg-white">
      <div className="flex flex-col gap-4 pt-6 pl-[10%] text-[15px]">
        {submenuItems.map((item, index) => (
          <div key={index} className="relative">
            <button
              className="flex items-center justify-between w-full border border-gray-300 px-3 py-2 rounded-l bg-white"
              onClick={() => toggleDropdown(index)}
            >
              <div className="flex items-center gap-3 relative">
                {item.icon}
                <p className="hidden md:block">{item.title}</p>

                {/* 🔴 UNREAD BADGE */}
                {item.title === "Messages" && totalUnread > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-[2px] rounded-full">
                    {totalUnread}
                  </span>
                )}
              </div>
              <span>{openSubmenu === index ? <FaAngleUp /> : <FaAngleDown />}</span>
            </button>

            {openSubmenu === index && (
              <div className="mt-1 bg-white border border-gray-300 rounded shadow-lg w-full">
                {item.submenu.map((submenuItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    className="block px-3 py-2 text-gray-800 hover:bg-gray-100"
                    to={submenuItem.to}
                  >
                    {submenuItem.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
