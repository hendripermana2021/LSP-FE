import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Col,
  Row,
} from "react-bootstrap";
import { Button, ButtonGroup } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import $ from "jquery";
import "datatables.net-dt";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import axios from "axios";
import serverDev from "../../Server";
import OwlCarousel from "react-owl-carousel";
import { jwtDecode } from "jwt-decode";
import FormInputBarang from "./forms/FormInputBarang";
import UpdateDataBarang from "./forms/UpdateDataBarang";
import DetailStuff from "./forms/DetailStuffs";

const StuffTables = () => {
  const [stuff, setStuff] = useState([]);
  const [nameStuff, setNameStuff] = useState("");
  const [price, setPrice] = useState("");
  const [type_stuff, setType_stuff] = useState("");
  const [disc, setDisc] = useState("");
  const [image, setImage] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [modulSiswa, setModulSiswa] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    // DataTable initialization
    if (!$.fn.DataTable.isDataTable("#tablesstuff")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tablesstuff").is(":visible")) {
            clearInterval(tableInterval);
            $("#tablesstuff").DataTable();
          }
        }, 1000);
      });
    }

    // Fetch module data
    getStuff();

    // Decode JWT token and set roleId
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

  const getStuff = async () => {
    try {
      const response = await axios.get(`${serverDev}stuff`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setStuff(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching modul data:", error);
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(stuff.map((modul) => modul.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, modulId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, modulId]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== modulId)
      );
    }
  };

  const deleteStuff = async (stuff) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${serverDev}stuff/delete/${stuff.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          });
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          getStuff();
        } catch (error) {
          console.error("Error deleting stuff data:", error);
          Swal.fire("Error!", "Your file has not been deleted.", "error");
        }
      }
    });
  };

  const deleteSelectedstuff = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("No selection", "Please select stuff(s) to delete", "info");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedRows.map(async (stuffId) => {
              await axios.delete(`${serverDev}stuff/delete/${stuffId}`, {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                  )}`,
                },
              });
            })
          );
          Swal.fire(
            "Deleted!",
            "The selected stuff(s) have been deleted.",
            "success"
          );
          getStuff();
          setSelectedRows([]);
        } catch (error) {
          console.error("Error deleting stuff data:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the selected stuff(s).",
            "error"
          );
        }
      }
    });
  };

  const CardCarousel = () => {
    const options = {
      margin: 10,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3000,
      smartSpeed: 500,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    };

    return (
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi bi-bell me-2"> </i>
          Data Barang
        </CardTitle>
        <CardBody>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            dibawah ini adalah Data barang aktif dijual
            <br />
            <br />
            <br />
          </CardSubtitle>
          <Row>
            <Col>
              <OwlCarousel className="owl-theme" {...options}>
                {modulSiswa.map((modul, index) => (
                  <div className="item" key={index}>
                    <Card>
                      <Card.Img
                        variant="top"
                        src={modul.image}
                        style={{
                          width: "100%",
                          height: "15em",
                          objectFit: "cover",
                        }}
                        alt={`Slide ${index + 1}`}
                      />
                      <Card.Body>
                        <Card.Title>{modul.title}</Card.Title>
                        <Card.Text>{modul.subtitle}</Card.Text>
                        <DropdownButton
                          as={ButtonGroup}
                          key="end"
                          id="dropdown-button-drop-end"
                          drop="end"
                          variant="secondary"
                        >
                          {/* <DetailModulForSiswa modul={modul} /> */}
                        </DropdownButton>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </OwlCarousel>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  };

  return (
    <div>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi bi-book me-3"></i>
          Tabel Data Barang
        </CardTitle>

        <CardBody>
          <Row>
            <Col>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Jumlah Barang
              </CardSubtitle>
            </Col>
            <Col className="text-end">
              <ButtonGroup aria-label="Basic example">
                <FormInputBarang />
                <Button
                  variant="danger"
                  onClick={deleteSelectedstuff}
                  disabled={selectedRows.length === 0}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </Col>
          </Row>

          <Table className="table table-hover" id="tablemodul" responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === stuff.length && stuff.length > 0
                    }
                  />
                </th>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Deskripsi Barang</th>
                <th>Jumlah Unit</th>
                <th>Price</th>
                <th>Tipe Stuff</th>
                <th>Diskon</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td>Loading...</td>
                </tr>
              ) : stuff.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center">
                    No Datang Barang Available
                  </td>
                </tr>
              ) : (
                stuff.map((stuffs, index) => (
                  <tr key={stuffs.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(stuffs.id)}
                        onChange={(e) => handleSelectRow(e, stuffs.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{stuffs.name_stuff}</td>
                    <td>{stuffs.deskripsi}</td>
                    <td>{stuffs.qty}</td>
                    <td>{stuffs.price}</td>
                    <td>{stuffs.type.name_type}</td>
                    <td>{stuffs.disc}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                      >
                        <DetailStuff stuffprops={stuffs} />
                        <UpdateDataBarang stuffprops={stuffs} />
                        <button
                          className="dropdown-item"
                          onClick={() => deleteStuff(stuff)}
                        >
                          <i className="ti-trash menu-icon me-2"></i>
                          Delete
                        </button>
                      </DropdownButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default StuffTables;
