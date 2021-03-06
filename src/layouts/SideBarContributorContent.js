import React, { Fragment } from 'react';
import SideBarItem from 'src/layouts/SideBarItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt,
  faNewspaper,
  faClipboardList,
  faTachometerAlt,
  faBookOpen,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';

import {
  CONTRIBUTOR_PAGE,
  CONTRIBUTOR_PAGE_LIST_KNOWLEDGE_DATA,
  REFERENCE_LIST_PAGE,
  SYNONYM_LIST_PAGE,
  CHAT_HISTORY_LIST_PAGE,
  REPORT_LIST_PAGE,
} from 'src/constants';

const SideBarContributorContent = () => {
  const location = window.location.pathname;
  return (
    <Fragment>
      <SideBarItem
        name="Dashboard"
        icon={<FontAwesomeIcon icon={faTachometerAlt} />}
        link={CONTRIBUTOR_PAGE}
        active={location === CONTRIBUTOR_PAGE}
      />
      <SideBarItem
        name="Knowledge Data"
        icon={<FontAwesomeIcon icon={faClipboardList} />}
        link={CONTRIBUTOR_PAGE_LIST_KNOWLEDGE_DATA}
        active={location.includes(CONTRIBUTOR_PAGE_LIST_KNOWLEDGE_DATA)}
      />
      <SideBarItem
        name="Chat History"
        icon={<FontAwesomeIcon icon={faHistory} />}
        link={CHAT_HISTORY_LIST_PAGE}
        active={location.includes(CHAT_HISTORY_LIST_PAGE)}
      />
      <SideBarItem
        name="Document Reference"
        icon={<FontAwesomeIcon icon={faBookOpen} />}
        link={REFERENCE_LIST_PAGE}
        active={location.includes(REFERENCE_LIST_PAGE)}
      />
      <SideBarItem
        name="Synonym"
        icon={<FontAwesomeIcon icon={faFileAlt} />}
        link={SYNONYM_LIST_PAGE}
        active={location.includes(SYNONYM_LIST_PAGE)}
      />
      <SideBarItem
        name="Report"
        icon={<FontAwesomeIcon icon={faNewspaper} />}
        link={REPORT_LIST_PAGE}
        active={location.includes(REPORT_LIST_PAGE)}
      />
    </Fragment>
  );
};

export default SideBarContributorContent;
