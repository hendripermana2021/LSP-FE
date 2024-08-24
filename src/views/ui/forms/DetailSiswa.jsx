import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

const DetailSiswa = (props) => {
  const [show, setShow] = useState(false);
  const siswaprops = props.siswaprops;

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <button className="dropdown-item" onClick={handleShow}>
        <i className="ti-info menu-icon me-2" />
        Detail
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
            Detail Data Siswa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNameSiswa">
              <Form.Label>Nama Siswa</Form.Label>
              <Form.Control
                type="text"
                placeholder={siswaprops.name_siswa}
                label={siswaprops.name_siswa}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSex">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Control
                type="text"
                placeholder={siswaprops.sex}
                label={siswaprops.sex}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFatherName">
              <Form.Label>Nama Ayah</Form.Label>
              <Form.Control
                type="text"
                placeholder={siswaprops.fathername}
                label={siswaprops.fathername}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMotherName">
              <Form.Label>Nama Ibu</Form.Label>
              <Form.Control
                type="text"
                placeholder={siswaprops.mothername}
                label={siswaprops.mothername}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder={siswaprops.email}
                label={siswaprops.email}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formKelas">
              <Form.Label>Kelas</Form.Label>
              <Form.Control
                type="text"
                placeholder={siswaprops.kelas.name_class}
                label={siswaprops.kelas.name_class}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

DetailSiswa.propTypes = {
  siswaprops: PropTypes.object,
};

export default DetailSiswa;
