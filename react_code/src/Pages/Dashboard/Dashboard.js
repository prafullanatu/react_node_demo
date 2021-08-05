import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import config from "../../config";
import Menu from "../../core/Menu";

const Dashboard = () => {
  const [setDashboard] = useState(null);
  const history = useHistory();


  useEffect(() => {
    fetch(`${config.baseUrl}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(({ error, data }) =>
        error ? history.push("/login") : setDashboard(data)
      );
  }, [history]);

  return (
    <>
     <Menu />
      <div className="px-3">
        
        
      </div>
    </>
  );
};

export default Dashboard;
