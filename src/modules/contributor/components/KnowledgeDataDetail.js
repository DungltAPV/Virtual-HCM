import React, { Component } from 'react';
import { connect } from 'react-redux';
import axiosClient from 'src/common/axiosClient';
import { Button, Container, Row, Col, Form } from 'reactstrap';
import { GET_KNOWLEDGE_DATA_BY_INTENT_PARAMS } from 'src/constants';
import LoadingSpinner from 'src/common/loadingSpinner/LoadingSpinner';
import {
  getDataApprovalDetail,
  pullDataApproval,
  Question,
  FormSectionTitle,
  MetaData,
  Synonyms,
  RawData,
  BaseResponse,
  Coresponse,
  CriticalData,
} from 'src/modules/contributor/index';
import 'src/static/stylesheets/contributor.css';
import SuccessAlert from 'src/common/alertComponent/SuccessAlert';
import ErrorAlert from 'src/common/alertComponent/ErrorAlert';
import {
  handleInputFormChange,
  handleInputChange,
} from 'src/common/handleInputChange';
import { history } from 'src/common/history';

import { CONTRIBUTOR_PAGE_LIST_KNOWLEDGE_DATA } from 'src/constants';
import { KNOWLEDGE_DATA, EDIT } from 'src/constants';

class KnowledgeDataDetail extends Component {
  _isMounted = false;
  constructor(props) {
    super();
    this.state = {
      form: {
        intent: '',
        intentFullName: '',
        questions: [],
        criticalData: [],
        coresponse: [],
        rawData: '',
        synonyms: [],
        baseResponse: '',
        documentReference: [],
      },
      documentList: [],
      tokenizedWord: [],
      ner: [],
      loading: true,
      hoverWord: '',
      hoverWordFromSynonym: '',
      alertMessage: '',
      successAlert: false,
      errorAlert: false,
      errorList: [],
      sendLoading: false,
      synonymIdList: [],
    };
    this.titleRef = React.createRef();
    this.criticalDataRef = React.createRef();
    this.questionRef = React.createRef();
  }

  handleInputForm = (event) => handleInputFormChange(event, this);

  handleInput = (event) => handleInputChange(event, this);

  setTokenizeWord = (tokenizedWordArray, ner) => {
    let tokenizedWord = this.state.tokenizedWord;
    let nerArray = this.state.ner;

    tokenizedWordArray.forEach((word) => {
      let flag = false;
      tokenizedWord.forEach((current) => {
        if (current.value === word.value) {
          flag = true;
        }
      });
      if (!flag) tokenizedWord.push(word);
    });

    ner.forEach((ner) => {
      if (!nerArray.includes(ner)) nerArray.push(ner);
    });

    if (this._isMounted)
      this.setState({
        tokenizedWord: tokenizedWord,
        ner: nerArray,
      });
  };

  reformatForm = () => {
    let form = this.state.form;
    let synonym = [];
    form.synonyms.forEach((synonyms) => {
      let synonymIds = [];
      synonyms.synonyms.forEach((item) => {
        synonymIds.push(item.id);
      });
      synonym.push({ word: synonyms.word, synonyms: synonymIds });
    });
    form.synonyms = synonym;
    this._isMounted && this.setState({ form: form });
  };

  submitForm = (event) => {
    event.preventDefault();
    this.reformatForm();
    if (this.state.errorList.length === 0) {
      this._isMounted &&
        this.setState({
          sendLoading: true,
        });
      axiosClient
        .post(KNOWLEDGE_DATA + EDIT, this.state.form)
        .then((response) => {
          this._isMounted &&
            this.setState({
              sendLoading: false,
            });
          if (response.data.status) {
            history.push(CONTRIBUTOR_PAGE_LIST_KNOWLEDGE_DATA);
            this.setErrorAlert(false);
            this.setSuccessAlert(true);
          } else {
            this.setErrorList(response.data.messages);
            this.setErrorAlert(true);
            this.setSuccessAlert(false);
            this.scrollToTop();
          }
        })
        .catch((err) => {
          this._isMounted &&
            this.setState({
              sendLoading: false,
            });
          this.setErrorAlert(true);
          this.setSuccessAlert(false);
          this.scrollToTop();
        });
    } else {
      this._isMounted &&
        this.setState({ errorAlert: true, sendLoading: false });
    }
  };

