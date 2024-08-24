import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import "../assets/scss/style.scss";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Importing jwt-decode

const navigationAdmin = [
  {
    title: "Dashboard",
    href: "/starter",
    icon: "bi bi-browser-edge",
  },
  {
    title: "Barang",
    href: "/data-barang",
    icon: "bi bi-book",
  },
  {
    title: "Tipe Barang",
    href: "/tipe-barang",
    icon: "bi bi-bag",
  },
  {
    title: "User",
    href: "/user",
    icon: "bi bi-people",
  },
  {
    title: "Role",
    href: "/role",
    icon: "bi bi-person-add",
  },
];

const navigationGuru = [
  {
    title: "Dashboard",
    href: "/starter",
    icon: "bi bi-browser-edge",
  },
  {
    title: "Daftar Modul",
    href: "/modul",
    icon: "bi bi-book",
  },
  {
    title: "Daftar Siswa",
    href: "/siswa",
    icon: "bi bi-people",
  },
  {
    title: "Type Barang",
    href: "/tipe-barang",
    icon: "bi bi-bag",
  },
];

const navigationSiswa = [
  {
    title: "Dashboard",
    href: "/starter",
    icon: "bi bi-browser-edge",
  },
  {
    title: "Daftar Modul",
    href: "/modul",
    icon: "bi bi-book",
  },
  {
    title: "Daftar Siswa",
    href: "/siswa",
    icon: "bi bi-people",
  },
  {
    title: "Type Barang",
    href: "/tipe-barang",
    icon: "bi bi-bag",
  },
];

const Sidebar = () => {
  const [navigation, setNavigation] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRoleId(decoded.role_id);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  useEffect(() => {
    if (roleId == 1) {
      setNavigation(navigationAdmin);
    } else if (roleId == 2) {
      setNavigation(navigationGuru);
    } else if (roleId == 3) {
      setNavigation(navigationSiswa);
    }
  }, [roleId]);

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={showMobilemenu}
          />
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "text-primary nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon} />
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
