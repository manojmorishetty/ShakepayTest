import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import moment from "moment";
import * as RatesAPI from "API/api.js";

const NetWorthBarChart = () => {
  const [transactionsHistory, setTransactionsHistory] = useState(
    RatesAPI.getTransactionsHistory()
  );
  const [BTCCadRate, setBTCCatRate] = useState("");
  const [ETHCadRate, setETHCatRate] = useState("");

  //   useEffect(() => {
  //     (async function getData2() {
  //       await getData();
  //     })();
  //   }, []);

  const calculateNetWorth = (transaction, prevNewtWorth) => {
    switch (transaction.direction) {
      case "credit":
        if (transaction.currency === "CAD") {
          return prevNewtWorth + transaction.amount;
        } else if (transaction.currency === "BTC") {
          return prevNewtWorth + transaction.amount * 13027.19;
        } else if (transaction.currency === "ETH") {
          return prevNewtWorth + transaction.amount * 292.31;
        } else {
          return 0;
        }
      case "debit":
        if (transaction.currency === "CAD") {
          return prevNewtWorth - transaction.amount;
        } else if (transaction.currency === "BTC") {
          return prevNewtWorth - transaction.amount * 13027.19;
        } else if (transaction.currency === "ETH") {
          return prevNewtWorth - transaction.amount * 292.31;
        } else {
          return 0;
        }
      default:
        return 0;
    }
  };

  const getData = async () => {
    const APIresult = await RatesAPI.getRates();
    debugger;
    if (APIresult) {
      setBTCCatRate(APIresult.BTC_CAD);
      setETHCatRate(APIresult.ETH_CAD);
    }
  };

  const formTransChartData = (transactionsHistory) => {
    let parseddata = [];
    let prevNewtWorth = 0;
    if (transactionsHistory) {
      transactionsHistory.forEach((transaction) => {
        let transObj = {};
        transObj["created"] = transaction["createdAt"];
        prevNewtWorth = transObj["netWorth"] = calculateNetWorth(
          transaction,
          prevNewtWorth
        );
        parseddata.push(transObj);
      });
    }
    return parseddata;
  };

  let chartObj = formTransChartData(transactionsHistory);

  let fixedPro = {
    fill: false,
    backgroundColor: "#ff4d00",
    borderDash: [],
    borderWidth: 1.5,
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 2,
    pointHoverRadius: 3,
    pointHoverBorderWidth: 2,
    pointRadius: 2,
    pointHitRadius: 10,
  };
  let datasetObject = [
    {
      label: "",
      data: chartObj.map((d) => d.netWorth),
      borderColor: "#ff1100",
      ...fixedPro,
    },
  ];
  let date = chartObj.map((d) =>
    moment(d.created, "YYYY-MM-DD HH:mm").format("MMM DD HH:mm")
  );
  const chartData = {
    labels: date,
    datasets: datasetObject,
  };
  const options = {
    legend: {
      display: false,
      position: "bottom",
    },
    scales: {
      legend: {
        display: false,
        position: "bottom",
      },
      yAxes: [
        {
          gridLines: {
            display: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Net worth",
          },
          ticks: {
            suggestedMax:
              (Math.max(...chartObj.map((d) => d.netWorth)) / 100) * 110,
            suggestedMin:
              (Math.min(...chartObj.map((d) => d.netWorth)) / 100) * 80,
            maxTicksLimit: 10,
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          debugger;
          let label = "Net worth: ";
          label += Math.round(tooltipItem.yLabel * 100) / 100;
          label += " $";
          return label;
        },
      },
    },
  };
  return chartObj ? (
    <Bar data={chartData} options={options} height="50vh" />
  ) : (
    ""
  );
};

export default NetWorthBarChart;
