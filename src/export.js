  // CSV Export Helper
  const exportCSV = () => {
    const header = ['ID', 'Type', 'Firm/Date', 'Amount/Gross', 'Net/Type', 'Notes'];
    const data = [
      ...accounts.map(a => [a.id, 'Spending', a.propFirmName, a.amount, a.type, a.strategyNotes || '-']),
      ...payouts.map(p => [p.id, 'Payout', p.date, p.grossAmount, p.netAmount, '-'])
    ];
    const csv = [header, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `propfirm_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
