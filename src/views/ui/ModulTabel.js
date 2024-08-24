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
import { Badge, Button, ButtonGroup } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import $ from "jquery";
// import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-dt";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import axios from "axios";
import serverDev from "../../Server";
import FormInputModal from "./forms/FormInputModul";
import UpdateDataModul from "./forms/UpdateDataModul";
import DetailModul from "./forms/DetailModul";
import OwlCarousel from "react-owl-carousel";
import { jwtDecode } from "jwt-decode";
import DetailModulForSiswa from "./forms/DetailModulForSiswa";

const ModulTables = () => {
  const [modulList, setModulList] = useState([]);
  const [modulSiswa, setModulSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    // DataTable initialization
    if (!$.fn.DataTable.isDataTable("#tablemodul")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tablemodul").is(":visible")) {
            clearInterval(tableInterval);
            $("#tablemodul").DataTable();
          }
        }, 1000);
      });
    }

    // Fetch module data
    getModul();
    getModulSiswa();

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

  const getModul = async () => {
    try {
      const response = await axios.get(`${serverDev}modul`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setModulList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching modul data:", error);
      setLoading(false);
    }
  };

  const getModulSiswa = async () => {
    try {
      const response = await axios.get(`${serverDev}modul/siswa`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setModulSiswa(response.data.data);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching modul data:", error);
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(modulList.map((modul) => modul.id));
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

  const deleteModul = async (modul) => {
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
          await axios.delete(`${serverDev}modul/delete/${modul.id}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          });
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          getModul();
        } catch (error) {
          console.error("Error deleting modul data:", error);
          Swal.fire("Error!", "Your file has not been deleted.", "error");
        }
      }
    });
  };

  const deleteSelectedModul = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("No selection", "Please select modul(s) to delete", "info");
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
            selectedRows.map(async (modulId) => {
              await axios.delete(`${serverDev}modul/delete/${modulId}`, {
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
            "The selected modul(s) have been deleted.",
            "success"
          );
          getModul();
          setSelectedRows([]);
        } catch (error) {
          console.error("Error deleting modul data:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the selected modul(s).",
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
          Modul Pembelajaran
        </CardTitle>
        <CardBody>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Dibawah adalah materi yang diberikan oleh para guru, mohon untuk
            dipelajari
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
                          <DetailModulForSiswa modul={modul} />
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
      {roleId == 1 || roleId == 2 ? (
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-book me-3"></i>
            Tabel Modul
          </CardTitle>
          <CardBody>
            <ButtonGroup aria-label="Basic example">
              <FormInputModal />
              <Button
                variant="danger"
                onClick={deleteSelectedModul}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            </ButtonGroup>
            <br />
            <br />
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              Jumlah Modul
            </CardSubtitle>

            <Table className="table table-hover" id="tablemodul" responsive>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedRows.length === modulList.length &&
                        modulList.length > 0
                      }
                    />
                  </th>
                  <th>No</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Assigned For</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td>Loading...</td>
                  </tr>
                ) : modulList.length === 0 ? (
                  <tr>
                    <td>No Modul available</td>
                  </tr>
                ) : (
                  modulList.map((modul, index) => (
                    <tr key={modul.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(modul.id)}
                          onChange={(e) => handleSelectRow(e, modul.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{modul.title}</td>
                      <td>
                        {
                          (modul.status_post = "Active" ? (
                            <Badge bg="success">Active</Badge>
                          ) : (
                            <Badge bg="danger">Unactive</Badge>
                          ))
                        }
                      </td>
                      <td>
                        {modul.for_class == "X" ? (
                          <Badge bg="primary">Kelas X</Badge>
                        ) : modul.for_class == "XI" ? (
                          <Badge bg="success">Kelas XI</Badge>
                        ) : (
                          <Badge bg="secondary">Kelas XII</Badge>
                        )}
                      </td>
                      <td>
                        <DropdownButton
                          as={ButtonGroup}
                          key="end"
                          id="dropdown-button-drop-end"
                          drop="end"
                          variant="secondary"
                        >
                          <DetailModul modul={modul} />
                          <UpdateDataModul modul={modul} />
                          <button
                            className="dropdown-item"
                            onClick={() => deleteModul(modul)}
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
      ) : (
        <CardCarousel />
      )}
    </div>
  );
};

export default ModulTables;
