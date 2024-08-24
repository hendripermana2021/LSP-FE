import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import $ from "jquery";
import "datatables.net-dt";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import serverDev from "../../Server";
import FormInputQuestion from "./forms/FormInputQuestion";
import Dropdown from "react-bootstrap/Dropdown";
import DetailQuestion from "./forms/DetailQuestion";
import UpdateDataQuestion from "./forms/UpdateDataQuestion";
import { Button, DropdownButton } from "react-bootstrap";

const QuestionTable = () => {
  const location = useLocation();
  const assignment = location.state?.assignment;
  const [Question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (!$.fn.DataTable.isDataTable("#tableQuestion")) {
      $(document).ready(() => {
        const tableInterval = setInterval(() => {
          if ($("#tableQuestion").is(":visible")) {
            clearInterval(tableInterval);
            $("#tableQuestion").DataTable();
          }
        }, 1000);
      });
    }
    getQuestion();
  }, []);

  const getQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${serverDev}question/byid/${assignment.id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      setQuestion(response.data.data);
    } catch (error) {
      console.error("Error fetching siswa data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(Question.map((question) => question.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, questionId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, questionId]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== questionId)
      );
    }
  };

  const deleteSelectedQuestion = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("No selection", "Please select Question(s) to delete", "info");
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
            selectedRows.map(async (QuestionId) => {
              await axios.delete(`${serverDev}question/delete/${QuestionId}`, {
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
            "The selected Question(s) have been deleted.",
            "success"
          );
          getQuestion(); // Refresh the data
          setSelectedRows([]);
        } catch (error) {
          console.error("Error deleting Question data:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the selected Question(s).",
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
          <i className="bi bi-people me-3"></i> Tabel Question from{" "}
          {assignment.title}
        </CardTitle>
        <CardBody>
          <ButtonGroup aria-label="Basic example">
            <FormInputQuestion assignmentprops={assignment} />
            <button
              className="btn btn-danger"
              onClick={deleteSelectedQuestion}
              disabled={selectedRows.length === 0}
            >
              Delete
            </button>
          </ButtonGroup>
          <br />
          <br />
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Isikan Jumlah dan Option
          </CardSubtitle>
          <Table className="table table-hover" id="tableQuestion" responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === Question.length &&
                      Question.length > 0
                    }
                  />
                </th>
                <th>No</th>
                <th>Soal</th>
                <th>Jawaban</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : Question.length === 0 ? (
                <tr>
                  <td colSpan="6">No Data Question available</td>
                </tr>
              ) : (
                Question.map((question, index) => (
                  <tr key={question.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(question.id)}
                        onChange={(e) => handleSelectRow(e, question.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{question.text_question}</td>
                    <td>{question.correctoption}</td>
                    <td>{question.scoreanswer}</td>
                    <td>
                      <DropdownButton
                        as={ButtonGroup}
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        variant="secondary"
                      >
                        <DetailQuestion questionprops={question} />
                        <UpdateDataQuestion questionprops={question} />
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

QuestionTable.propTypes = {
  assignments: PropTypes.object,
};

export default QuestionTable;
