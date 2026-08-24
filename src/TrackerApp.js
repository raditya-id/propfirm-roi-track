import React, { useState, useRef } from 'react';
import { useData } from './data';

export const TrackerApp = () => {
  const { accounts, payouts, addAccount, deleteAccount, addPayout, deletePayout } = useData();
  const [view, setView] = useState('accounts');
  const fileInputRef = useRef(null);

  const [spendingPage, setSpendingPage] = useState(1);
  const [payoutPage, setPayoutPage] = useState(1);
  const itemsPerPage = 5;

  const [firm, setFirm] = useState('');
  const [amount, setAmount] = useState('');
  const [spendingNotes, setSpendingNotes] = useState('');

  const [payoutFirm, setPayoutFirm] = useState('');
  const [payoutDate, setPayoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [gross, setGross] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');

  const handleAddSpending = (e) => {
    e.preventDefault();
    if (!amount || !firm) return;
    addAccount({ propFirmName: firm, amount: parseFloat(amount), notes: spendingNotes, date: new Date().toISOString().split('T')[0] });
    setFirm(''); setAmount(''); setSpendingNotes('');
  };

  const handleAddPayout = (e) => {
    e.preventDefault();
    if (!gross || !payoutFirm) return;
    addPayout({ propFirmName: payoutFirm, date: payoutDate, grossAmount: parseFloat(gross), notes: payoutNotes, netAmount: parseFloat(gross) });
    setPayoutFirm(''); setGross(''); setPayoutNotes('');
  };

  const exportCSV = () => {
    const data = [
      ...accounts.map(a => [a.id, 'Spending', a.propFirmName, a.amount, '-', a.notes || '']),
      ...payouts.map(p => [p.id, 'Payout', p.propFirmName, p.grossAmount, p.netAmount, p.notes || ''])
    ];
    const csv = [['ID', 'Type', 'Firm', 'Amount/Gross', 'Net', 'Notes'], ...data].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'backup.csv'; link.click();
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      ev.target.result.split('\n').slice(1).forEach(row => {
        if (!row.trim()) return;
        const [id, type, firm, amount, net, notes] = row.split(',');
        if (type === 'Spending') addAccount({ propFirmName: firm, amount: parseFloat(amount) || 0, notes: notes || '', date: new Date().toISOString().split('T')[0] });
        else if (type === 'Payout') addPayout({ propFirmName: firm, date: new Date().toISOString().split('T')[0], grossAmount: parseFloat(amount) || 0, netAmount: parseFloat(net) || parseFloat(amount) || 0, notes: notes || '' });
      });
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return { data: data.slice(start, start + itemsPerPage), totalPages: Math.ceil(data.length / itemsPerPage) };
  };

  const paginatedAccounts = paginate(accounts, spendingPage);
  const paginatedPayouts = paginate(payouts, payoutPage);

  const totalSpent = accounts.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);
  const totalPayout = payouts.reduce((sum, p) => sum + (parseFloat(p.netAmount) || 0), 0);
  const net = totalPayout - totalSpent;
  const roi = totalSpent > 0 ? (net / totalSpent) * 100 : 0;

  const PaginationControls = ({ current, total, setPage }) => 
    React.createElement('div', { style: { marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' } },
        [...Array(total)].map((_, i) => 
            React.createElement('button', { key: i, className: `btn-primary ${current === i + 1 ? '' : 'btn-dim'}`, style: { width: 'auto', padding: '0.2rem 0.6rem' }, onClick: () => setPage(i + 1) }, i + 1)
        )
    );

  return React.createElement('div', { className: 'app-layout' },
    React.createElement('aside', { className: 'sidebar' },
      React.createElement('div', { className: 'logo' }, 'Prop Tracker'),
      React.createElement('nav', { className: 'nav-links' },
        React.createElement('button', { className: `nav-btn ${view === 'accounts' ? 'active' : ''}`, onClick: () => setView('accounts') }, 'Account & Payout'),
        React.createElement('button', { className: `nav-btn ${view === 'roi' ? 'active' : ''}`, onClick: () => setView('roi') }, 'Dashboard ROI'),
        React.createElement('hr', { style: { borderColor: '#333', margin: '1rem 0' } }),
        React.createElement('button', { className: 'nav-btn', onClick: exportCSV }, 'Export Backup'),
        React.createElement('button', { className: 'nav-btn', onClick: () => fileInputRef.current.click() }, 'Import Backup')
      ),
      React.createElement('div', { className: 'footer' }, 'Made by Raditya')
    ),
    React.createElement('input', { type: 'file', ref: fileInputRef, style: { display: 'none' }, accept: '.csv', onChange: importCSV }),
    
    React.createElement('main', { className: 'content' },
      view === 'accounts' ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' } },
        React.createElement('div', null,
          React.createElement('div', { className: 'card' },
            React.createElement('h3', null, 'Catat Spending'),
            React.createElement('form', { onSubmit: handleAddSpending },
              React.createElement('input', { className: 'input-field', placeholder: 'Firm (e.g. Apex)', value: firm, onChange: e => setFirm(e.target.value), required: true }),
              React.createElement('input', { className: 'input-field', type: 'number', placeholder: 'Jumlah ($)', value: amount, onChange: e => setAmount(e.target.value), required: true }),
              React.createElement('input', { className: 'input-field', placeholder: 'Catatan', value: spendingNotes, onChange: e => setSpendingNotes(e.target.value) }),
              React.createElement('button', { className: 'btn-primary', type: 'submit' }, 'Simpan')
            )
          ),
          React.createElement('div', { className: 'card' },
            React.createElement('h3', null, 'Catat Payout'),
            React.createElement('form', { onSubmit: handleAddPayout },
              React.createElement('input', { className: 'input-field', placeholder: 'Firm', value: payoutFirm, onChange: e => setPayoutFirm(e.target.value), required: true }),
              React.createElement('input', { className: 'input-field', type: 'date', value: payoutDate, onChange: e => setPayoutDate(e.target.value), required: true }),
              React.createElement('input', { className: 'input-field', type: 'number', placeholder: 'Jumlah ($)', value: gross, onChange: e => setGross(e.target.value), required: true }),
              React.createElement('button', { className: 'btn-primary', type: 'submit' }, 'Simpan')
            )
          )
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem' } },
          React.createElement('div', { className: 'card' },
            React.createElement('h3', null, 'Daftar Spending'),
            React.createElement('table', { className: 'table' },
              React.createElement('tbody', null,
                paginatedAccounts.data.map(a => React.createElement('tr', { key: a.id },
                  React.createElement('td', null, a.propFirmName),
                  React.createElement('td', { className: 'mono loss' }, `$${a.amount}`),
                  React.createElement('td', null, React.createElement('button', { className: 'btn-danger', onClick: () => deleteAccount(a.id) }, 'X'))
                ))
              )
            ),
            React.createElement(PaginationControls, { current: spendingPage, total: paginatedAccounts.totalPages, setPage: setSpendingPage })
          ),
          React.createElement('div', { className: 'card' },
            React.createElement('h3', null, 'Daftar Payout'),
            React.createElement('table', { className: 'table' },
              React.createElement('tbody', null,
                paginatedPayouts.data.map(p => React.createElement('tr', { key: p.id },
                  React.createElement('td', null, p.propFirmName),
                  React.createElement('td', { className: 'mono profit' }, `$${p.netAmount}`),
                  React.createElement('td', null, React.createElement('button', { className: 'btn-danger', onClick: () => deletePayout(p.id) }, 'X'))
                ))
              )
            ),
            React.createElement(PaginationControls, { current: payoutPage, total: paginatedPayouts.totalPages, setPage: setPayoutPage })
          )
        )
      ) : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' } },
          React.createElement('div', { className: 'card' }, React.createElement('h4', { style: { color: 'var(--text-muted)' } }, 'ROI %'), React.createElement('div', { className: 'mono', style: { fontSize: '1.75rem', color: 'var(--accent)' } }, roi.toFixed(1) + '%')),
          React.createElement('div', { className: 'card' }, React.createElement('h4', { style: { color: 'var(--text-muted)' } }, 'Net P&L'), React.createElement('div', { className: 'mono', style: { fontSize: '1.75rem', color: net >= 0 ? '#3fb950' : '#f85149' } }, '$' + net.toFixed(2))),
          React.createElement('div', { className: 'card' }, React.createElement('h4', { style: { color: 'var(--text-muted)' } }, 'Total Spent'), React.createElement('div', { className: 'mono loss', style: { fontSize: '1.75rem' } }, '$' + totalSpent.toFixed(2))),
          React.createElement('div', { className: 'card' }, React.createElement('h4', { style: { color: 'var(--text-muted)' } }, 'Total Payout'), React.createElement('div', { className: 'mono profit', style: { fontSize: '1.75rem' } }, '$' + totalPayout.toFixed(2)))
        ),
        React.createElement('div', { className: 'card' },
          React.createElement('h3', null, 'Breakdown Per Prop Firm'),
          React.createElement('table', { className: 'table' },
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 'Prop Firm'),
                React.createElement('th', null, 'Total Spent'),
                React.createElement('th', null, 'Total Payout'),
                React.createElement('th', null, 'Net P&L')
              )
            ),
            React.createElement('tbody', null,
              [...new Set([...accounts.map(a => a.propFirmName), ...payouts.map(p => p.propFirmName)])].map(firm => {
                if (!firm) return null;
                const firmSpent = accounts.filter(a => a.propFirmName === firm).reduce((s, a) => s + (parseFloat(a.amount) || 0), 0);
                const firmPayout = payouts.filter(p => p.propFirmName === firm).reduce((s, p) => s + (parseFloat(p.netAmount) || 0), 0);
                const firmNet = firmPayout - firmSpent;
                return React.createElement('tr', { key: firm },
                  React.createElement('td', null, firm),
                  React.createElement('td', { className: 'mono loss' }, `$${firmSpent.toFixed(2)}`),
                  React.createElement('td', { className: 'mono profit' }, `$${firmPayout.toFixed(2)}`),
                  React.createElement('td', { className: 'mono', style: { color: firmNet >= 0 ? '#3fb950' : '#f85149' } }, `$${firmNet.toFixed(2)}`)
                );
              })
            )
          )
        )
      )
    )
  );
};