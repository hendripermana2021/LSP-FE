import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import serverDev from "../../../Server";
import { createBrowserHistory } from "history";

const FormInputSiswa = ({ kelas }) => {
  const [show, setShow] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [confPassword, setConfPassword] = useState();
  const [name_siswa, setName_siswa] = useState();
  const [sex, setSex] = useState();
  const [fathername, setFathername] = useState();
  const [mothername, setMothername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [id_class, setId_class] = useState();
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const createHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // form validation
    if (!name_siswa) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Nama tidak boleh kososng" });
    }
    if (!email) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Email tidak boleh kososng" });
    }
    if (!fathername) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Nama ayah tidak boleh kososng",
      });
    }
    if (!mothername) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Nama Ibu tidak boleh kososng",
      });
    }
    if (!password) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Password tidak boleh kososng",
      });
    }
    if (!confPassword) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Confirm Password tidak boleh kososng",
      });
    }
    if (!sex) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Jenis Kelamin tidak boleh kososng",
      });
    }

    if (password !== confPassword) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Password Not Matched" });
    }
    try {
      const res = await axios
        .post(
          `${serverDev}siswa/add`,
          {
            name_siswa: name_siswa,
            sex: sex,
            fathername: fathername,
            mothername: mothername,
            id_class: id_class,
            email: email,
            password: password,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Data Berhasil Ditambahkan",
            });
            setName_siswa("");
            setSex("");
            setFathername("");
            setMothername("");
            setId_class("");
            setPassword("");
            setConfPassword("");
            setIsLoading("");
            navigate("/siswa");
            handleClose();
            history.go(0);
          }
        });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.msg,
      });
      setIsLoading("");
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        Tambah Siswa
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Input Data Siswa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createHandler}>
            <Form.Group className="mb-3" controlId="formNameSiswa">
              <Form.Label>Nama Siswa</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Siswa"
                value={name_siswa}
                onChange={(e) => setName_siswa(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSex">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select value={sex} onChange={(e) => setSex(e.target.value)}>
                <option hidden>Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFatherName">
              <Form.Label>Nama Ayah</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Ayah"
                value={fathername}
                onChange={(e) => setFathername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMotherName">
              <Form.Label>Nama Ibu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Ibu"
                value={mothername}
                onChange={(e) => setMothername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formKelas">
              <Form.Label>Kelas</Form.Label>
              <Form.Select
                value={id_class}
                onChange={(e) => setId_class(e.target.value)}
              >
                <option hidden>Pilih Kelas</option>
                {kelas.map((kelasItem) => (
                  <option key={kelasItem.id} value={kelasItem.id}>
                    {kelasItem.name_class}
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
            disabled={isloading}
            onClick={createHandler}
          >
            {isloading ? "Loading..." : "Confirm"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

FormInputSiswa.propTypes = {
  kelas: PropTypes.array.isRequired,
};

export default FormInputSiswa;
