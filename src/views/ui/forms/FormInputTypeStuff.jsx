import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import serverDev from "../../../Server";
import { createBrowserHistory } from "history";

const FormInputTypeBarang = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameType, setNameType] = useState("");

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const resetForm = () => {
    setNameType("");
  };

  const createHandlerBarang = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!nameType) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Form tidak boleh kosong",
        text: "Semua field wajib diisi",
      });
    }

    const formData = new FormData();
    formData.append("name_type", nameType);

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${serverDev}type/add`,
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
          title: "Data Type Berhasil Ditambahkan",
        });

        handleClose(); // Close the modal
        navigate("/tipe-barang"); // Redirect to the "data-barang" page
        history.go(0); // Refresh the page (optional)
      }
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.msg ||
          "Terjadi kesalahan saat menambahkan data",
      });
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        Tambah Type Barang
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Input Data Type Barang
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createHandlerBarang}>
            <Form.Group className="mb-3" controlId="formNamaBarang">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Type"
                value={nameType}
                onChange={(e) => setNameType(e.target.value)}
                required
                disabled={isLoading}
                style={{ height: "1em" }}
              />
            </Form.Group>

            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                style={{ width: "20%", borderRadius: "0.25rem" }}
              >
                {isLoading ? "Loading..." : "Confirm"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{ width: "20%" }}
              >
                Batal
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FormInputTypeBarang;
