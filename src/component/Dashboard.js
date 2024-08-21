// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChartComponent from "./ChartComponent";
import MapComponent from "./MapComponent";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [repeatCustomers, setRepeatCustomers] = useState([]);
  const [geographicData, setGeographicData] = useState([]);
  const [customerLifetimeValue, setCustomerLifetimeValue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesResponse = await axios.get(
          "https://e-com-dashboard-backend.onrender.com/api/orders/total-sales/monthly"
        );
        const customersResponse = await axios.get(
          "https://e-com-dashboard-backend.onrender.com/api/customers/new-customers/monthly"
        );
        const repeatResponse = await axios.get(
          "https://e-com-dashboard-backend.onrender.com/api/orders/repeat-customers/monthly"
        );
        const geographicResponse = await axios.get('https://e-com-dashboard-backend.onrender.com/api/customers/geographical-distribution');
        const clvResponse = await axios.get(
          "https://e-com-dashboard-backend.onrender.com/api/customers/ltv/cohorts"
        );

        // console.log(salesResponse.data);
        setSalesData(salesResponse.data);
        setNewCustomers(customersResponse.data);
        setRepeatCustomers(repeatResponse.data);
        setGeographicData(geographicResponse.data);
        setCustomerLifetimeValue(clvResponse.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">E-Commerce Dashboard</h1>

      <div className="row">
        <div className="col-md-6">
          <h3>Total Sales Over Time</h3>
          <ChartComponent
            type="line"
            data={{
              labels: salesData.map((item) => item._id),
              datasets: [
                {
                  label: "Total Sales",
                  data: salesData.map((item) => item.totalSales),
                  backgroundColor: "rgba(75,192,192,0.4)",
                },
              ],
            }}
          />
        </div>

        <div className="col-md-6">
          <h3>New Customers Added Over Time</h3>
          <ChartComponent
            type="bar"
            data={{
              labels: newCustomers.map((item) => item._id),
              datasets: [
                {
                  label: "New Customers",
                  data: newCustomers.map((item) => item.count),
                  backgroundColor: "rgba(255,99,132,0.6)",
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <h3>Number Purchase Repeat over Customers</h3>
          <ChartComponent
            type="bar"
            data={{
              labels: repeatCustomers.map(
                (item) => item.customerDetails.firstName
              ),
              datasets: [
                {
                  label: "Purchase Count",
                  data: repeatCustomers.map((item) => item.repeatOrders),
                  backgroundColor: "rgba(54,162,235,0.6)",
                },
              ],
            }}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 ">
          <h3>Customer Lifetime Value by Cohorts</h3>
          <ChartComponent
            type="pie"
            data={{
              labels: customerLifetimeValue.map((item) => item.cohort),
              datasets: [
                {
                  label: "Customer Lifetime Value",
                  data: customerLifetimeValue.map((item) => item.customerCount),
                  backgroundColor: [
                    "rgba(255,206,86,0.6)",
                    "rgba(75,192,192,0.6)",
                    "rgba(223,102,255,0.6)",
                    "rgba(255,216,146,0.6)",
                    "rgba(75,292,162,0.6)",
                    "rgba(153,122,205,0.6)",
                    "rgba(185,206,186,0.6)",
                    "rgba(175,182,102,0.6)",
                    "rgba(253,122,135,0.6)",
                    "rgba(215,216,186,0.6)",
                    "rgba(175,202,192,0.6)",
                    "rgba(223,232,165,0.6)",
                    "rgba(115,106,186,0.6)",
                    "rgba(175,192,182,0.6)",
                    "rgba(133,202,205,0.6)",
                  ],
                },
              ],
            }}
          />
        </div>
        <div className="col-md-6">
          <h3>Geographical Distribution of Customers</h3>
          <MapComponent cities={geographicData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
