import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardChart = ({ data }) => {
  return React.createElement('div', { style: { height: '300px', width: '100%' } },
    React.createElement(ResponsiveContainer, { width: '100%', height: '100%' },
      React.createElement(LineChart, { data: data },
        React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#30363d' }),
        React.createElement(XAxis, { dataKey: 'date', stroke: '#8b949e' }),
        React.createElement(YAxis, { stroke: '#8b949e', tickFormatter: (v) => '$' + v.toLocaleString() }),
        React.createElement(Tooltip, { contentStyle: { backgroundColor: '#161b22', border: '1px solid #30363d', color: '#e6edf3' }, formatter: (v) => ['$' + Number(v).toFixed(2), 'Cumulative'] }),
        React.createElement(Line, { type: 'monotone', dataKey: 'cumulative', stroke: '#a371f7', strokeWidth: 3, dot: true })
      )
    )
  );
};
