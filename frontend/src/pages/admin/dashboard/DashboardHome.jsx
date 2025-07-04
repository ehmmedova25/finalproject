
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import styles from './DashboardHome.module.css';
import { FaMoneyBillWave, FaBoxOpen, FaUsers, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalIncome: 0,
    monthlyIncome: [],
    weeklyOrders: [],
    weeklyCustomers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayStats, setDisplayStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalIncome: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/stats');
        setStats(res.data);
        setError(null);
        animateNumbers(res.data);
      } catch (err) {
        console.error("Statistika yüklənmədi:", err);
        setError("Statistika yüklənmədi");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const animateNumbers = (targetStats) => {
    const duration = 2000; 
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setDisplayStats({
        totalOrders: Math.floor(targetStats.totalOrders * progress),
        totalCustomers: Math.floor(targetStats.totalCustomers * progress),
        totalIncome: targetStats.totalIncome * progress,
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayStats(targetStats);
      }
    }, stepDuration);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('az-AZ').format(num);
  };

  const getMonthName = (month) => new Date(2025, month - 1).toLocaleString('az-AZ', { month: 'short' });

  const pieData = {
    labels: ['Total Orders', 'Customer Growth', 'Total Revenue'],
    datasets: [
      {
        label: 'Analytics',
        data: [stats.totalOrders, stats.totalCustomers, stats.totalIncome],
        backgroundColor: ['#FF6B6B', '#70D6FF', '#1C7ED6'],
        borderWidth: 1,
      },
    ],
  };

  const weeklyOrderChart = {
    labels: stats.weeklyOrders.map((item) => item.day),
    datasets: [
      {
        label: 'Orders',
        data: stats.weeklyOrders.map((item) => item.count),
        fill: false,
        borderColor: '#5C7CFA',
        backgroundColor: '#D0EBFF',
        tension: 0.4,
      },
    ],
  };

  const weeklyCustomerChart = {
    labels: stats.weeklyCustomers.map((item) => item.day),
    datasets: [
      {
        label: 'Customers',
        data: stats.weeklyCustomers.map((item) => item.count),
        backgroundColor: '#FCC419',
      },
    ],
  };

  const revenueChart = {
    labels: stats.monthlyIncome.map((m) => getMonthName(m._id.month)),
    datasets: [
      {
        label: '2025 Gəlir',
        data: stats.monthlyIncome.map((m) => m.total),
        fill: true,
        borderColor: '#228BE6',
        backgroundColor: 'rgba(34, 139, 230, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('az-AZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Statistika yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Yenidən cəhd et
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h2>Xoş gəlmisiniz, Admin!</h2>
          <p>Bugünkü performansınızı izləyin</p>
          <div className={styles.dateTime}>
            <span>{getCurrentTime()}</span>
          </div>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.quickStat}>
            <FaArrowUp className={styles.trendIcon} />
            <span>Bu ay 15% artım</span>
          </div>
        </div>
      </div>

      <div className={styles.cardGrid}>
        <div className={`${styles.card} ${styles.ordersCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>
              <FaBoxOpen />
            </div>
            <div className={styles.cardTrend}>
              <FaArrowUp className={styles.trendUp} />
              <span>12%</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.label}>Ümumi Sifarişlər</p>
            <h3 className={styles.value}>{formatNumber(displayStats.totalOrders)}</h3>
            <p className={styles.subtitle}>Bu ay: +{Math.floor(displayStats.totalOrders * 0.12)}</p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.customersCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>
              <FaUsers />
            </div>
            <div className={styles.cardTrend}>
              <FaArrowUp className={styles.trendUp} />
              <span>8%</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.label}>Ümumi Müştərilər</p>
            <h3 className={styles.value}>{formatNumber(displayStats.totalCustomers)}</h3>
            <p className={styles.subtitle}>Aktiv: {Math.floor(displayStats.totalCustomers * 0.7)}</p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.revenueCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>
              <FaMoneyBillWave />
            </div>
            <div className={styles.cardTrend}>
              <FaArrowUp className={styles.trendUp} />
              <span>25%</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.label}>Ümumi Gəlir</p>
            <h3 className={styles.value}>{formatCurrency(displayStats.totalIncome)}</h3>
            <p className={styles.subtitle}>Bu ay: {formatCurrency(displayStats.totalIncome * 0.25)}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h4>Pie Chart</h4>
          <Doughnut data={pieData} />
        </div>
        <div className={styles.chartCard}>
          <h4>Həftəlik Sifarişlər</h4>
          <Line data={weeklyOrderChart} />
        </div>
        <div className={styles.chartCard}>
          <h4>Həftəlik Müştərilər</h4>
          <Bar data={weeklyCustomerChart} />
        </div>
        <div className={styles.chartCard}>
          <h4>Aylıq Gəlir (2025)</h4>
          <Line data={revenueChart} />
        </div>
      </div>

      <div className={styles.additionalInfo}>
        <div className={styles.infoCard}>
          <h4>Bugünkü Məlumatlar</h4>
          <div className={styles.todayStats}>
            <div className={styles.todayStat}>
              <span>Bugünkü sifarişlər:</span>
              <strong>{Math.floor(displayStats.totalOrders * 0.1)}</strong>
            </div>
            <div className={styles.todayStat}>
              <span>Yeni müştərilər:</span>
              <strong>{Math.floor(displayStats.totalCustomers * 0.05)}</strong>
            </div>
            <div className={styles.todayStat}>
              <span>Bugünkü gəlir:</span>
              <strong>{formatCurrency(displayStats.totalIncome * 0.1)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
