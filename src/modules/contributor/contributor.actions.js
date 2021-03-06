import {
  ADD_SYNONYM,
  GET_ALL_SYNONYMS,
  EDIT_SYNONYM,
  GET_SYNONYM_DETAIL,
  DELETE_SYNONYM,
  GET_ALL_REFERENCE,
  EDIT_REFERENCE,
  ADD_REFERENCE_TO_LIST,
  GET_REFERENCE_DETAIL,
  DELETE_REFERENCE,
  GET_ALL_DATA_APPROVAL,
  GET_DATA_APPROVAL,
  RESET_DATA_APPROVAL_DETAIL,
  GET_KNOWLEDGE_DATA_SETTINGS,
  GET_ALL_PENDING_REPORT,
  REJECT_REPORT,
  APPROVE_REPORT,
  GET_ALL_ACCEPTED_REPORT,
  GET_ALL_REJECTED_REPORT,
  RESET_APPROVAL_DETAIL_REPORT,
  CHANGE_STATUS_OF_KNOWLEDGE_DATA,
} from 'src/modules/contributor/index';

export const fetchKnowledgeDataSetting = (knowledgeDataSettings) => ({
  type: GET_KNOWLEDGE_DATA_SETTINGS,
  payload: {
    knowledgeDataSettings,
  },
});

//Synonym
export const fetchAllDataApproval = (dataApprovalList) => ({
  type: GET_ALL_DATA_APPROVAL,
  payload: {
    dataApprovalList,
  },
});

export const pullDataApproval = (dataApproval) => ({
  type: GET_DATA_APPROVAL,
  payload: {
    dataApproval,
  },
});

export const resetDataApprovalDetail = () => ({
  type: RESET_DATA_APPROVAL_DETAIL,
  payload: {},
});

//Synonym
export const addSynonymToList = (synonym) => ({
  type: ADD_SYNONYM,
  payload: {
    synonym,
  },
});

export const fetchAllSynonyms = (synonymsList) => ({
  type: GET_ALL_SYNONYMS,
  payload: {
    synonymsList,
  },
});

export const pullSynonymDetail = (synonym) => ({
  type: GET_SYNONYM_DETAIL,
  payload: {
    synonym,
  },
});

export const editSynonymDetail = (synonymDetail) => ({
  type: EDIT_SYNONYM,
  payload: {
    synonymDetail,
  },
});

export const deleteSynonym = (synonymId) => ({
  type: DELETE_SYNONYM,
  payload: {
    synonymId,
  },
});

//Document Reference
export const fetchAllDocumentReference = (documentReferenceList) => ({
  type: GET_ALL_REFERENCE,
  payload: {
    documentReferenceList,
  },
});

export const pullReferenceDetail = (reference) => ({
  type: GET_REFERENCE_DETAIL,
  payload: {
    reference,
  },
});

export const editReferenceDetail = (referenceDetail) => ({
  type: EDIT_REFERENCE,
  payload: {
    referenceDetail,
  },
});

export const addReferenceToList = (reference) => ({
  type: ADD_REFERENCE_TO_LIST,
  payload: {
    reference,
  },
});

export const deleteReference = (id) => ({
  type: DELETE_REFERENCE,
  payload: {
    id,
  },
});

//Report
export const fetchAllPendingReport = (reportList) => ({
  type: GET_ALL_PENDING_REPORT,
  payload: {
    reportList,
  },
});

export const pullAllAcceptedReport = (acceptedReportList) => ({
  type: GET_ALL_ACCEPTED_REPORT,
  payload: {
    acceptedReportList,
  },
});

export const pullAllRejectedReport = (rejectedReportList) => ({
  type: GET_ALL_REJECTED_REPORT,
  payload: {
    rejectedReportList,
  },
});

export const rejectReport = (report_id) => ({
  type: REJECT_REPORT,
  payload: {
    report_id,
  },
});

export const approveReport = (approvalReportDetail) => ({
  type: APPROVE_REPORT,
  payload: {
    approvalReportDetail,
  },
});

export const resetApprovalReportDetail = () => ({
  type: RESET_APPROVAL_DETAIL_REPORT,
  payload: {},
});

export const changeStatusOfKnowledgeData = (data) => ({
  type: CHANGE_STATUS_OF_KNOWLEDGE_DATA,
  payload: {
    data,
  },
});
