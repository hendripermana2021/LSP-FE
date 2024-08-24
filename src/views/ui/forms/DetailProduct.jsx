import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import serverDev from "../../../Server";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const DetailProduct = ({ detailprops }) => {
  const [show, setShow] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [namaBarang, setNamaBarang] = useState(detailprops.name_stuff || "");
  const [deskripsi, setDeskripsi] = useState(detailprops.deskripsi || "");
  const [price, setPrice] = useState(detailprops.price || "");
  const [image, setImage] = useState(detailprops.image || "");
  const [qty, setQty] = useState(detailprops.qty || "");
  const [selectedTipeStuff, setSelectedTipeStuff] = useState(
    detailprops.type.name_type || ""
  );
  const [diskon, setDiskon] = useState(detailprops.disc || "");

  const navigate = useNavigate();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleImageClick = () => setZoomed(!zoomed);

  const handleUpdateBarang = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_barang", namaBarang);
    formData.append("deskripsi", deskripsi);
    formData.append("price", price);
    formData.append("tipe_stuff", selectedTipeStuff);
    formData.append("diskon", diskon);
    if (image) {
      formData.append("image", image);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleShow}>
        <i className="ti-info menu-icon me-2" />
        Detail Barang
      </button>

      <Modal show={show} animation={false} onHide={handleClose} size="lg">
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title style={{ fontSize: "1.5rem", fontWeight: "500" }}>
            Detail Barang
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateBarang} className="p-3">
            <Container fluid>
              <Row className="mb-3">
                <Col lg={4}>
                  <Form.Group controlId="formNamaBarang">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Nama Barang
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={namaBarang}
                      onChange={(e) => setNamaBarang(e.target.value)}
                      required
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ddd",
                      }}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group controlId="formPrice">
                    <Form.Label style={{ fontWeight: "500" }}>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ddd",
                      }}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group controlId="formQty">
                    <Form.Label style={{ fontWeight: "500" }}>Qty</Form.Label>
                    <Form.Control
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
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
              <Row className="mb-3">
                <Col lg={4}>
                  <Form.Group controlId="formDiskon">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Diskon
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={diskon}
                      onChange={(e) => setDiskon(e.target.value)}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ddd",
                      }}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col lg={8}>
                  <Form.Group controlId="formImage">
                    <Form.Label style={{ fontWeight: "500" }}>
                      Image Barang
                    </Form.Label>
                    <div className="text-center">
                      <img
                        src={image || "/placeholder.png"}
                        alt="Barang"
                        className="img-fluid rounded mb-2"
                        style={{
                          cursor: "pointer",
                          width: zoomed ? "80%" : "100%",
                          maxHeight: "300px",
                          objectFit: "cover",
                          transition: "transform 0.3s, width 0.3s, height 0.3s",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={handleImageClick}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-2">
                <Form.Group controlId="formDeskripsi">
                  <Form.Label style={{ fontWeight: "500" }}>
                    Deskripsi
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    required
                    style={{
                      borderRadius: "0.25rem",
                      border: "1px solid #ddd",
                    }}
                    readOnly
                  />
                </Form.Group>
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

DetailProduct.propTypes = {
  detailprops: PropTypes.object.isRequired,
};

export default DetailProduct;
