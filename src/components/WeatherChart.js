import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function WeatherChart({ forecast }) {
  const dates = forecast.map((f) => new Date(f.dt_txt).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }));
  const temperatures = forecast.map((f) => f.main.temp);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatures,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '5-Day Temperature Forecast',
      },
    },
    scales: {
      y: {
        beginAtZero: false, 
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };


  return (
    <div className="card">
      <h3>5-Day Forecast</h3>
      <ul>
        {forecast.map((f, idx) => (
          <li key={idx}>
            {f.dt_txt.split(' ')[0]}: {f.main.temp}°C, {f.weather[0].description}
          </li>
        ))}
      </ul>

      <div style={{ maxWidth: '400px', margin: '20px auto' }}> 
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default WeatherChart;