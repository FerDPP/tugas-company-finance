import React from "react";

import { SidebarMenu } from "./../../components";

export const SidebarMiddleNav = () => (
  <SidebarMenu>
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-home"></i>}
      title="Dashboards"
    >
      {/* <SidebarMenu.Item title="Analytics" to="/dashboards/analytics" exact />
      <SidebarMenu.Item title="Projects" to="/dashboards/projects" exact />
      <SidebarMenu.Item title="System" to="/dashboards/system" exact /> */}
      <SidebarMenu.Item title="Data Customer" to="/dashboards/monitor" exact />
      <SidebarMenu.Item title="Financial" to="/dashboards/financial" exact />
      {/* <SidebarMenu.Item title="Stock" to="/dashboards/stock" exact />
      <SidebarMenu.Item title="Reports" to="/dashboards/reports" exact /> */}
    </SidebarMenu.Item>
  </SidebarMenu>
);
