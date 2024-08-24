import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Import draftjs-to-html for converting EditorState to HTML
import htmlToDraft from "html-to-draftjs"; // Import html-to-draftjs for converting HTML to EditorState
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import Swal from "sweetalert2";
import serverDev from "../../../Server";
import PropTypes from "prop-types";
import { Container, Row } from "reactstrap";
import { Col, FloatingLabel } from "react-bootstrap";
import "../../../assets/css/editorPost.css";
import { createBrowserHistory } from "history";

const UpdateDataModul = ({ modul }) => {
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(modul.title ? modul.title : "");
  const [subtitle, setSubtitle] = useState(
    modul.subtitle ? modul.subtitle : ""
  );
  const [forclass, setForClass] = useState(
    modul.for_class ? modul.for_class : ""
  );
  const [status, setStatus] = useState(modul.status_post ? "Active" : "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const history = createBrowserHistory();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (modul) {
      setTitle(modul.title);

      // Convert HTML content to EditorState
      const blocksFromHtml = htmlToDraft(modul.content);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [modul]);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const updateHandler = async (e) => {
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
      formData.append("status", status);

      const response = await axios.put(
        `${serverDev}modul/update/${modul.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Diperbarui",
        });
        handleClose(); // Close modal after successful submission
        history.go(0);
      } else {
        throw new Error("Failed to update modul");
      }
    } catch (error) {
      console.error("Error while updating:", error);
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
  }

  return (
    <>
      <button className="dropdown-item" onClick={() => handleShow(true)}>
        <i className="ti-info menu-icon me-2" />
        Update Modul
      </button>
      <Modal
        show={show}
        fullscreen={fullscreen}
        animation={false}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Modul</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Form.Group as={Row} className="mb-3" controlId="formTitleModul">
              <Form.Label column sm="2">
                Title Modul
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
            <Form.Group as={Row} className="mb-3" controlId="formStatusModul">
              <Form.Label column sm="2">
                Status
              </Form.Label>
              <Col sm="2">
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option hidden>Status Post Modul</option>
                  <option value="Active">Active</option>
                  <option value="Unactive">Unactive</option>
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formClassAssignment"
            >
              <Form.Label column sm="2">
                Assignment For Class
              </Form.Label>
              <Col sm="2">
                <Form.Select
                  value={forclass}
                  onChange={(e) => setForClass(e.target.value)}
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
            <Form.Group as={Row} className="mb-3" controlId="formUpdateImage">
              <Form.Label column sm="2">
                Modul Image
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
          </Container>
          <br />
          <Form.Group controlId="formContent">
            <Form.Label>Konten Modul</Form.Label>
            <br />
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
          <Button variant="primary" onClick={updateHandler}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateDataModul.propTypes = {
  modul: PropTypes.object.isRequired,
};

export default UpdateDataModul;
