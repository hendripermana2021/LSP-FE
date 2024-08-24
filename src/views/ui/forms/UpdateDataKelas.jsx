import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import serverDev from "../../../Server";
import { createBrowserHistory } from "history";

const UpdateDataKelas = (props) => {
  const kelas = props.kelasprops;
  const guru = props.teachers;
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name_class, setName_class] = useState(kelas.name_class || "");
  const [walikelas, setWalikelas] = useState(kelas.wali_kelas?.id || "");

  const navigate = useNavigate();
  const history = createBrowserHistory();

  useEffect(() => {
    if (kelas.wali_kelas) {
      setWalikelas(kelas.wali_kelas.id);
    }
  }, [kelas]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const updateHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name_class.trim()) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Nama Kelas tidak boleh kosong",
      });
    }

    if (!walikelas) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Wali Kelas tidak boleh kosong",
      });
    }

    try {
      const response = await axios.put(
        `${serverDev}class/update/${kelas.id}`,
        {
          name_class,
          id_walkes: walikelas,
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
          title: "Data Berhasil Diupdate",
        });
        handleClose();
        navigate("/kelas");
        history.go(0);
      }
    } catch (error) {
      console.error("Error updating class data:", error);
      Swal.fire({
        icon: "error",
        title: "Error Updating Data Kelas",
        text: error.response?.data?.msg || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="dropdown-item" onClick={handleShow}>
        <i className="ti-info menu-icon me-2" />
        Update Data
      </button>

      <Modal show={show} onHide={handleClose} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update Data Kelas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateHandler}>
            <Form.Group className="mb-3" controlId="formNamaKelas">
              <Form.Label>Nama Kelas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Kelas"
                value={name_class}
                onChange={(e) => setName_class(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWaliKelas">
              <Form.Label>Wali Kelas</Form.Label>
              <Form.Select
                value={walikelas}
                onChange={(e) => setWalikelas(e.target.value)}
                required
              >
                <option hidden>Pilih Wali Kelas</option>
                {guru.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name_guru}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            onClick={updateHandler}
          >
            {isLoading ? "Loading..." : "Confirm"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateDataKelas.propTypes = {
  kelasprops: PropTypes.object.isRequired,
  teachers: PropTypes.array.isRequired,
};

export default UpdateDataKelas;
