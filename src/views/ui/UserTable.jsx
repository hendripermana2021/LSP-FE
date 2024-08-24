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

const UserTables = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  // const [guru, setGuru] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tableuser")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tableuser").is(":visible")) {
            clearInterval(tableInterval);
            $("#tableuser").DataTable();
          }
        }, 1000);
      });
    }
    getUser();
  }, []);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverDev}user`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(user.map((user) => user.id));
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
              await axios.delete(`${serverDev}user/delete/${userId}`, {
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
          getUser(); // Refresh the data
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
          <i className="bi bi-border-all me-3"></i> Tabel User
        </CardTitle>
        <CardBody>
          <Row>
            <Col>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Jumlah User
              </CardSubtitle>
            </Col>
            <Col className="text-end">
              <ButtonGroup aria-label="Basic example ">
                {/* <FormInputKelas guru={guru} /> */}
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
          <Table className="table table-hover" id="tableuser" responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === user.length && user.length > 0
                    }
                  />
                </th>
                <th>No</th>
                <th>Nama User</th>
                <th>Jenis Kelamin</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11">Loading...</td>
                </tr>
              ) : user.length === 0 ? (
                <tr>
                  <td colSpan="11">No Data kelas available</td>
                </tr>
              ) : (
                user.map((users, index) => (
                  <tr key={users.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(users.id)}
                        onChange={(e) => handleSelectRow(e, users.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{users.name_user}</td>
                    <td>{users.sex}</td>
                    <td>{users.email}</td>
                    <td>{users.real_password}</td>
                    <td>{users.role.role}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                        title=""
                      >
                        {/* <DetailKelas kelasprops={users} />
                        <UpdateDataKelas kelasprops={users} teachers={guru} /> */}
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

export default UserTables;
