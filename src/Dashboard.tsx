import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css'; // Adicione uma folha de estilo para melhorar a aparência

Chart.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <p>Carregando dados do dashboard...</p>;
  }

  // Dados para o gráfico de pizza por estado
  const fazendasPorEstadoData = {
    labels: dashboardData.fazendasPorEstado.map(item => item.estado),
    datasets: [
      {
        label: 'Fazendas por Estado',
        data: dashboardData.fazendasPorEstado.map(item => item.total),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FFA07A', '#8A2BE2', '#DA70D6'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FFA07A', '#8A2BE2', '#DA70D6'
        ],
        borderWidth: 1
      }
    ]
  };

  // Dados para o gráfico de pizza por cultura
  const culturasData = {
    labels: dashboardData.culturas.map(item => item.cultura),
    datasets: [
      {
        label: 'Fazendas por Cultura',
        data: dashboardData.culturas.map(item => item.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1
      }
    ]
  };

  // Dados para o gráfico de pizza por uso de solo
  const usoSoloData = {
    labels: ['Área Agricultável', 'Área de Vegetação'],
    datasets: [
      {
        label: 'Uso de Solo',
        data: [dashboardData.usoSolo.total_agricultavel, dashboardData.usoSolo.total_vegetacao],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        borderWidth: 1
      }
    ]
  };

  // Opções para o Chart.js com maintainAspectRatio false e porcentagens no gráfico
  const options = {
    maintainAspectRatio: false,
    aspectRatio: 1, // Força o gráfico a ter proporção 1:1 (perfeito para gráficos de pizza)
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((prev, current) => prev + current, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      
      {/* Informações principais sobre as fazendas */}
      <div className="dashboard-info">
        <div className="info-box">
          <h3>Total de Fazendas</h3>
          <p>{dashboardData.totalFazendas}</p>
        </div>
        <div className="info-box">
          <h3>Total de Área (hectares)</h3>
          <p>{dashboardData.totalArea}</p>
        </div>
      </div>

      {/* Gráficos lado a lado */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Fazendas por Estado</h3>
          <div className="chart">
            <Pie data={fazendasPorEstadoData} options={options} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Fazendas por Cultura</h3>
          <div className="chart">
            <Pie data={culturasData} options={options} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Uso de Solo</h3>
          <div className="chart">
            <Pie data={usoSoloData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
