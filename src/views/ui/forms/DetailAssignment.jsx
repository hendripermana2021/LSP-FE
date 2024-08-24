import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { Badge, Card, Col, Row } from "react-bootstrap";

const DetailAssignment = (props) => {
  const [show, setShow] = useState(false);
  const assignmentprops = props.assignmentprops;

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
            Detail Test
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Card>
              <Card.Header>{assignmentprops.title}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Row className="mb-2">
                    <Col sm={3}>
                      <strong>Description</strong>
                    </Col>
                    <Col sm={8}>{assignmentprops.description}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={3}>
                      <strong>Total Score</strong>
                    </Col>
                    <Col sm={8}>{assignmentprops.totalscore}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={3}>
                      <strong>For Class</strong>
                    </Col>
                    <Col sm={8}>{assignmentprops.for_class}</Col>
                  </Row>
                </Card.Text>
                {/* <Button variant="primary">Go somewhere</Button> */}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>Soal</Card.Header>
              <Card.Body>
                {assignmentprops.question.map((assignment) => (
                  <Card.Text>
                    <Row className="mb-2">
                      <Col sm={9}>{assignment.text_question}</Col>
                      <Col sm={3}>
                        Answer :{" "}
                        <Badge bg="primary">{assignment.correctoption}</Badge>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      {assignment.option
                        .sort((a, b) => a.label.localeCompare(b.label)) // Sort the options by label in ascending order (A - D)
                        .map((option) => (
                          <Col sm={6} key={option.label}>
                            {" "}
                            {/* Add a key for each mapped element */}
                            {option.label}. {option.text}
                          </Col>
                        ))}
                    </Row>
                    <hr />
                  </Card.Text>
                ))}
                {/* <Button variant="primary">Go somewhere</Button> */}
              </Card.Body>
            </Card>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

DetailAssignment.propTypes = {
  assignmentprops: PropTypes.object,
};

export default DetailAssignment;
