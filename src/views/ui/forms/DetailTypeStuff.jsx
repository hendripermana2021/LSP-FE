import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import serverDev from "../../../Server";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const DetailTypeStuff = (props) => {
  const typestuff = props.typestuffprops;
  const [show, setShow] = useState(false);
  const [nameType, setNameType] = useState(typestuff.name_type || "");

  const navigate = useNavigate();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleUpdateBarang = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("", nameType);

    try {
      const response = await axios.put(
        `${serverDev}stuff/update/${typestuff.id}`,
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
          title: "Data Barang Berhasil Diupdate",
        });
        navigate("/barang");
        handleClose();
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.msg || "Terjadi kesalahan saat mengupdate data",
      });
    }
  };

  return (
    <>
      <button className="dropdown-item" onClick={handleShow}>
        <i className="ti-info menu-icon me-2" />
        Detail Type Barang
      </button>

      <Modal show={show} animation={false} onHide={handleClose} size="lg">
        <Modal.Header
          closeButton
          style={{ borderBottom: "none", paddingBottom: "0" }}
        >
          <Modal.Title
            style={{ fontSize: "1.5rem", fontWeight: "500", color: "#333" }}
          >
            Detail Type Barang
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: "0" }}>
          <Form onSubmit={handleUpdateBarang} className="p-3">
            <Container fluid>
              <Row className="mb-3">
                <Col lg={4}>
                  <Form.Group controlId="formNamaBarang">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Type Barang
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={nameType}
                      onChange={(e) => setNameType(e.target.value)}
                      required
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ddd",
                      }}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Container>

            <Modal.Footer style={{ borderTop: "none" }}>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{ borderRadius: "0.25rem", border: "none" }}
              >
                Tutup
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

DetailTypeStuff.propTypes = {
  typestuffprops: PropTypes.object,
};

export default DetailTypeStuff;
