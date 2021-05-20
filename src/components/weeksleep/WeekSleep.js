import React from "react";
import { Bar } from "react-chartjs-2";

const WeekSleep = (props) => {
  const data = {
    labels: props.days,
    datasets: [
      {
        label: "hrs of Sleep",
        data: props.sleep,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return <Bar data={data} options={options} />;
};

export default WeekSleep;
