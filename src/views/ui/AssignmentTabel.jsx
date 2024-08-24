import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { Link } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import serverDev from "../../Server";
import FormInputAssignment from "./forms/FormInputAssignment";
import DetailAssignment from "./forms/DetailAssignment";
import { DropdownButton, Button } from "react-bootstrap";

const AssignmentTable = () => {
  const [Assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tableAssignment")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tableAssignment").is(":visible")) {
            clearInterval(tableInterval);
            $("#tableAssignment").DataTable();
          }
        }, 1000);
      });
    }
    getAssignment();
  }, []);

  const getAssignment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverDev}assignment`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setAssignment(response.data.data);
    } catch (error) {
      console.error("Error fetching siswa data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(Assignment.map((assignment) => assignment.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, assignmentId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [
        ...prevSelectedRows,
        assignmentId,
      ]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== assignmentId)
      );
    }
  };

  const deleteSelectedAssignment = async () => {
    if (selectedRows.length === 0) {
      Swal.fire(
        "No selection",
        "Please select Assignment(s) to delete",
        "info"
      );
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
            selectedRows.map(async (assignmentId) => {
              await axios.delete(
                `${serverDev}assignment/delete/${assignmentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );
            })
          );
          Swal.fire(
            "Deleted!",
            "The selected Assignment(s) have been deleted.",
            "success"
          );
          getAssignment(); // Refresh the data
          setSelectedRows([]);
        } catch (error) {
          console.error("Error deleting Assignment data:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the selected Assignment(s).",
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
          <i className="bi bi-people me-3"></i> Tabel Assignment
        </CardTitle>
        <CardBody>
          <ButtonGroup aria-label="Basic example">
            <FormInputAssignment kelas={Assignment} />
            <button
              className="btn btn-danger"
              onClick={deleteSelectedAssignment}
              disabled={selectedRows.length === 0}
            >
              Delete
            </button>
          </ButtonGroup>
          <br />
          <br />
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Jumlah Assignment
          </CardSubtitle>
          <Table className="table table-hover" id="tableAssignment" responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === Assignment.length &&
                      Assignment.length > 0
                    }
                  />
                </th>
                <th>No</th>
                <th>Judul Test</th>
                <th>Deskripsi</th>
                <th>Class</th>
                <th>Total Soal</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading...</td>
                </tr>
              ) : Assignment.length === 0 ? (
                <tr>
                  <td colSpan="7">No Data Assignment available</td>
                </tr>
              ) : (
                Assignment.map((assignments, index) => (
                  <tr key={assignments.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(assignments.id)}
                        onChange={(e) => handleSelectRow(e, assignments.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{assignments.title}</td>
                    <td>{assignments.description}</td>
                    <td>{assignments.for_class}</td>
                    <td>{assignments.question.length}</td>
                    <td>{assignments.totalscore}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                      >
                        <Button
                          className="dropdown-item"
                          as={Link}
                          to={`/question`}
                          state={{ assignment: assignments }}
                        >
                          <i className="ti-info menu-icon me-2" />
                          Lihat Question
                        </Button>

                        <DetailAssignment assignmentprops={assignments} />
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

export default AssignmentTable;
