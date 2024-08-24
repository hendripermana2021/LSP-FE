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

const FormInputGuru = ({ kelas }) => {
  const [show, setShow] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [name_guru, setName_guru] = useState("");
  const [sex, setSex] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [bid_pendidikan, setBid_pendidikan] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const createHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Form validation
    if (!name_guru) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Nama tidak boleh kosong" });
    }
    if (!sex) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Jenis Kelamin tidak boleh kosong",
      });
    }
    if (!bid_pendidikan) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Bidang Pendidikan tidak boleh kosong",
      });
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
        title: "Confirm Password tidak boleh kosong",
      });
    }

    if (password !== confPassword) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Password tidak sesuai" });
    }

    try {
      const res = await axios.post(
        `${serverDev}guru/add`,
        {
          name_guru: name_guru,
          sex: sex,
          pendidikan: pendidikan,
          bid_pendidikan: bid_pendidikan,
          email: email,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Ditambahkan",
        });
        setName_guru("");
        setSex("");
        setPendidikan("");
        setBid_pendidikan("");
        setEmail("");
        setPassword("");
        setConfPassword("");
        setIsLoading(false);
        navigate("/guru");
        history.go(0);
        handleClose();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        Tambah Guru
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
            Input Data Guru
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createHandler}>
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

            <Form.Group className="mb-3" controlId="formBidPendidikan">
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

            <Form.Group className="mb-3" controlId="formConfPassword">
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Konfirmasi Password"
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

export default FormInputGuru;
