import { GET_ALL_SYNONYMS } from "src/modules/contributor/index";
import { GET_ALL_REFERENCE } from "./contributor.constants";

const initialState = {
  synonymsList: [],
  documentReferenceList: [],
};

export const contributorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SYNONYMS:
      const synonymsList = action.payload.synonymsList;
      return {
        ...state,
        synonymsList,
      };
    case GET_ALL_REFERENCE: {
      const documentReferenceList = action.payload.documentReferenceList;
      return {
        ...state,
        documentReferenceList,
      };
    }
    default:
      return state;
  }
};