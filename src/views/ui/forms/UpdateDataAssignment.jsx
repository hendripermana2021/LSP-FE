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

const UpdateDataSiswa = (props) => {
  const classes = props.classes;

  const [show, setShow] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [kelas, setKelas] = useState(student.kelas.id ? student.kelas.id : "");
  const [name_siswa, setName_siswa] = useState(student.name_siswa);
  const [sex, setSex] = useState(student.sex ? "L" : "P");
  const [fathername, setFathername] = useState(student.fathername);
  const [mothername, setMothername] = useState(student.mothername);
  const [email, setEmail] = useState(student.email);
  const [password, setPassword] = useState(
    student.real_password ? student.real_password : ""
  );

  const [confPassword, setConfPassword] = useState(
    student.real_password ? student.real_password : ""
  );
  const [status, setStatus] = useState(student.status ? student.status : "");

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const updateHandler = async (e) => {
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
        .put(
          `${serverDev}siswa/update/${student.id}`,
          {
            name_siswa: name_siswa,
            sex: sex,
            fathername: fathername,
            mothername: mothername,
            id_class: kelas,
            email: email,
            password: password,
            real_password: password,
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Data Berhasil Diupdate",
            });
            setName_siswa("");
            setSex("");
            setFathername("");
            setMothername("");
            setPassword("");
            setConfPassword("");
            setIsLoading("");
            navigate("/siswa");
            handleClose();
            history.go(0);
          }
        });
    } catch (error) {
      console.log("Error updating student data:", error);
      Swal.fire({
        icon: "error",
        title: "Error Updating Data Siswa",
        text: error.response.data.msg,
      });
      setIsLoading("");
    }
  };

  return (
    <>
      <button className="dropdown-item" onClick={handleShow}>
        <i className="ti-info menu-icon me-2" />
        Update Data
      </button>

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
          <Form onSubmit={updateHandler}>
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

            <Form.Group className="mb-3" controlId="formSex">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option hidden>Pilih Status</option>
                <option value="active">active</option>
                <option value="non-active">non-active</option>
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
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
              >
                <option hidden>Pilih Kelas</option>
                {classes.map((kelasItem) => (
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
            onClick={updateHandler}
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

UpdateDataSiswa.propTypes = {
  classes: PropTypes.array.isRequired,
  student: PropTypes.object,
};

export default UpdateDataSiswa;
