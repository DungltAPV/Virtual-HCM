import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Button, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import {
  CONTRIBUTOR_PAGE_CREATE_KNOWLEDGE_DATA_FORM,
  ALL,
  KNOWLEDGE_DATA,
  GET_KNOWLEDGE_DATA_BY_INTENT,
} from 'src/constants';
import {
  columnFieldDef,
  // context,
  // frameworkComponents,
  getAllDataApproval,
  fetchAllDataApproval
} from 'src/modules/contributor/index';
import { AgGridReact } from 'ag-grid-react';
import SuccessAlert from 'src/common/alertComponent/SuccessAlert';
import ErrorAlert from 'src/common/alertComponent/ErrorAlert';

import axiosClient from 'src/common/axiosClient';
import 'src/static/stylesheets/contributor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faWrench } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from 'src/common/loadingSpinner/LoadingSpinner';

class KnowledgeDataList extends Component {
  _isMounted = false;
  constructor(props) {
    super();
    this.state = {
      containerHeight: 0,
      alertMessage: '',
      errorList: [],
      loading: false,
      errorAlert: false,
      intent: '',
    };
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
    const containerHeight = document.getElementById('cl-container')
      .clientHeight;
    this.setState({
      containerHeight,
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  setErrorAlert = (status) => {
    this._isMounted &&
      this.setState({
        errorAlert: status,
      });
  };

  setErrorList = (list) => {
    this._isMounted &&
      this.setState({
        errorList: list,
      });
  };

  setSuccessAlert = (status) => {
    this._isMounted &&
      this.setState({
        successAlert: status,
      });
  };

  setAlertMessage = (message) => {
    this._isMounted &&
      this.setState({
        alertMessage: message,
      });
  };

  onDismiss = (name) => {
    this._isMounted &&
      this.setState({
        [name]: false,
      });
  };

  setData = async () => {
    this._isMounted && this.setState({ loading: true });
    axiosClient
      .get(KNOWLEDGE_DATA + ALL)
      .then((response) => {
        this._isMounted && this.setState({ loading: false });
        if (response.data.status) {
          this.props.fetchAllDataApproval(response.data.result_data.knowledges);
          this.setAlertMessage('Load successful');
          this.setSuccessAlert(true);
        } else {
          this.setErrorList(response.data.messages);
          this.setErrorAlert(true);
          this.setSuccessAlert(false);
          this.scrollToTop();
        }
      })
      .catch((error) => {
        this.setErrorAlert(true);
        this.setSuccessAlert(false);
        this._isMounted && this.setState({ loading: false });
      });
  };

  onGridReady = async (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    await this.setData();
    await this.gridApi.sizeColumnsToFit();
  };

  onRowSelected = () => {
    let selectedRows = this.gridApi.getSelectedRows();
    let intent = selectedRows.length === 1 ? selectedRows[0].intent : '';
    this._isMounted && this.setState({
      intent,
    });
  };

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  };

  render() {
    return (
      <Container id="cl-container" className="cl-container vh-100">
        <LoadingSpinner
          loading={this.state.loading}
          text="Loading knowledge data"
        />
        <Row>
          <Col className="justify-content-center d-flex">
            <h5 className="mt-2 mb-2">Knowledge data</h5>
          </Col>
        </Row>
        {this.state.successAlert && (
          <SuccessAlert
            successAlert={this.state.successAlert}
            text={this.state.alertMessage}
            onDismiss={() => this.onDismiss('successAlert')}
          />
        )}
        {this.state.errorAlert && (
          <ErrorAlert
            errorAlert={this.state.errorAlert}
            errorList={this.state.errorList}
            onDismiss={() => this.onDismiss('errorAlert')}
          />
        )}
        <Row className="d-flex flex-row-reverse">
          <Col xs="auto">
            <Link
              to={CONTRIBUTOR_PAGE_CREATE_KNOWLEDGE_DATA_FORM}
              className="link-no-underline"
            >
              <Button color="primary">
                <FontAwesomeIcon icon={faPlus} color="white" />
                &nbsp; Create
              </Button>
            </Link>
          </Col>
          <Col xs="auto">
            {this.state.intent !== '' ? (
              <Link
                to={GET_KNOWLEDGE_DATA_BY_INTENT(this.state.intent)}
                className="link-no-underline"
              >
                <Button color="success">
                  <FontAwesomeIcon icon={faEdit} color="white" />
                    &nbsp; Edit
                  </Button>
              </Link>
            ) : (
                <Button color="success" disabled={this.state.intent === ''}>
                  <FontAwesomeIcon icon={faEdit} color="white" />
                  &nbsp; Edit
                </Button>
              )}
          </Col>
          <Col xs="auto" className="mr-auto">
            <Button color="info" onClick={this.sizeToFit}>
              <FontAwesomeIcon icon={faWrench} color="white" />
                &nbsp; Size column to Fit
              </Button>
          </Col>
        </Row>
        <div
          className="ag-theme-alpine"
          style={{
            height: `${this.state.containerHeight - 200}px`,
            marginTop: '10px',
          }}
        >
          <AgGridReact
            rowData={this.props.dataApprovalList}
            rowSelection="single"
            animateRows={true}
            onGridReady={this.onGridReady}
            onSelectionChanged={this.onRowSelected.bind(this)}
            columnDefs={columnFieldDef}
          // frameworkComponents={frameworkComponents}
          // context={context(this)}
          ></AgGridReact>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  dataApprovalList: getAllDataApproval(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllDataApproval: (dataApprovalList) => {
    dispatch(fetchAllDataApproval(dataApprovalList));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(KnowledgeDataList);