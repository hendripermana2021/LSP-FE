import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import serverDev from "../../Server";
import FormInputKelas from "./forms/FormInputKelas";
import DetailKelas from "./forms/DetailKelas";
import UpdateDataKelas from "./forms/UpdateDataKelas";
import { Col, Row } from "react-bootstrap";

const ClassTable = () => {
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tableguru")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tableguru").is(":visible")) {
            clearInterval(tableInterval);
            $("#tableguru").DataTable();
          }
        }, 1000);
      });
    }
    getKelas();
    getGuru();
  }, []);

  const getKelas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverDev}class`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setKelas(response.data.data);
    } catch (error) {
      console.error("Error fetching kelas data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGuru = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverDev}guru`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setGuru(response.data.data);
    } catch (error) {
      console.error("Error fetching kelas data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(kelas.map((kelas) => kelas.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, kelasId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, kelasId]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== kelasId)
      );
    }
  };

  const deleteSelectedKelas = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("No selection", "Please select class to delete", "info");
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
            selectedRows.map(async (kelasId) => {
              await axios.delete(`${serverDev}class/delete/${kelasId}`, {
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
            "The selected class have been deleted.",
            "success"
          );
          getKelas(); // Refresh the data
          setSelectedRows([]);
        } catch (error) {
          console.error("Error deleting siswa data:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the selected siswa(s).",
            "error"
          );
        }
      }
    });
  };

  return (
    <div>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi bi-border-all me-3"></i> Tabel Kelas
        </CardTitle>
        <CardBody>
          <ButtonGroup aria-label="Basic example">
            <FormInputKelas guru={guru} />
            <button
              className="btn btn-danger"
              onClick={deleteSelectedKelas}
              disabled={selectedRows.length === 0}
            >
              Delete Selected
            </button>
          </ButtonGroup>
          <br />
          <ButtonGroup aria-label="Basic example">
            <FormInputKelas guru={guru} />
            <button
              className="btn btn-danger"
              onClick={deleteSelectedKelas}
              disabled={selectedRows.length === 0}
            >
              Delete Selected
            </button>
          </ButtonGroup>
          <br />
          <br />
          <Table className="table table-hover" id="tableguru" responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === kelas.length && kelas.length > 0
                    }
                  />
                </th>
                <th>No</th>
                <th>Nama Kelas</th>
                <th>Tingkat</th>
                <th>Wali Kelas</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11">Loading...</td>
                </tr>
              ) : kelas.length === 0 ? (
                <tr>
                  <td colSpan="11">No Data kelas available</td>
                </tr>
              ) : (
                kelas.map((kelases, index) => (
                  <tr key={kelases.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(kelases.id)}
                        onChange={(e) => handleSelectRow(e, kelases.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{kelases.name_class}</td>
                    <td>{kelases.grade_class}</td>
                    <td>{kelases.wali_kelas.name_guru}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                        title=""
                      >
                        <DetailKelas kelasprops={kelases} />
                        <UpdateDataKelas kelasprops={kelases} teachers={guru} />
                        <button
                          className="dropdown-item"
                          onClick={() => deleteSelectedKelas(kelases)}
                        >
                          <i className="ti-trash menu-icon me-2"></i>Delete
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => deleteSelectedKelas(kelases)}
                        >
                          <i className="ti-trash menu-icon me-2"></i>Delete
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

export default ClassTable;
