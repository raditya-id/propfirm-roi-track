import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useData } from './data';

export const Dashboard = () => {
  const { accounts, payouts } = useData();

  const totalSpent = accounts.reduce((sum, a) => sum + a.accountCost + (a.activationFee || 0), 0);
  const totalPayout = payouts.reduce((sum, p) => sum + p.netAmount, 0);
  const net = totalPayout - totalSpent;
  const roi = totalSpent > 0 ? (net / totalSpent) * 100 : 0;

  // Chart data: Cumulative P&L
  const chartData = payouts.map((p, i) => ({
      date: p.payoutDate,
      cumulative: payouts.slice(0, i + 1).reduce((sum, p) => sum + p.netAmount, 0) - totalSpent
  }));

  // Bar Chart: Payout per Firm
  const firmData = accounts.map(a => ({
      firm: a.propFirmName,
      payout: payouts.filter(p => p.accountId === a.id).reduce((sum, p) => sum + p.netAmount, 0)
  }));

  return React.createElement('div', { className: 'dashboard-sections' },
    // KPI Section
    React.createElement('section', { className: 'card' },
      React.createElement('h2', null, 'Total ROI Summary'),
      React.createElement('div', { className: 'grid-4' },
        React.createElement('div', { className: 'kpi-card' }, React.createElement('div', { className: 'kpi-label' }, 'Total Belanja'), React.createElement('div', { className: 'kpi-value mono loss' }, `$${totalSpent.toFixed(2)}`)),
        React.createElement('div', { className: 'kpi-card' }, React.createElement('div', { className: 'kpi-label' }, 'Total Payout'), React.createElement('div', { className: 'kpi-value mono profit' }, `$${totalPayout.toFixed(2)}`)),
        React.createElement('div', { className: 'kpi-card' }, React.createElement('div', { className: 'kpi-label' }, 'Net P&L'), React.createElement('div', { className: 'kpi-value mono ' + (net >= 0 ? 'profit' : 'loss') }, `$${net.toFixed(2)}`)),
        React.createElement('div', { className: 'kpi-card' }, React.createElement('div', { className: 'kpi-label' }, 'ROI'), React.createElement('div', { className: 'kpi-value mono accent' }, `${roi.toFixed(1)}%`))
      )
    ),

    // Chart Section
    React.createElement('section', { className: 'card', style: { marginTop: '1.5rem' } },
      React.createElement('h2', null, 'Perkembangan Payout'),
      React.createElement('div', { style: { height: '300px' } },
        React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
          React.createElement(LineChart, { data: chartData },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#30363d' }),
            React.createElement(XAxis, { dataKey: 'date', stroke: '#8b949e' }),
            React.createElement(YAxis, { stroke: '#8b949e' }),
            React.createElement(Tooltip, { contentStyle: { backgroundColor: '#161b22', border: '1px solid #30363d' } }),
            React.createElement(Line, { type: 'monotone', dataKey: 'cumulative', stroke: '#a371f7', strokeWidth: 3 })
          )
        )
      )
    )
  );
};