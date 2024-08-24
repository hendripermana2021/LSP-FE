import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Swal from "sweetalert2";
import serverDev from "../../../Server";
import { Container, Row, Col, FloatingLabel } from "react-bootstrap";
import { createBrowserHistory } from "history";
import PropTypes from "prop-types";

const UpdateTypeStuff = (props) => {
  const typestuff = props.typestuffprops;
  const [show, setShow] = useState(false);
  const [nameType, setNameType] = useState("");
  const history = createBrowserHistory();

  useEffect(() => {
    if (typestuff) {
      setNameType(typestuff.name_type);
    }
  }, [typestuff]);

  function handleShow(breakpoint) {
    setShow(true);
  }

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${serverDev}type/update/${typestuff.id}`,
        {
          name_type: nameType,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Data Type Berhasil Diperbarui",
        });
        handleClose(); // Close modal after successful submission
        history.go(0);
      } else {
        throw new Error("Failed to update type");
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

  function handleClose() {
    setShow(false);
  }

  return (
    <>
      <button className="dropdown-item" onClick={() => handleShow(true)}>
        <i className="ti-info menu-icon me-2" />
        Update Type
      </button>
      <Modal show={show} size="lg" animation={false} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Type Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Form.Group as={Row} className="mb-3" controlId="formNamaBarang">
              <Form.Label column sm="2">
                Nama Type
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama barang"
                  value={nameType}
                  onChange={(e) => setNameType(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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

UpdateTypeStuff.propTypes = {
  typestuffprops: PropTypes.object.isRequired,
};

export default UpdateTypeStuff;
