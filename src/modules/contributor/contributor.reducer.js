import { LOGOUT } from 'src/constants';
import {
  GET_ALL_SYNONYMS,
  ADD_SYNONYM,
  GET_SYNONYM_DETAIL,
  EDIT_SYNONYM,
  DELETE_SYNONYM,
  GET_ALL_REFERENCE,
  EDIT_REFERENCE,
  ADD_REFERENCE_TO_LIST,
  GET_REFERENCE_DETAIL,
  DELETE_REFERENCE,
  GET_ALL_DATA_APPROVAL,
  GET_DATA_APPROVAL,
  RESET_DATA_APPROVAL_DETAIL,
  GET_ALL_REPORT,
  GET_REPORT_DETAIL,
  EDIT_REPORT_STATUS,
} from 'src/modules/contributor/index';

const initialState = {
  synonymsList: [],
  documentReferenceList: [],
  dataApprovalList: [],
  referenceDetail: null,
  synonymDetail: null,
  dataApprovalDetail: null,
  reportList: [],
  reportDetail: null,
};

export const contributorReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_DATA_APPROVAL_DETAIL:
      return {
        ...state,
        dataApprovalDetail: null,
      };
    //cases for synonym
    case GET_ALL_DATA_APPROVAL:
      const dataApprovalList = action.payload.dataApprovalList;
      return {
        ...state,
        dataApprovalList,
      };

    case GET_DATA_APPROVAL:
      const dataApproval = action.payload.dataApproval;
      return {
        ...state,
        dataApprovalDetail: dataApproval,
      };

    case GET_ALL_SYNONYMS:
      const synonymsList = action.payload.synonymsList;
      return {
        ...state,
        synonymsList,
      };

    case ADD_SYNONYM:
      const synonym = action.payload.synonym;
      let newSynonymList = state.synonymsList;
      newSynonymList.push(synonym);
      return {
        ...state,
        synonymsList: newSynonymList,
      };

    case GET_SYNONYM_DETAIL:
      const newSynonymDetail = action.payload.synonym;
      return {
        ...state,
        synonymDetail: newSynonymDetail,
      };

    case EDIT_SYNONYM:
      const synonymDetail = action.payload.synonymDetail;
      let listSynonym = state.synonymsList.map((synonym) => {
        if (synonym.synonym_id === synonymDetail.synonym_id) {
          synonym = synonymDetail;
        }

        return synonym;
      });

      return {
        ...state,
        synonymDetail: synonymDetail,
        synonymsList: listSynonym,
      };

    case DELETE_SYNONYM:
      const deleteSynonymId = action.payload.synonymId;
      let deletePosition = -1;
      let newList = state.synonymsList.map((synonym, index) => {
        if (synonym.synonym_id === deleteSynonymId) {
          deletePosition = index;
        }

        return synonym;
      });
      newList.splice(deletePosition, 1);
      return {
        ...state,
        synonymsList: newList,
      };

    //cases for document reference
    case GET_ALL_REFERENCE: {
      const list = action.payload.documentReferenceList;
      return {
        ...state,
        documentReferenceList: list,
      };
    }
    case ADD_REFERENCE_TO_LIST:
      const reference = action.payload.reference;
      let newReferenceList = state.documentReferenceList;
      newReferenceList.push(reference);
      return {
        ...state,
        documentReferenceList: newReferenceList,
      };

    case EDIT_REFERENCE:
      const referenceDetail = action.payload.referenceDetail;
      let list = state.documentReferenceList.map((reference) => {
        if (
          reference.reference_document_id ===
          referenceDetail.reference_document_id
        ) {
          reference = referenceDetail;
        }

        return reference;
      });

      return {
        ...state,
        referenceDetail: referenceDetail,
        documentReferenceList: list,
      };

    case GET_REFERENCE_DETAIL:
      const detail = action.payload.reference;
      return {
        ...state,
        referenceDetail: detail,
      };

    case DELETE_REFERENCE:
      const deleteID = action.payload.id;
      let pos = -1;
      let listAfterDelete = state.documentReferenceList.map(
        (reference, index) => {
          if (reference.reference_document_id === deleteID) {
            pos = index;
          }

          return reference;
        }
      );
      listAfterDelete.splice(pos, 1);
      return {
        ...state,
        documentReferenceList: listAfterDelete,
      };

    //case for report
    case GET_ALL_REPORT:
      const reportsList = action.payload.reportList;
      return {
        ...state,
        reportList: reportsList,
      };

    case GET_REPORT_DETAIL:
      const detailReport = action.payload.report;
      return {
        ...state,
        reportDetail: detailReport,
      };

    case EDIT_REPORT_STATUS:
      const report = action.payload.report;
      let listReport = state.reportList.map((reportDetail) => {
        if (reportDetail.report_id === report.report_id) {
          reportDetail = report;
        }
        return reportDetail;
      });

      return {
        ...state,
        reportDetail: report,
        reportList: listReport,
      };

    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};
