import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { SiAsda } from "react-icons/si";

const DetailAssignment = (props) => {
  const [show, setShow] = useState(false);
  const question = props.questionprops;

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
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Detail Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="question-container mb-5">
              {/* Question Section */}
              <div className="bg-light border rounded-lg p-4 mb-4 shadow">
                <h6 className="text-primary mb-2">Question</h6>
                <p className="font-weight-bold text-dark mb-0">
                  {question.text_question || "The question will appear here."}
                </p>
              </div>

              {/* Options Section */}
              <div className="options-container">
                <h5 className="text-secondary mb-3">Options</h5>
                {question.option
                  .sort((a, b) => a.label.localeCompare(b.label)) // Sort the options by label in ascending order (A - D)
                  .map((option) => (
                    <div
                      key={option.id}
                      className="d-flex align-items-center mb-3 p-3 bg-white border rounded-lg shadow-sm"
                    >
                      <div
                        className="option-label bg-primary text-white rounded-circle text-center mr-3"
                        style={{
                          width: "30px",
                          height: "30px",
                          lineHeight: "30px",
                          marginRight: "10px",
                        }}
                      >
                        {option.label}
                      </div>
                      <div className="option-text">
                        <p className="mb-0 text-muted">{option.text}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

DetailAssignment.propTypes = {
  questionprops: PropTypes.object,
};

export default DetailAssignment;
