import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import { columnGenSentenceDef } from "src/modules/contributor/index";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import LoadingSpinner from "src/common/loadingSpinner/LoadingSpinner";

class GenSynonymSentenceModal extends Component {
  constructor(props) {
    super();
    this.state = {
      gridApi: "",
      gridColumnApi: "",
      selectedSentence: [],
    };
  }
  onGridReady = (params) => {
    this.setState({ gridApi: params.api, gridColumnApi: params.columnApi });
  };

  onSelectionChanged = () => {
    let nodes = this.state.gridApi.getSelectedNodes();
    let selectedRow = [];
    nodes.forEach((node) => {
      if (typeof node !== "undefined") {
        selectedRow.push(node.data);
      }
    });
    this.setState({ selectedSentence: selectedRow });
  };

  setSelectedSentence = () => {
    this.props.setSelectedSentence(this.state.selectedSentence);
    this.props.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <LoadingSpinner
          loading={this.props.loading}
          text="Generating sentences"
        >
          <Form>
            <ModalHeader toggle={this.props.toggle}>
              Generate sentence
            </ModalHeader>
            <ModalBody>
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: 465 }}
              >
                <AgGridReact
                  modules={[SetFilterModule]}
                  onGridReady={this.onGridReady}
                  rowData={this.props.similaries}
                  onFirstDataRendered={this.firstDataRendered}
                  rowSelection="multiple"
                  rowMultiSelectWithClick
                  onSelectionChanged={this.onSelectionChanged.bind(this)}
                  columnDefs={columnGenSentenceDef}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={this.setSelectedSentence}>
                Create
              </Button>
              <Button type="button" color="danger" onClick={this.props.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </LoadingSpinner>
      </Modal>
    );
  }
}

export default GenSynonymSentenceModal;
