import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Badge } from "react-bootstrap";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import serverDev from "../../Server";
import FormInputSiswa from "./forms/FormInputSiswa";
import DetailSiswa from "./forms/DetailSiswa";
import UpdateDataSiswa from "./forms/UpdateDataSiswa";

const SiswaTables = () => {
  const [Siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tablesiswa")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tablesiswa").is(":visible")) {
            clearInterval(tableInterval);
            $("#tablesiswa").DataTable();
          }
        }, 1000);
      });
    }
    getKelas();
    getSiswa();
  }, []);

  const getSiswa = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverDev}siswa`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setSiswa(response.data.data);
    } catch (error) {
      console.error("Error fetching siswa data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(Siswa.map((siswa) => siswa.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, siswaId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, siswaId]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== siswaId)
      );
    }
  };

  const deleteSelectedSiswa = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("No selection", "Please select siswa(s) to delete", "info");
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
            selectedRows.map(async (siswaId) => {
              await axios.delete(`${serverDev}siswa/delete/${siswaId}`, {
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
            "The selected siswa(s) have been deleted.",
            "success"
          );
          getSiswa(); // Refresh the data
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
          <i className="bi bi-bell me-2"></i> Tabel Siswa
        </CardTitle>
        <CardBody>
          <ButtonGroup aria-label="Basic example">
            <FormInputSiswa kelas={kelas} />
            <button
              className="btn btn-danger"
              onClick={deleteSelectedSiswa}
              disabled={selectedRows.length === 0}
            >
              Delete Selected
            </button>
          </ButtonGroup>
          <br />
          <br />
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Jumlah Siswa
          </CardSubtitle>
          <Table className="table table-hover" id="tablesiswa" responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === Siswa.length && Siswa.length > 0
                    }
                  />
                </th>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>Jenis Kelamin</th>
                <th>Nama Ayah</th>
                <th>Nama Ibu</th>
                <th>Status</th>
                <th>Kelas</th>
                <th>Email</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11">Loading...</td>
                </tr>
              ) : Siswa.length === 0 ? (
                <tr>
                  <td colSpan="11">No Data Siswa available</td>
                </tr>
              ) : (
                Siswa.map((siswas, index) => (
                  <tr key={siswas.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(siswas.id)}
                        onChange={(e) => handleSelectRow(e, siswas.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{siswas.name_siswa}</td>
                    <td>
                      <Badge bg={siswas.sex === "L" ? "primary" : "success"}>
                        {siswas.sex}
                      </Badge>
                    </td>
                    <td>{siswas.fathername}</td>
                    <td>{siswas.mothername}</td>
                    <td>
                      <Badge
                        bg={siswas.status === "Active" ? "success" : "danger"}
                      >
                        {siswas.status}
                      </Badge>
                    </td>
                    <td>{siswas.kelas.name_class}</td>
                    <td>{siswas.email}</td>
                    <td>{siswas.real_password}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                        title=""
                      >
                        <DetailSiswa siswaprops={siswas} />
                        <UpdateDataSiswa classes={kelas} student={siswas} />
                        <button
                          className="dropdown-item"
                          onClick={() => deleteSelectedSiswa(siswas)}
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

export default SiswaTables;
