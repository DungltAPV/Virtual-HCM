import React, { Component, Fragment } from 'react';
import { Row, Col, Label, Button, Input } from 'reactstrap';
import axiosClient from 'src/common/axiosClient';
import { NLP, TOKENIZE } from 'src/constants';
import { handleInputChange } from 'src/common/handleInputChange';
import { V, N } from 'src/modules/contributor/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faHammer } from '@fortawesome/free-solid-svg-icons';

class RawData extends Component {
  _isMounted = false;
  constructor(props) {
    super();
    this.state = {
      mode: 'NORMAL',
      tokenizeData: [],
      ner: [],
      loading: false,
      rawData: props.rawDataValue ? props.rawDataValue : '',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.setLoading(false);
    if (this.props.detailPage) {
      this.stateTokenizeRawData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleInput = (event) => {
    handleInputChange(event, this);
    this.props.onChange(event, this);
  };

  stateTokenizeRawData = () => {
    const paragraph = {
      paragraph: this.state.rawData,
    };
    if (paragraph.paragraph !== '') {
      this.props.setLoading(true, 'Tokenizing data');
      axiosClient
        .post(NLP + TOKENIZE, paragraph)
        .then((response) => {
          this.props.setLoading(false, 'Tokenizing data');
          if (response.data.status) {
            let fullArray = [];
            response.data.result_data.pos.forEach((array) => {
              fullArray.push(...array);
            });
            let modifiedNer = [];
            let ner = response.data.result_data.ner;
            for (let sentenceIndex in ner) {
              for (let idx in ner[sentenceIndex]) {
                let type = ner[sentenceIndex][idx].type;
                let word = ner[sentenceIndex][idx].word;
                let index = ner[sentenceIndex][idx].start_idx;
                if (sentenceIndex === 0) {
                  modifiedNer.push({
                    type: type,
                    word: word,
                    index: index,
                  });
                } else {
                  let index = ner[sentenceIndex][idx].start_idx;
                  for (let i = 0; i < sentenceIndex; i++) {
                    index += response.data.result_data.pos[i].length;
                  }
                  modifiedNer.push({
                    type: type,
                    word: word,
                    index: index,
                  });
                }
              }
            }
            if (this._isMounted)
              this.setState({
                mode: 'TOKENIZE',
                tokenizeData: fullArray,
                ner: modifiedNer,
              });
            this.setTokenizedWordArray();
          } else {
            this.props.setSuccessAlert(false);
            this.props.setErrorAlert(true);
            this.props.setLoading(false, 'Tokenizing data');
            this.props.setErrorList(response.data.messages);
            this.props.scrollToTop();
          }
        })
        .catch((err) => {
          this.props.setLoading(false, 'Tokenizing data');
          if (this._isMounted) this.setState({ loading: false });
          this.props.setErrorAlert(true);
          this.props.setSuccessAlert(false);
          this.props.scrollToTop();
        });
    }
  };

  setRawData = () => {
    this.props.setRawData(this.state.rawData);
  };

  setTokenizedWordArray = () => {
    this.props.setTokenizeWord(this.state.tokenizeData, this.state.ner);
  };

  stateCancelTokenize = () => {
    this.props.setTokenizeWord([], []);
    this._isMounted && this.setState({ mode: 'NORMAL' });
    this.props.cancelCriticalData();
  };

  renderRawDataMode = () => {
    if (this.state.mode === 'TOKENIZE') {
      return (
        <Row>
          <Col>
            <div className="d-flex flex-wrap">
              {this.state.tokenizeData.map((data, index) => {
                let flag = false;
                this.state.ner.forEach((ner) => {
                  if (ner.index === index) flag = true;
                });
                let className = 'mr-1 word-box ';

                let hoverWordList = this.props.hoverWord.split(' ');
                hoverWordList.forEach((word) => {
                  if (word === data.value) {
                    className += 'hover-word ';
                  }
                });

                if (data.type === V) {
                  className += 'verb ';
                } else if (data.type === N) {
                  className += 'noun ';
                } else if (flag) {
                  className += 'name ';
                }
                return (
                  <span title={data.type} key={index} className={className}>
                    {data.value}
                  </span>
                );
              })}
            </div>
          </Col>
          <Col xs="auto">
            {!this.props.disable && (
              <Button
                disabled={this.props.disable}
                type="button"
                color="danger"
                onClick={this.stateCancelTokenize}
              >
                <FontAwesomeIcon icon={faBan} /> Cancel
              </Button>
            )}
          </Col>
        </Row>
      );
    } else {
      return (
        <Fragment>
          <Row>
            {!this.props.disable && (
              <Col>
                <Input
                  disabled={this.props.disable}
                  placeholder="Enter raw data here and remember to tokenize it :3"
                  required
                  type="textarea"
                  name="rawData"
                  id="rawData"
                  value={this.state.rawData}
                  onChange={this.handleInput}
                />
              </Col>
            )}
          </Row>
          <Row className="mt-2">
            <Col>
              <Button
                disabled={this.props.disable}
                type="button"
                color="primary"
                onClick={this.stateTokenizeRawData}
                block
              >
                <FontAwesomeIcon icon={faHammer} /> Tokenize
              </Button>
            </Col>
          </Row>
        </Fragment>
      );
    }
  };

  render() {
    return (
      <Row xs="1">
        <Col>
          <Label className="label" for="rawData">
            Raw data:
          </Label>
        </Col>
        <Col>{this.renderRawDataMode()}</Col>
      </Row>
    );
  }
}

export default RawData;
