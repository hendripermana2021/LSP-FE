import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";

import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import $ from "jquery";
import "jquery/dist/jquery.min.js";
import serverDev from "../../Server";

import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "react-bootstrap";
import FormInputGuru from "./forms/FormInputGuru";
import DetailGuru from "./forms/DetailGuru";
import UpdateDataGuru from "./forms/UpdateDataGuru";

const GuruTables = () => {
  const [Guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tableguru")) {
      $(document).ready(function () {
        const tableInterval = setInterval(() => {
          if ($("#tableguru").is(":visible")) {
            clearInterval(tableInterval);
            $("#tableguru").DataTable();
          }
        }, 1000);
      });
    }

    getGuru();
  }, []);

  const getGuru = async () => {
    try {
      const response = await axios.get(`${serverDev}guru`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setGuru(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room data:", error);
      setLoading(false);
    }
  };

  const deleteGuru = async (guru) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want delete this data ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios
            .delete(`${serverDev}guru/delete/${guru.id}`, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "accessToken"
                )}`,
              },
            })
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              getGuru();
            });
        } catch (error) {
          console.error("Error deleting room data:", error);
          console.log(guru.id);
          Swal.fire("Error!", "Your file has not been deleted.", "error");
        }
      }
    });
  };

  return (
    <div>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi bi-bell me-2"> </i>
          Tabel Guru
        </CardTitle>
        <CardBody>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Jumlah Guru
          </CardSubtitle>
          <FormInputGuru />
          <Table className="table table-hover" id="tableguru" responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Guru</th>
                <th>Jenis Kelamin</th>
                <th>Bidang Pendidikan</th>
                <th>Pendidikan</th>
                <th>Email</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">Loading...</td>
                </tr>
              ) : Guru.length === 0 ? (
                <tr>
                  <td colSpan="8">No Data Siswa available</td>
                </tr>
              ) : (
                Guru.map((Gurus, index) => (
                  <tr key={index}>
                    <td>U {index + 1}</td>
                    <td>
                      {Gurus.name_guru}{" "}
                      {Gurus.role_id === "1" ? (
                        <Badge bg="primary">Admin</Badge>
                      ) : (
                        <Badge bg="success">Guru</Badge>
                      )}
                    </td>
                    <td>
                      {Gurus.sex === "L" ? (
                        <Badge bg="primary">Laki Laki</Badge>
                      ) : (
                        <Badge bg="success">Perempuan</Badge>
                      )}
                    </td>
                    <td>{Gurus.bid_pendidikan}</td>
                    <td>{Gurus.pendidikan}</td>
                    <td>{Gurus.email}</td>
                    <td>{Gurus.real_password}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                      >
                        <DetailGuru guruprops={Gurus} />
                        <UpdateDataGuru teacher={Gurus} />

                        <button
                          className="dropdown-item"
                          onClick={() => deleteGuru(Gurus)}
                        >
                          <i className="ti-trash menu-icon me-2" />
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

export default GuruTables;
