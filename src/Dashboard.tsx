import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

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
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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
      }
    ]
  };

  // Opções para o Chart.js com maintainAspectRatio false
  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
      {/* Total de fazendas e área total */}
      <div className="dashboard-info">
        <h3>Total de Fazendas: {dashboardData.totalFazendas}</h3>
        <h3>Total de Área (hectares): {dashboardData.totalArea}</h3>
      </div>

      {/* Gráficos lado a lado */}
      <div className="charts-row">
        {/* Gráfico de pizza por estado */}
        <div className="chart-container">
          <h3>Fazendas por Estado</h3>
          <Pie data={fazendasPorEstadoData} options={options} />
        </div>

        {/* Gráfico de pizza por cultura */}
        <div className="chart-container">
          <h3>Fazendas por Cultura</h3>
          <Pie data={culturasData} options={options} />
        </div>

        {/* Gráfico de pizza por uso de solo */}
        <div className="chart-container">
          <h3>Uso de Solo</h3>
          <Pie data={usoSoloData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
