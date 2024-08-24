import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

const DetailKelas = (props) => {
  const [show, setShow] = useState(false);
  const kelasprops = props.kelasprops;

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <button className="dropdown-item" onClick={handleShow}>
        <i className="ti-info menu-icon me-2" />
        Detail Kelas
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
            Detail Data Kelas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNameSiswa">
              <Form.Label>Name Kelas</Form.Label>
              <Form.Control
                type="text"
                placeholder={kelasprops.name_class}
                label={kelasprops.name_class}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSex">
              <Form.Label>Wali Kelas</Form.Label>
              <Form.Control
                type="text"
                placeholder={kelasprops.wali_kelas.name_guru}
                label={kelasprops.wali_kelas.name_guru}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

DetailKelas.propTypes = {
  kelasprops: PropTypes.object,
};

export default DetailKelas;
