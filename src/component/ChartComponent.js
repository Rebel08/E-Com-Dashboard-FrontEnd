// src/components/ChartComponent.js
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const ChartComponent = ({ type, data, options }) => {
    switch (type) {
        case 'bar':
            return <Bar data={data} options={options} />;
        case 'line':
            return <Line data={data} options={options} />;
        case 'pie':
            return <Pie data={data} options={options} />;
        default:
            return null;
    }
};

export default ChartComponent;
