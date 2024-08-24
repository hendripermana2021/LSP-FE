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

const UpdateDataBarang = (props) => {
  const barang = props.stuffprops; // Receive the barang data via props
  console.log(barang);
  const [show, setShow] = useState(false);
  const [type, setType] = useState([]);
  const [namaBarang, setNamaBarang] = useState(barang.name_stuff || "");
  const [deskripsi, setDeskripsi] = useState(barang.deskripsi || "");
  const [harga, setHarga] = useState(barang.price || "");
  const [tipe, setTipe] = useState(barang.type.name_type || "");
  const [diskon, setDiskon] = useState(barang.disc || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const history = createBrowserHistory();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (barang) {
      setNamaBarang(barang.name_stuff);
      setDeskripsi(barang.deskripsi);
      setHarga(barang.price);
      setTipe(barang.type.type_name);
      setDiskon(barang.disc);
    }
    getType();
  }, [barang]);

  function handleShow(breakpoint) {
    setShow(true);
  }

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("name_stuff", namaBarang);
      formData.append("deskripsi", deskripsi);
      formData.append("price", harga);
      formData.append("type", tipe);
      formData.append("disc", diskon);

      const response = await axios.put(
        `${serverDev}stuff/update/${barang.id}`,
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
          title: "Data Barang Berhasil Diperbarui",
        });
        handleClose(); // Close modal after successful submission
        history.go(0);
      } else {
        throw new Error("Failed to update barang");
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

  const getType = async () => {
    try {
      const response = await axios.get(`${serverDev}type`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setType(response.data.data);
    } catch (error) {
      console.error("Error fetching modul data:", error);
    }
  };

  function handleClose() {
    setShow(false);
  }

  return (
    <>
      <button className="dropdown-item" onClick={() => handleShow(true)}>
        <i className="ti-info menu-icon me-2" />
        Update Barang
      </button>
      <Modal show={show} size="lg" animation={false} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Form.Group as={Row} className="mb-3" controlId="formNamaBarang">
              <Form.Label column sm="2">
                Nama Barang
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama barang"
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formDeskripsiBarang"
            >
              <Form.Label column sm="2">
                Deskripsi
              </Form.Label>
              <Col sm="10">
                <FloatingLabel controlId="floatingTextarea2" label="Deskripsi">
                  <Form.Control
                    as="textarea"
                    placeholder="Tulis deskripsi barang"
                    style={{ height: "100px" }}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </FloatingLabel>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formHargaBarang">
              <Form.Label column sm="2">
                Harga
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Masukkan harga barang"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formTipeBarang">
              <Form.Label column sm="2">
                Tipe Barang
              </Form.Label>
              <Col sm="10">
                <Form.Select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                >
                  <option value={barang.type.id} selected hidden>
                    {" "}
                    {barang.type.name_type}
                  </option>
                  {type.map((types, index) => (
                    <option key={index} value={types.id}>
                      {types.name_type}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formDiskonBarang">
              <Form.Label column sm="2">
                Diskon
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Masukkan diskon barang (dalam persen)"
                  value={diskon}
                  onChange={(e) => setDiskon(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formUpdateImage">
              <Form.Label column sm="2">
                Gambar Barang
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ height: "auto" }}
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

UpdateDataBarang.propTypes = {
  stuffprops: PropTypes.object.isRequired,
};

export default UpdateDataBarang;
