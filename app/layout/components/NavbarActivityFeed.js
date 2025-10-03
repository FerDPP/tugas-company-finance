import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
  UncontrolledDropdown,
  DropdownToggle,
  IconWithBadge,
  Badge,
  ExtendedDropdown,
  ListGroup,
  ListGroupItem,
  Media,
} from "./../../components";

// Komponen untuk ambil jumlah notifikasi
function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3001/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((n) => n.is_read === 0).length;
        setCount(unread);
      })
      .catch((err) => console.error("Error ambil notifikasi:", err));
  }, []);

  return <span className="h6">🔔 {count > 0 ? count : 0}</span>;
}

/* Ikon status notifikasi */
const activityFeedIcons = [
  <span className="fa-stack fa-lg fa-fw d-flex mr-3" key="success">
    <i className="fa fa-circle fa-fw fa-stack-2x text-success"></i>
    <i className="fa fa-check fa-stack-1x fa-fw text-white"></i>
  </span>,
  <span className="fa-stack fa-lg fa-fw d-flex mr-3" key="danger">
    <i className="fa fa-circle fa-fw fa-stack-2x text-danger"></i>
    <i className="fa fa-close fa-stack-1x fa-fw text-white"></i>
  </span>,
  <span className="fa-stack fa-lg fa-fw d-flex mr-3" key="warning">
    <i className="fa fa-circle fa-fw fa-stack-2x text-warning"></i>
    <i className="fa fa-exclamation fa-stack-1x fa-fw text-white"></i>
  </span>,
  <span className="fa-stack fa-lg fa-fw d-flex mr-3" key="info">
    <i className="fa fa-circle fa-fw fa-stack-2x text-primary"></i>
    <i className="fa fa-info fa-stack-1x fa-fw text-white"></i>
  </span>,
];

// Navbar Activity Feed
const NavbarActivityFeed = (props) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error ambil notifikasi:", err));
  }, []);

  return (
    <UncontrolledDropdown nav inNavbar {...props}>
      <DropdownToggle nav>
        <IconWithBadge
          badge={
            <Badge pill color="primary">
              {notifications.filter((n) => n.is_read === 0).length}
            </Badge>
          }
        >
          <i className="fa fa-bell-o fa-fw" />
        </IconWithBadge>
      </DropdownToggle>

      <ExtendedDropdown right>
        <ExtendedDropdown.Section className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Activity Feed</h6>
          <Badge pill>{notifications.length}</Badge>
        </ExtendedDropdown.Section>

        <ExtendedDropdown.Section list>
          <ListGroup>
            {notifications.map((n, index) => (
              <ListGroupItem key={n.id} action>
                <Media>
                  <Media left>{activityFeedIcons[index % 4]}</Media>
                  <Media body>
                    <span className="h6">{n.title || "Notification"}</span>
                    <p className="mt-2 mb-1">{n.message || "-"}</p>
                    <div className="small mt-2">{n.created_at}</div>
                  </Media>
                </Media>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ExtendedDropdown.Section>

        <ExtendedDropdown.Section
          className="text-center"
          tag={Link}
          to="/apps/widgets"
        >
          See All Notifications
          <i className="fa fa-angle-right fa-fw ml-2" />
        </ExtendedDropdown.Section>
      </ExtendedDropdown>
    </UncontrolledDropdown>
  );
};

NavbarActivityFeed.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export { NavbarActivityFeed, NotificationBadge };
