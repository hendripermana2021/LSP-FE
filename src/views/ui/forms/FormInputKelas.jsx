import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import serverDev from "../../../Server";
import { createBrowserHistory } from "history";

const FormInputKelas = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guru, setGuru] = useState([]);
  const [nameKelas, setNameKelas] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [id_walkes, setId_walkes] = useState("");

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const resetForm = () => {
    setNameKelas("");
    setId_walkes("");
  };

  useEffect(() => {
    getGuru();
  }, []);

  const getGuru = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${serverDev}guru`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setGuru(response.data.data);
    } catch (error) {
      console.error("Error fetching guru data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mengambil data guru",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createHandlerKelas = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!nameKelas || !id_walkes) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Form tidak boleh kosong",
        text: !nameKelas
          ? "Nama Kelas tidak boleh kosong"
          : "Wali Kelas tidak boleh kosong",
      });
    }

    try {
      const response = await axios.post(
        `${serverDev}class/add`,
        {
          name_class: nameKelas,
          id_walkes: id_walkes,
          grade_class: gradeClass,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Ditambahkan",
        });
        navigate("/kelas");
        handleClose();
        history.go(0);
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
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        Tambah Kelas
      </Button>

      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Input Data Kelas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createHandlerKelas}>
            <Form.Group className="mb-3" controlId="formNameKelas">
              <Form.Label>Nama Kelas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Kelas"
                value={nameKelas}
                onChange={(e) => setNameKelas(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGradeClass">
              <Form.Label>Tingkat Kelas</Form.Label>
              <Form.Select
                value={gradeClass}
                onChange={(e) => setGradeClass(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Pilih Kelas
                </option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWaliKelas">
              <Form.Label>Wali Kelas</Form.Label>
              <Form.Select
                value={id_walkes}
                onChange={(e) => setId_walkes(e.target.value)}
                required
                disabled={isLoading}
              >
                <option hidden value="">
                  Pilih Wali Kelas
                </option>
                {guru.map((guruItem) => (
                  <option key={guruItem.id} value={guruItem.id}>
                    {guruItem.name_guru}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Modal.Footer>
              <Button
                variant="primary"
                disabled={isLoading}
                onClick={createHandlerKelas}
              >
                {isLoading ? "Loading..." : "Confirm"}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Batal
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FormInputKelas;
