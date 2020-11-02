import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import {
  getAllDocumentReference,
  fetchAllDocumentReference,
} from "src/modules/contributor/index";
import { REFERENCE, ALL } from "src/constants";
import { connect } from "react-redux";

import LoadingSpinner from "src/common/loadingSpinner/LoadingSpinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "src/common/axiosClient";

import { handleInputChange } from "src/common/handleInputChange";

class ReferenceModal extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      selectedReference: "",
      gridApi: "",
      gridColumnApi: "",
      loading: false,
      page: 0,
      extraInfo: "",
    };
  }

  handleInput = (event) => handleInputChange(event, this);

  componentDidMount = () => {
    this.setState({ loading: true });
    axiosClient.get(REFERENCE + ALL).then((response) => {
      this.props.fetchAllDocumentReference(
        response.data.result_data.references
      );
      this.setState({ loading: false });
    });
  };

  onGridReady = (params) => {
    let currentState = this.state;
    currentState.gridApi = params.api;
    currentState.gridColumnApi = params.columnApi;
    this.setState(currentState);
  };

  onSelectionChanged = () => {
    let nodes = this.state.gridApi.getSelectedNodes();
    let selectedRow = [];
    nodes.forEach((node) => {
      if (typeof node !== "undefined") {
        selectedRow.push(node.data);
      }
    });
    let currentState = this.state;
    currentState.selectedReference = selectedRow[0];
    this.setState(currentState);
  };

  addReference = () => {
    let selectedReference = this.state.selectedReference;
    let referenceObject = {
      id: selectedReference.reference_document_id,
      page: this.state.page,
      extra_info: this.state.extraInfo,
      reference_name: selectedReference.reference_name,
    };
    this.props.addReference(referenceObject);
    this.props.toggle();
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>Reference</ModalHeader>
          <ModalBody>
            <LoadingSpinner
              loading={this.state.loading}
              text="Loading reference"
            >
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: 465 }}
              >
                <AgGridReact
                  onGridReady={this.onGridReady}
                  rowData={this.props.documentReferenceList}
                  rowSelection="single"
                  rowMultiSelectWithClick
                  onSelectionChanged={this.onSelectionChanged.bind(this)}
                >
                  <AgGridColumn
                    width={100}
                    field="reference_document_id"
                    headerName="Id"
                    sortable
                    filter
                  ></AgGridColumn>
                  <AgGridColumn
                    width={365}
                    field="reference_name"
                    headerName="Name"
                    sortable
                    filter
                  ></AgGridColumn>
                </AgGridReact>
              </div>
              <FormGroup>
                <Label>Page</Label>
                <Input
                  type="number"
                  name="page"
                  min="0"
                  value={this.state.page}
                  onChange={this.handleInput}
                />
              </FormGroup>
              <FormGroup>
                <Label>Extra info</Label>
                <Input
                  name="extraInfo"
                  value={this.state.extraInfo}
                  onChange={this.handleInput}
                />
              </FormGroup>
            </LoadingSpinner>
          </ModalBody>
          <ModalFooter>
            <Button color="success">
              <FontAwesomeIcon icon={faPlus} /> New reference
            </Button>
            <Button color="success" onClick={this.addReference}>
              <FontAwesomeIcon icon={faPlus} /> Add
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  documentReferenceList: getAllDocumentReference(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllDocumentReference: (documentReferenceList) =>
    dispatch(fetchAllDocumentReference(documentReferenceList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceModal);
