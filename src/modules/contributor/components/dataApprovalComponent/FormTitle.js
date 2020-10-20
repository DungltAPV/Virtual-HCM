import React from "react";
import { Row, Col } from "reactstrap";

const FormTitle = (props) => {
  return (
    <Row xs="1">
      <Col>
        <h1 className="text-center m-3">{props.title}</h1>
      </Col>
    </Row>
  );
};

export default FormTitle;
