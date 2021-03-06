import React, { Fragment } from 'react';
import { Badge, Col, Row } from 'reactstrap';

import { reportType } from 'src/modules/contributor';

const DetailModalViewOnly = (props) => {
  return (
    <Fragment>
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Report type: </Col>
        <Col className='col-9'>
          <h5>
            <Badge
              color={`${
                reportType[props.report.report_type] === reportType[1]
                  ? 'danger'
                  : 'primary'
              }`}
            >
              {reportType[props.report.report_type]}
            </Badge>
          </h5>
        </Col>
      </Row>
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Reporter:</Col>
        <Col className='col-9'>{props.report.reporter}</Col>
      </Row>
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Reporter Note:</Col>
        <Col className='col-9 text-break'>{props.report.reporter_note}</Col>
      </Row>
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Reported Intent:</Col>
        <Col className='col-9 text-break'>
          {props.report.reported_intent && (
            <h5>
              <Badge color='success'>{props.report.reported_intent}</Badge>
            </h5>
          )}
        </Col>
      </Row>
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Report Data:</Col>
        <Col className='col-9 text-break'>{props.report.report_data}</Col>
      </Row>
      {props.report.report_type === 1 && (
        <div>
          <Row className='custom-border'>
            <Col className='col-3 font-weight-bold'>Question: </Col>
            <Col className='col-9 message'>{props.report.question}</Col>
          </Row>
          <Row className='custom-border'>
            <Col className='col-3 font-weight-bold'>Bot answer: </Col>
            <Col className='col-9 message'>{props.report.bot_answer}</Col>
          </Row>
        </div>
      )}
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Bot version date:</Col>
        <Col className='col-9'>{props.report.bot_version_date}</Col>
      </Row>
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Processor:</Col>
        <Col className='col-9 text-break'>{props.report.processor}</Col>
      </Row>
      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Processor Note:</Col>
        <Col className='col-9 text-break'>{props.report.processor_note}</Col>
      </Row>
      {props.report.forward_intent_name && (
        <Row className='custom-border'>
          <Col className='col-3 font-weight-bold'>Forward Intent Name:</Col>
          <Col className='col-9 text-break'>
            {props.report.forward_intent_name}
          </Col>
        </Row>
      )}

      <Row className='custom-border'>
        <Col className='col-3 font-weight-bold'>Modified Date:</Col>
        <Col className='col-9'>{props.report.mdate}</Col>
      </Row>
    </Fragment>
  );
};

export default DetailModalViewOnly;
