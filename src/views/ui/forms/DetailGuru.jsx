import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

const DetailGuru = ({ guruprops }) => {
  const [show, setShow] = useState(false);

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
            Detail Data Guru
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNameGuru">
              <Form.Label>Nama Guru</Form.Label>
              <Form.Control
                type="text"
                placeholder={guruprops.name_guru || "Nama Guru"}
                defaultValue={guruprops.name_guru}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSex">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Control
                type="text"
                placeholder={guruprops.sex || "Jenis Kelamin"}
                defaultValue={guruprops.sex}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEducation">
              <Form.Label>Pendidikan</Form.Label>
              <Form.Control
                type="text"
                placeholder={guruprops.pendidikan || "Pendidikan"}
                defaultValue={guruprops.pendidikan}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubject">
              <Form.Label>Bidang Pendidikan</Form.Label>
              <Form.Control
                type="text"
                placeholder={guruprops.bid_pendidikan || "Bidang Pendidikan"}
                defaultValue={guruprops.bid_pendidikan}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder={guruprops.email || "Email"}
                defaultValue={guruprops.email}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTeacherID">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder={guruprops.real_password || "ID Guru"}
                defaultValue={guruprops.real_password}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

DetailGuru.propTypes = {
  guruprops: PropTypes.object,
};

export default DetailGuru;
