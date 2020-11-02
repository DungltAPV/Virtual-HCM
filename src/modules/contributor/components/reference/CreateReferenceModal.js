import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  ModalFooter,
  Row,
  Container,
  Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import 'src/static/stylesheets/reference.css';
import { handleInputChange } from 'src/common/handleInputChange';
import axiosClient from 'src/common/axiosClient';
import { REFERENCE, ADD } from 'src/constants';
import { connect } from 'react-redux';
import { addReferenceToList } from 'src/modules/contributor';

class CreateReferenceModal extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      reference_name: '',
      link: '',
      author: '',
      imageSrc: null,
      imagePath: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.state.imageSrc) {
      URL.revokeObjectURL(this.state.imageSrc);
    }
  }

  handleInput = (event) => handleInputChange(event, this);

  onUploadImage = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      this._isMounted && this.setState({ imageSrc: null });
      return;
    }
    const src = event.target.files[0];
    const objectURL = URL.createObjectURL(src);
    this._isMounted && this.setState({ imageSrc: objectURL, imagePath: src });
  };

  addReference = (event) => {
    event.preventDefault();
    let newReference = new FormData();
    newReference.append('reference_name', this.state.reference_name);
    newReference.append('link', this.state.link);
    newReference.append('author', this.state.author);
    newReference.append('cover', this.state.imagePath);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axiosClient
      .post(REFERENCE + ADD, newReference, config)
      .then((response) => {
        if (response.data.status) {
          const reference = response.data.result_data;
          this.props.addReferenceToList(reference);
        } else {
          console.log(response.data.status);
        }
      })
      .catch(() => {});
    this.props.addReference();
    this.props.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>
          Create New Document Reference
        </ModalHeader>
        <Form onSubmit={this.addReference}>
          <ModalBody>
            <Container>
              <Row>
                <Col className="col-3">
                  <Row className="justify-content-center mb-3">
                    <img
                      type="image"
                      name="coverImage"
                      alt="book cover"
                      className="cover-image"
                      src={this.state.imageSrc}
                    ></img>
                  </Row>
                  <Row className="justify-content-center upload-btn-wrapper">
                    <Button color="warning">
                      <FontAwesomeIcon icon={faFolderOpen} color="white" />
                    </Button>
                    <Input
                      className="upload-hidden"
                      type="file"
                      name="coverFile"
                      id="coverFile"
                      accept="image/*"
                      onChange={this.onUploadImage}
                    />
                  </Row>
                </Col>
                <Col className="col-9">
                  <FormGroup>
                    <Label>Reference name</Label>
                    <Input
                      required
                      type="text"
                      name="reference_name"
                      placeholder="Reference name"
                      value={this.state.reference_name}
                      onChange={this.handleInput}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Author</Label>
                    <Input
                      required
                      type="text"
                      name="author"
                      placeholder="Author"
                      value={this.state.author}
                      onChange={this.handleInput}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Link</Label>
                    <Input
                      required
                      type="text"
                      name="link"
                      placeholder="Link"
                      value={this.state.link}
                      onChange={this.handleInput}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              <FontAwesomeIcon icon={faPlus} color="white" />
              &nbsp; Create
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addReferenceToList: (reference) => dispatch(addReferenceToList(reference)),
});
export default connect(null, mapDispatchToProps)(CreateReferenceModal);
