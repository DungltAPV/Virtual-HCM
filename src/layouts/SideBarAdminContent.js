import React from "react";
import { ListGroup } from "reactstrap";
import SideBarItem from "src/layouts/SideBarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faServer,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";

const SideBarAdminContent = () => {
  return (
    <ListGroup flush>
        <SideBarItem
          name="Accounts"
          icon={<FontAwesomeIcon icon={faUserCircle} />}
          link="accounts"
        />
        <SideBarItem
          name="Manage Training Process"
          icon={<FontAwesomeIcon icon={faServer} />}
          link="manage-training-process"
        />
        <SideBarItem
          name="Configure System"
          icon={<FontAwesomeIcon icon={faCogs} />}
          link="configure-system"
        />
      </ListGroup>
  );
};

export default SideBarAdminContent;
