  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').slice(1);
      rows.forEach(row => {
        const [id, type, firmDate, amountGross, net, notes] = row.split(',');
        if (type === 'Spending') {
          addAccount({ propFirmName: firmDate, amount: parseFloat(amountGross), type: 'eval', date: new Date().toISOString().split('T')[0], strategyNotes: notes });
        } else if (type === 'Payout') {
          addPayout({ date: firmDate, grossAmount: parseFloat(amountGross), netAmount: parseFloat(net) });
        }
      });
    };
    reader.readAsText(file);
  };
