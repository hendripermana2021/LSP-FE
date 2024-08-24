import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import serverDev from "../../../Server";
import { createBrowserHistory } from "history";

const FormInputBarang = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tipeStuff, setTipeStuff] = useState([]);
  const [namaBarang, setNamaBarang] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [price, setPrice] = useState("");
  const [selectedTipeStuff, setSelectedTipeStuff] = useState("");
  const [diskon, setDiskon] = useState("");
  const [qty, setQty] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const resetForm = () => {
    setNamaBarang("");
    setDeskripsi("");
    setPrice("");
    setSelectedTipeStuff("");
    setDiskon("");
    setImage(null);
  };

  useEffect(() => {
    getTipeStuff();
  }, []);

  const getTipeStuff = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${serverDev}type`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setTipeStuff(response.data.data);
    } catch (error) {
      console.error("Error fetching tipe stuff data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mengambil data tipe stuff",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createHandlerBarang = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!namaBarang || !deskripsi || !price || !selectedTipeStuff) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Form tidak boleh kosong",
        text: "Semua field wajib diisi",
      });
    }

    const formData = new FormData();
    formData.append("name_stuff", namaBarang);
    formData.append("deskripsi", deskripsi);
    formData.append("price", price);
    formData.append("type_stuff", selectedTipeStuff);
    formData.append("disc", diskon);
    formData.append("qty", qty);
    if (image) {
      formData.append("image", image);
    }

    try {
      setIsLoading(true);

      const response = await axios.post(`${serverDev}stuff/add`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Data Barang Berhasil Ditambahkan",
        });

        handleClose(); // Close the modal
        navigate("/data-barang"); // Redirect to the "data-barang" page
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
        Tambah Barang
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
            Input Data Barang
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createHandlerBarang}>
            <Form.Group className="mb-3" controlId="formNamaBarang">
              <Form.Label>Nama Barang</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Barang"
                value={namaBarang}
                onChange={(e) => setNamaBarang(e.target.value)}
                required
                disabled={isLoading}
                style={{ height: "1em" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDeskripsi">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Deskripsi Barang"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Jumlah Unit</Form.Label>
              <Form.Control
                type="number"
                placeholder="Qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTipeStuff">
              <Form.Label>Tipe Stuff</Form.Label>
              <Form.Select
                value={selectedTipeStuff}
                onChange={(e) => setSelectedTipeStuff(e.target.value)}
                required
                disabled={isLoading}
              >
                <option hidden selected value="">
                  Pilih Tipe Stuff
                </option>
                {tipeStuff.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name_type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDiskon">
              <Form.Label>Diskon</Form.Label>
              <Form.Control
                type="number"
                placeholder="Diskon"
                value={diskon}
                onChange={(e) => setDiskon(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                disabled={isLoading}
                style={{ height: "auto" }}
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

export default FormInputBarang;
