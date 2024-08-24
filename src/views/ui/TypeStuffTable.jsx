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
import { Col, Row } from "react-bootstrap";
import FormInputTypeBarang from "./forms/FormInputTypeStuff";
import DetailTypeStuff from "./forms/DetailTypeStuff";
import UpdateTypeStuff from "./forms/UpdateTypeStuff";

const TypeTables = () => {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tabletype")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tabletype").is(":visible")) {
            clearInterval(tableInterval);
            $("#tabletype").DataTable();
          }
        }, 1000);
      });
    }
    getType();
  }, []);

  const getType = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverDev}type`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setType(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(type.map((type) => type.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, userId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, userId]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== userId)
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
            selectedRows.map(async (userId) => {
              await axios.delete(`${serverDev}type/delete/${userId}`, {
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
          getType(); // Refresh the data
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
          <i className="bi bi-border-all me-3"></i> Tabel Type Barang
        </CardTitle>
        <CardBody>
          <Row>
            <Col>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Jumlah Type Barang
              </CardSubtitle>
            </Col>
            <Col className="text-end">
              <ButtonGroup aria-label="Basic example ">
                <FormInputTypeBarang />
                <button
                  className="btn btn-danger"
                  onClick={deleteSelectedKelas}
                  disabled={selectedRows.length === 0}
                >
                  Delete
                </button>
              </ButtonGroup>
            </Col>
          </Row>
          <br />
          <Table className="table table-hover" id="tabletype" responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === type.length && type.length > 0
                    }
                  />
                </th>
                <th>No</th>
                <th>Nama Tipe</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : type.length === 0 ? (
                <tr>
                  <td colSpan="11">No Data kelas available</td>
                </tr>
              ) : (
                type.map((types, index) => (
                  <tr key={types.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(types.id)}
                        onChange={(e) => handleSelectRow(e, types.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{types.name_type}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                        title=""
                      >
                        <DetailTypeStuff typestuffprops={types} />
                        <UpdateTypeStuff typestuffprops={types} />
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

export default TypeTables;
