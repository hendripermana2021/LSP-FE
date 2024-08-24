import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Import draftjs-to-html for converting EditorState to HTML
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import Swal from "sweetalert2";
import serverDev from "../../../Server";
import "../../../assets/css/editorPost.css";
import { createBrowserHistory } from "history";
import { Col, FloatingLabel, Row } from "react-bootstrap";

const FormInputModal = () => {
  const [fullscreen, setFullscreen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [forclass, setForclass] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const history = createBrowserHistory();
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const createHandler = async (e) => {
    e.preventDefault();

    try {
      const contentState = editorState.getCurrentContent();
      const contentHtml = draftToHtml(convertToRaw(contentState)); // Convert EditorState to HTML
      const formData = new FormData();

      formData.append("image", selectedFile);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", contentHtml);
      formData.append("for_class", forclass);

      const response = await axios.post(`${serverDev}modul/add`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Ditambahkan",
        });
        handleClose(); // Close modal after successful submission
        history.go(0);
      } else {
        throw new Error("Failed to add modul");
      }
    } catch (error) {
      console.error("Error while saving:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response ? error.response.data.message : "Network Error",
      });
    }
  };

  function onEditorStateChange(newEditorState) {
    setEditorState(newEditorState);
  }

  function handleClose() {
    setShow(false);
    setTitle("");
    setEditorState(EditorState.createEmpty()); // Clear editor state after save
  }

  return (
    <>
      <Button variant="outline-primary" onClick={() => handleShow(true)}>
        Tambah Modul
      </Button>
      <Modal
        show={show}
        fullscreen={fullscreen}
        animation={false}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Modul Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3" controlId="formTitleModul">
            <Form.Label column sm="2">
              Judul Modul
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                placeholder="Masukkan judul modul"
                style={{ height: "auto" }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formSubtitleModul">
            <Form.Label column sm="2">
              Subtitle Modul
            </Form.Label>
            <Col sm="10">
              <FloatingLabel controlId="floatingTextarea2" label="Subtitle">
                <Form.Control
                  as="textarea"
                  placeholder="Tulis Sekilas tentang Materi"
                  style={{ height: "100px" }}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </FloatingLabel>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formAssignedFor">
            <Form.Label column sm="2">
              Assigned For
            </Form.Label>
            <Col sm="10">
              <Form.Select
                value={forclass}
                onChange={(e) => setForclass(e.target.value)}
              >
                <option hidden>Choose Class</option>
                <option key="1" value="X">
                  Kelas X
                </option>
                <option key="2" value="XI">
                  Kelas XI
                </option>
                <option key="3" value="XII">
                  Kelas XII
                </option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formAssignedFor">
            <Form.Label column sm="2">
              Uploud Image
            </Form.Label>
            <Col sm="10">
              <Form.Control
                placeholder="Module Image"
                type="file"
                accept="image/*"
                style={{ height: "auto" }}
                onChange={handleFileChange}
              />
            </Col>
          </Form.Group>
          <br />
          <Form.Group controlId="formContent">
            <Form.Label className="pe-5">Konten Modul</Form.Label>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorWhiteBackground"
              onEditorStateChange={onEditorStateChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={createHandler}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FormInputModal;
