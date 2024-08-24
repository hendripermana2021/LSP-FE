import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import modulPng from "../../../assets/images/modul.jpg";
import Form from "react-bootstrap/Form"; // Correct import
import { Col, Container, Row } from "react-bootstrap"; // Consistent use with react-bootstrap
import "../../../assets/css/editorPost.css";

const DetailModul = (props) => {
  const modul = props.modul;
  console.log(modul);
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleImageClick = () => {
    setZoomed(!zoomed);
  };

  // Function to convert content to HTML if it's an EditorState
  const convertContentToHtml = (content) => {
    if (content && typeof content.getCurrentContent === "function") {
      return draftToHtml(convertToRaw(content.getCurrentContent()));
    } else if (typeof content === "string") {
      return content;
    } else {
      return "<p>Konten tidak tersedia</p>";
    }
  };

  // Safely get HTML content
  const contentHtml = convertContentToHtml(modul.content);

  return (
    <>
      <button className="dropdown-item" onClick={handleShow}>
        <i className="ti-info menu-icon me-2" />
        Detail Modul
      </button>

      <Modal
        show={show}
        fullscreen={fullscreen}
        animation={false}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Modul</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Container fluid>
              <Row>
                <Col xs lg={4}>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Judul Modul</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={modul.title || "No Title"}
                      defaultValue={modul.title}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col xs lg={2}>
                  <Form.Group className="mb-3" controlId="formStatus">
                    <Form.Label>Status Post</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={modul.status_post || ""}
                      defaultValue={modul.status_post}
                      readOnly
                    />
                  </Form.Group>
                  <br />
                </Col>
              </Row>
              <Row>
                <Col xs lg={4}>
                  <Form.Group controlId="formImage">
                    <Form.Label>Image Modul</Form.Label>
                    <div className="text-center">
                      <img
                        src={modul.image || modulPng}
                        alt="Modul"
                        className={`img-fluid rounded ${
                          zoomed ? "zoomed" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          width: zoomed ? "80%" : "100%",
                          height: zoomed ? "auto" : "100%",
                          maxWidth: zoomed ? "800px" : "300px", // Adjust these values as needed
                          maxHeight: zoomed ? "600px" : "200px", // Adjust these values as needed
                          transition: "transform 0.3s, width 0.3s, height 0.3s",
                        }}
                        onClick={handleImageClick}
                      />
                    </div>
                  </Form.Group>
                  <br />
                  <br />
                </Col>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="formContent">
                  <Form.Label>Konten Modul</Form.Label>
                  <br />
                  <div className="editorWhiteBackground">
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  </div>
                </Form.Group>
              </Row>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DetailModul.propTypes = {
  modul: PropTypes.object,
};

export default DetailModul;
