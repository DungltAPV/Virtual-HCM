import React, { Component } from 'react';
import {
  Button,
  Input,
  Popover,
  PopoverHeader,
  PopoverBody,
  Alert,
  ButtonGroup,
  Row,
  Col,
} from 'reactstrap';
import { handleInputChange } from 'src/common/handleInputChange';
import { KNOWLEDGE_DATA, REVIEW } from 'src/constants';
import {
  ACCEPT,
  DECLINE,
  DRAFT,
  getDataApprovalDetail,
} from 'src/modules/contributor/index';
import { connect } from 'react-redux';

import axiosClient from 'src/common/axiosClient';
import LoadingSpinner from 'src/common/loadingSpinner/LoadingSpinner';
import { history } from 'src/common/history';
import { CONTRIBUTOR_PAGE_LIST_KNOWLEDGE_DATA } from 'src/constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faEdit,
  faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons';

class ReviewModal extends Component {
  _isMounted = false;
  constructor(props) {
    super();
    this.state = {
      buttonId: props.buttonId,
      comment: '',
      loading: false,
      status: null,
    };
  }

  handleInput = (event) => {
    handleInputChange(event, this);
  };

  componentDidMount = () => {
    this._isMounted = true;
    const userReview = this.props.dataApprovalDetail.user_review;
    userReview &&
      this._isMounted &&
      this.setState({
        comment: userReview.review_detail,
        status: userReview.status,
      });
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  setLoading = (status) => {
    this._isMounted && this.setState({ loading: status });
  };

  sendReview = (status) => {
    this._isMounted && this.setState({ status: -1 });
    this.setLoading(true);
    this.props.setErrorAlert(false);
    let data = {
      knowledge_data: this.props.knowledgeDataId,
      status: status,
      review_detail: this.state.comment,
    };
    axiosClient
      .post(KNOWLEDGE_DATA + REVIEW, data)
      .then((response) => {
        this.setLoading(false);
        if (response.data.status) {
          if (data.status === DRAFT) {
            this._isMounted && this.setState({ status: 4 });
          } else {
            history.push(CONTRIBUTOR_PAGE_LIST_KNOWLEDGE_DATA);
          }
        } else {
          this.props.setSuccessAlert(false);
          this.props.setErrorAlert(true);
        }
      })
      .catch((err) => {
        this.setLoading(false);
        this.props.setSuccessAlert(false);
        this.props.setErrorAlert(true);
      });
  };

  getAlert = () => {
    let message = (status) => `You have ${status} this knowledge data`;
    switch (this.state.status) {
      case 1:
        return <Alert color="success">{message('accepted')}</Alert>;
      case 2:
        return <Alert color="danger">{message('declined')}</Alert>;
      case 3:
        return (
          <Alert color="warning">{message('to re-review or finish')}</Alert>
        );
      case 4:
        return <Alert color="success">You have save this draft</Alert>;
      default:
        return '';
    }
  };

  render() {
    return (
      <Popover
        placement="bottom"
        isOpen={this.props.isOpen}
        target={this.props.buttonId}
        toggle={this.props.toggle}
        className="popover-width"
        hideArrow={true}
        flip={false}
      >
        <LoadingSpinner loading={this.state.loading} text="Sending review" />
        <PopoverHeader>
          <Row>
            <Col>Review knowledge data</Col>
            <Col xs="auto">
              <FontAwesomeIcon
                className="review-minimize-button"
                onClick={this.props.toggle}
                icon={faWindowMinimize}
              />
            </Col>
          </Row>
        </PopoverHeader>
        <PopoverBody>
          {this.state.status && this.getAlert()}
          <div className="w-600px">
            <Input
              onChange={this.handleInput}
              value={this.state.comment}
              className="h-170px comment-area"
              placeholder="Enter comment here"
              type="textarea"
              name="comment"
            />
            <div className="d-flex justify-content-end mt-2">
              <ButtonGroup>
                <Button
                  size="sm"
                  color="success"
                  onClick={() => {
                    this.sendReview(ACCEPT);
                  }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Approve
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => {
                    this.sendReview(DECLINE);
                  }}
                >
                  <FontAwesomeIcon icon={faTimesCircle} /> Decline
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  onClick={() => {
                    this.sendReview(DRAFT);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Draft
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </PopoverBody>
      </Popover>
    );
  }
}

const mapStateToProps = (state) => ({
  dataApprovalDetail: getDataApprovalDetail(state),
});

export default connect(mapStateToProps)(ReviewModal);
