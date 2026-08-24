import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('prop_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [payouts, setPayouts] = useState(() => {
    try {
      const saved = localStorage.getItem('prop_payouts');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('prop_accounts', JSON.stringify(accounts));
    localStorage.setItem('prop_payouts', JSON.stringify(payouts));
  }, [accounts, payouts]);

  // FIX: Unik ID pakai Date.now + random supaya tidak tabrakan saat import cepat
  const addAccount = (acc) => setAccounts(prev => [...prev, { ...acc, id: Date.now() + Math.random() }]);
  const deleteAccount = (id) => setAccounts(prev => prev.filter(a => a.id !== id));
  
  const addPayout = (pay) => setPayouts(prev => [...prev, { ...pay, id: Date.now() + Math.random() }]);
  const deletePayout = (id) => setPayouts(prev => prev.filter(p => p.id !== id));

  return React.createElement(DataContext.Provider, { value: { accounts, payouts, addAccount, deleteAccount, addPayout, deletePayout } }, children);
};

export const useData = () => useContext(DataContext);
