import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Nav,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
  NavbarBrand,
} from "reactstrap";
import { ReactComponent as LogoWhite } from "../assets/images/logos/xtremelogowhite.svg";
import user1 from "../assets/images/users/user1.jpg";
import axios from "axios";
import serverDev from "../Server";
import Swal from "sweetalert2";
import { Badge } from "react-bootstrap";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState("");

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleNavbar = () => setIsOpen(!isOpen);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(`${serverDev}profile`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Logout Confirmation",
        text: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axios.delete(`${serverDev}logout`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });

        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "An error occurred while logging out. Please try again later.",
      });
    }
  };

  return (
    <>
      <Navbar color="primary" dark expand="md">
        <div className="d-flex align-items-center">
          <NavbarBrand href="/" className="d-lg-none">
            <LogoWhite />
          </NavbarBrand>
          <Button
            color="primary"
            className="d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-list"></i>
          </Button>
        </div>
        <div className="hstack gap-2">
          <Button
            color="primary"
            size="sm"
            className="d-sm-block d-md-none"
            onClick={toggleNavbar}
          >
            {isOpen ? (
              <i className="bi bi-x"></i>
            ) : (
              <i className="bi bi-three-dots-vertical"></i>
            )}
          </Button>
        </div>

        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar>
            {/* Navigation items can go here */}
          </Nav>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="primary">
              <img
                src={user1}
                alt="profile"
                className="rounded-circle"
                width="30"
              />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>
                {profile.email}
                {profile.role_id === "1" ? (
                  <Badge bg="primary">Admin</Badge>
                ) : profile.role_id === "2" ? (
                  <Badge bg="success">Guru</Badge>
                ) : (
                  <Badge bg="secondary">Siswa</Badge>
                )}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Collapse>
      </Navbar>
      {/* UpdateProfile Modal */}
    </>
  );
};

export default Header;
