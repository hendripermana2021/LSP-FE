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

const UpdateDataGuru = ({ teacher }) => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name_guru, setName_guru] = useState(teacher.name_guru);
  const [sex, setSex] = useState(teacher.sex || "");
  const [pendidikan, setPendidikan] = useState(teacher.pendidikan || "");
  const [bid_pendidikan, setBid_pendidikan] = useState(
    teacher.bid_pendidikan || ""
  );
  const [email, setEmail] = useState(teacher.email);
  const [password, setPassword] = useState(teacher.real_password || "");
  const [confPassword, setConfPassword] = useState(teacher.real_password || "");

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const updateHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // form validation
    if (!name_guru) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Nama tidak boleh kosong" });
    }
    if (!email) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Email tidak boleh kosong" });
    }
    if (!pendidikan) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Pendidikan tidak boleh kosong",
      });
    }
    if (!bid_pendidikan) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Bidang Pendidikan tidak boleh kosong",
      });
    }
    if (!password) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Password tidak boleh kosong",
      });
    }
    if (!confPassword) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Konfirmasi Password tidak boleh kosong",
      });
    }
    if (!sex) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Jenis Kelamin tidak boleh kosong",
      });
    }
    if (password !== confPassword) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Password Tidak Cocok" });
    }

    try {
      const res = await axios.put(
        `${serverDev}guru/update/${teacher.id}`,
        {
          name_guru: name_guru,
          sex: sex,
          pendidikan: pendidikan,
          bid_pendidikan: bid_pendidikan,
          email: email,
          password: password,
          real_password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Diupdate",
        });
        setName_guru("");
        setSex("");
        setPendidikan("");
        setBid_pendidikan("");
        setPassword("");
        setConfPassword("");
        setIsLoading(false);
        navigate("/guru");
        handleClose();
        history.go(0);
      }
    } catch (error) {
      console.error("Error updating teacher data:", error);
      Swal.fire({
        icon: "error",
        title: "Error Updating Data Guru",
        text: error.response?.data?.msg || "Error occurred",
      });
      setIsLoading(false);
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
            Update Data Guru
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateHandler}>
            <Form.Group className="mb-3" controlId="formNameGuru">
              <Form.Label>Nama Guru</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama Guru"
                value={name_guru}
                onChange={(e) => setName_guru(e.target.value)}
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
              <Form.Label>Pendidikan</Form.Label>
              <Form.Select
                value={pendidikan}
                onChange={(e) => setPendidikan(e.target.value)}
              >
                <option hidden>Pilih Pendidikan</option>
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="Strata 1">Strata 1</option>
                <option value="Strata 2">Strata 2</option>
                <option value="Strata 3">Strata 3</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubject">
              <Form.Label>Bidang Pendidikan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Bidang Pendidikan"
                value={bid_pendidikan}
                onChange={(e) => setBid_pendidikan(e.target.value)}
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

UpdateDataGuru.propTypes = {
  teacher: PropTypes.object.isRequired,
};

export default UpdateDataGuru;
