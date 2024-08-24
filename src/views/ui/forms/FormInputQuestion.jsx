import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import serverDev from "../../../Server";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html"; // Import draftjs-to-html for converting EditorState to HTML
import { Card } from "react-bootstrap";

const FormInputQuestion = ({ assignmentprops }) => {
  const [show, setShow] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [correctoption, setCorrectoption] = useState("");
  const [scoreanswer, setScoreanswer] = useState("");

  // Initialize Editor States for each option
  const [question, setQuestion] = useState(EditorState.createEmpty());
  const [editorStateA, setEditorStateA] = useState(EditorState.createEmpty());
  const [editorStateB, setEditorStateB] = useState(EditorState.createEmpty());
  const [editorStateC, setEditorStateC] = useState(EditorState.createEmpty());
  const [editorStateD, setEditorStateD] = useState(EditorState.createEmpty());

  const navigate = useNavigate();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Handler for updating editor state
  const onEditorStateChange = (editorState, optionLabel) => {
    switch (optionLabel) {
      case "A":
        setEditorStateA(editorState);
        break;
      case "B":
        setEditorStateB(editorState);
        break;
      case "C":
        setEditorStateC(editorState);
        break;
      case "D":
        setEditorStateD(editorState);
        break;
      default:
        setQuestion(editorState);
        break;
    }
  };

  const createHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert editor state to HTML for each option
    const questionHtml = draftToHtml(
      convertToRaw(question.getCurrentContent())
    );
    const optionAHtml = draftToHtml(
      convertToRaw(editorStateA.getCurrentContent())
    );
    const optionBHtml = draftToHtml(
      convertToRaw(editorStateB.getCurrentContent())
    );
    const optionCHtml = draftToHtml(
      convertToRaw(editorStateC.getCurrentContent())
    );
    const optionDHtml = draftToHtml(
      convertToRaw(editorStateD.getCurrentContent())
    );

    // Form validation
    if (!questionHtml) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Soal tidak boleh kosong" });
    }
    if (!correctoption) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Jawaban Benar Tidak boleh kosong",
      });
    }
    if (!scoreanswer) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Skor Pertanyaan tidak boleh kosong",
      });
    }

    try {
      const res = await axios.post(
        `${serverDev}assignment/question/${assignmentprops.id}`,
        {
          text_question: questionHtml,
          correctoption,
          scoreanswer,
          options: [
            { label: "A", text: optionAHtml },
            { label: "B", text: optionBHtml },
            { label: "C", text: optionCHtml },
            { label: "D", text: optionDHtml },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Ditambahkan",
        });
        setCorrectoption("");
        setScoreanswer("");
        setIsLoading(false);
        navigate("/assignment");
        handleClose();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "An error occurred",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleShow}
        style={{ fontSize: "medium" }}
      >
        Tambah Question
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        animation={false}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Input Data Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createHandler}>
            <Card className="p-4 shadow-sm mb-4">
              <Card className="mb-3">
                <Card.Header as="h5" className="bg-light text-dark">
                  Question
                </Card.Header>
                <Card.Body>
                  <Editor
                    editorState={question}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorWhiteBackground"
                    onEditorStateChange={(state) =>
                      onEditorStateChange(state, "")
                    }
                  />
                </Card.Body>
              </Card>

              <Form.Group controlId="formCorrectOption" className="mb-4">
                <Form.Label className="font-weight-bold">
                  Correct Option
                </Form.Label>
                <Form.Select
                  value={correctoption}
                  onChange={(e) => setCorrectoption(e.target.value)}
                  className="rounded-3"
                >
                  <option hidden>Select the correct option</option>
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formScoreAnswer" className="mb-4">
                <Form.Label className="font-weight-bold">
                  Score Answer
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Score Answer"
                  value={scoreanswer}
                  onChange={(e) => setScoreanswer(e.target.value)}
                />
              </Form.Group>

              <Card className="mb-3">
                <Card.Header as="h5" className="bg-light text-dark">
                  Option A
                </Card.Header>
                <Card.Body>
                  <Editor
                    editorState={editorStateA}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorWhiteBackground"
                    onEditorStateChange={(state) =>
                      onEditorStateChange(state, "A")
                    }
                  />
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header as="h5" className="bg-light text-dark">
                  Option B
                </Card.Header>
                <Card.Body>
                  <Editor
                    editorState={editorStateB}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorWhiteBackground"
                    onEditorStateChange={(state) =>
                      onEditorStateChange(state, "B")
                    }
                  />
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header as="h5" className="bg-light text-dark">
                  Option C
                </Card.Header>
                <Card.Body>
                  <Editor
                    editorState={editorStateC}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorWhiteBackground"
                    onEditorStateChange={(state) =>
                      onEditorStateChange(state, "C")
                    }
                  />
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header as="h5" className="bg-light text-dark">
                  Option D
                </Card.Header>
                <Card.Body>
                  <Editor
                    editorState={editorStateD}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorWhiteBackground"
                    onEditorStateChange={(state) =>
                      onEditorStateChange(state, "D")
                    }
                  />
                </Card.Body>
              </Card>
            </Card>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            disabled={isloading}
            onClick={createHandler}
          >
            {isloading ? "Loading..." : "Confirm"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

FormInputQuestion.propTypes = {
  assignmentprops: PropTypes.object.isRequired,
};

export default FormInputQuestion;