  setCoresponse = (coresponse) => {
    let form = this.state.form;
    form.coresponse = coresponse;
    if (this._isMounted) this.setState({ form: form });
  };

  setCriticalData = (criticalData) => {
    let form = this.state.form;
    form.criticalData = criticalData;
    if (this._isMounted) this.setState({ form: form });
  };

  setQuestions = (questions) => {
    let form = this.state.form;
    form.questions = questions;
    if (this._isMounted) this.setState({ form: form });
  };

  setReference = (reference) => {
    let form = this.state.form;
    form.documentReference = reference;
    if (this._isMounted) this.setState({ form: form });
  };

  setSynonym = (synonyms) => {
    let form = this.state.form;
    form.synonyms = synonyms;
    this.resetGeneratedQuestion();
    if (this._isMounted) this.setState({ form: form });
  };

  setRawData = (rawData) => {
    let form = this.state.form;
    form.rawData = rawData;
    if (this._isMounted) this.setState({ form: form });
  };

  setBaseResponse = (baseResponse) => {
    let form = this.state.form;
    form.baseResponse = baseResponse;
    if (this._isMounted)
      this.setState({
        form: form,
      });
  };

  hover = (word, from) => {
    if (from === 'SYNONYM')
      if (this._isMounted)
        this.setState({ hoverWord: word, hoverWordFromSynonym: word });
      else {
        if (this._isMounted) this.setState({ hoverWord: word });
      }
  };

  setSuccessAlert = (status) => {
    this._isMounted &&
      this.setState({
        successAlert: status,
      });
  };

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

  scrollToTop = () => {
    this.titleRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.getInformation();
  };

  getInformation = () => {
    if (
      this.props.dataApprovalDetail &&
      this.props.dataApprovalDetail.intent === this.props.intent
    ) {
      this.setFormData(this.props.dataApprovalDetail);
    } else {
      this._isMounted && this.setState({ loading: true });
      axiosClient
        .get(GET_KNOWLEDGE_DATA_BY_INTENT_PARAMS(this.props.intent))
        .then((response) => {
          if (response.data.status) {
            this.setFormData(response.data.result_data.knowledge_data);
            this.props.pullDataApproval(
              response.data.result_data.knowledge_data
            );
            this.setErrorAlert(false);
            this.setSuccessAlert(true);
          } else {
            this.setErrorAlert(true);
            this.setSuccessAlert(false);
          }
        })
        .catch((err) => {
          this.setErrorAlert(true);
          this._isMounted && this.setState({ loading: false });
        });
    }
  };

  setFormData = (dataApproval) => {
    let form = this.state.form;
    form.baseResponse = dataApproval.baseResponse;
    form.coresponse = dataApproval.coresponse;
    form.criticalData = dataApproval.criticalData;
    let referenceList = [];
    dataApproval.documentReference.forEach((reference) => {
      referenceList.push({
        name: reference.name,
        extra_info: reference.extra_info,
        id: reference.id,
        page: reference.page ? reference.page.toString() : '',
      });
    });
    form.documentReference = referenceList;
    form.intent = dataApproval.intent;
    form.intentFullName = dataApproval.intentFullName;
    form.questions = dataApproval.questions;
    form.rawData = dataApproval.rawData;
    form.synonyms = dataApproval.synonyms;
    form.id = dataApproval.id;

    let synonym = [];
    form.synonyms.forEach((synonyms) => {
      let synonymIds = [];
      synonyms.synonyms.forEach((item) => {
        synonymIds.push(item.id);
      });
      synonym.push({ word: synonyms.word, synonyms: synonymIds });
    });

    this._isMounted &&
      this.setState({ form: form, loading: false, synonymIdList: synonym });
  };

  getWordArray = () => {
    const rawData = this.state.tokenizedWord;
    let wordArray = [];
    for (let index in rawData) {
      wordArray.push(rawData[index]);
    }
    return wordArray;
  };

  cancelCriticalData = () => {
    this.criticalDataRef.current.resetCriticalData();
  };

  resetGeneratedQuestion = () => {
    this.questionRef.current.resetGeneratedQuestion();
  };

