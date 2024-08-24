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

const FormInputSiswa = () => {
  const [show, setShow] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalscore, setTotalScore] = useState("");
  const [forClass, setForclass] = useState("");

  const navigate = useNavigate();
  const history = createBrowserHistory();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const createHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // form validation
    if (!title) {
      setIsLoading(false);
      return Swal.fire({ icon: "error", title: "Title tidak boleh Kosong" });
    }
    if (!description) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Description Tidak boleh kosong",
      });
    }
    if (!totalscore) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Total Score tidak boleh kosong",
      });
    }
    if (!forClass) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Class tidak boleh kosong",
      });
    }

    try {
      const res = await axios.post(
        `${serverDev}assignment/add`,
        {
          title: title,
          description: description,
          totalscore: totalscore,
          for_class: forClass,
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
          title: "Data Berhasil Ditambahkan",
        });
        setTitle("");
        setDescription("");
        setTotalScore("");
        setForclass("");
        setIsLoading(false);
        navigate("/assignment");
        handleClose();
        history.go(0);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "An error occurred",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleShow}
        style={{ fontSize: "medium" }}
      >
        Tambah Test
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        animation={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Input Data Test
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createHandler}>
            <Form.Group className="mb-3" controlId="formNameSiswa">
              <Form.Label>Title Test</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSex">
              <Form.Label>Kelas</Form.Label>
              <Form.Select
                value={forClass}
                onChange={(e) => setForclass(e.target.value)}
              >
                <option hidden>Choose Class</option>
                <option key="1" value="X">
                  Kelas X
                </option>
                <option key="2" value="XI">
                  Kelas XI
                </option>
                <option key="3" value="XII">
                  Kelas XII
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formScore">
              <Form.Label>Total Score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Score"
                value={totalscore}
                onChange={(e) => setTotalScore(e.target.value)}
                max={100}
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

FormInputSiswa.propTypes = {
  kelas: PropTypes.array.isRequired,
};

export default FormInputSiswa;