  render() {
    const wordArray = this.getWordArray();
    return (
      <Container fluid={true}>
        <LoadingSpinner
          loading={this.state.loading}
          text="Loading information"
        />
        <LoadingSpinner loading={this.state.sendLoading} text="Sending form" />
        {!this.state.loading && (
          <Form className="mt-3">
            <div className="form-item form-item-meta pr-3 pl-3">
              <div className="mr-3 ml-3">
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
              </div>
              <Row xs="1">
                <Col>
                  <h4 className="text-center m-3" ref={this.titleRef}>
                    Edit knowledge data: {this.props.intent}
                    <br />
                    ID: {this.state.form.id}
                  </h4>
                </Col>
              </Row>
              <FormSectionTitle title="Meta data" />
              <MetaData
                intentValue={this.state.form.intent}
                intentFullNameValue={this.state.form.intentFullName}
                referenceValue={this.state.form.documentReference}
                onChange={this.handleInputForm}
                setReference={this.setReference}
                scrollToTop={this.scrollToTop}
                setAlertMessage={this.setAlertMessage}
                setSuccessAlert={this.setSuccessAlert}
                setErrorAlert={this.setErrorAlert}
                setErrorList={this.setErrorList}
              />
              <hr className="mr-3 ml-3 divider" />
              <FormSectionTitle title="Data analysis" />
              {this.state.form.rawData && (
                <RawData
                  detailPage={true}
                  rawDataValue={this.state.form.rawData}
                  scrollToTop={this.scrollToTop}
                  setAlertMessage={this.setAlertMessage}
                  setSuccessAlert={this.setSuccessAlert}
                  setErrorAlert={this.setErrorAlert}
                  setErrorList={this.setErrorList}
                  hover={this.hover}
                  hoverWord={this.state.hoverWordFromSynonym}
                  setTokenizeWord={this.setTokenizeWord}
                  getWordArray={this.getWordArray}
                  setRawData={this.setRawData}
                  cancelCriticalData={this.cancelCriticalData}
                  onChange={this.handleInputForm}
                />
              )}

              <CriticalData
                ref={this.criticalDataRef}
                criticalDataValue={this.state.form.criticalData}
                wordArray={wordArray}
                setCritical={this.setCriticalData}
              />

              <Coresponse
                coresponseValue={this.state.form.coresponse}
                setCoresponse={this.setCoresponse}
                wordArray={wordArray}
              />
              <Question
                ref={this.questionRef}
                detailPage={true}
                questionValue={this.state.form.questions}
                scrollToTop={this.scrollToTop}
                setAlertMessage={this.setAlertMessage}
                setSuccessAlert={this.setSuccessAlert}
                setErrorAlert={this.setErrorAlert}
                setErrorList={this.setErrorList}
                setQuestions={this.setQuestions}
                setTokenizeWord={this.setTokenizeWord}
                hover={this.hover}
                hoverWord={this.state.hoverWordFromSynonym}
                synonymsArray={this.state.form.synonyms}
                synonymIds={this.state.synonymIdList}
                className="mt-3"
              />

              <BaseResponse
                baseResponseValue={this.state.form.baseResponse}
                onChange={this.handleInputForm}
              />

              <Synonyms
                scrollToTop={this.scrollToTop}
                setAlertMessage={this.setAlertMessage}
                setSuccessAlert={this.setSuccessAlert}
                setErrorAlert={this.setErrorAlert}
                setErrorList={this.setErrorList}
                setSynonym={this.setSynonym}
                wordArray={wordArray}
                hover={this.hover}
                hoverWord={this.state.hoverWord}
                resetGeneratedQuestion={this.resetGeneratedQuestion}
                synonymsValue={this.state.form.synonyms}
              />
              <Row className="d-flex justify-content-around pt-3 pb-3">
                <Button type="submit" color="info" onClick={this.submitForm}>
                  Edit data approval
                </Button>
              </Row>
            </div>
          </Form>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  dataApprovalDetail: getDataApprovalDetail(state),
});

const mapDispatchToProps = (dispatch) => ({
  pullDataApproval: (dataApproval) => dispatch(pullDataApproval(dataApproval)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KnowledgeDataDetail);