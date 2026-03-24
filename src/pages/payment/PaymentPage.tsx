import React, { useState } from 'react';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, ArrowLeftRight,
  TrendingUp, DollarSign, CheckCircle, Clock, XCircle
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'funding';
  amount: number;
  sender: string;
  receiver: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

const PaymentPage: React.FC = () => {
  const [balance, setBalance] = useState(25000);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'funding',
      amount: 50000,
      sender: 'Ali Khan (Investor)',
      receiver: 'Sarah Johnson (Entrepreneur)',
      status: 'completed',
      date: '2026-03-10',
      description: 'Series A Funding - Nexus Deal',
    },
    {
      id: '2',
      type: 'deposit',
      amount: 10000,
      sender: 'Bank Transfer',
      receiver: 'You',
      status: 'completed',
      date: '2026-03-12',
      description: 'Wallet Top Up',
    },
    {
      id: '3',
      type: 'transfer',
      amount: 5000,
      sender: 'You',
      receiver: 'Sara Ahmed',
      status: 'pending',
      date: '2026-03-14',
      description: 'Deal Advance Payment',
    },
    {
      id: '4',
      type: 'withdraw',
      amount: 2000,
      sender: 'You',
      receiver: 'Bank Account',
      status: 'completed',
      date: '2026-03-15',
      description: 'Withdrawal to Bank',
    },
    {
      id: '5',
      type: 'funding',
      amount: 25000,
      sender: 'Nexus Fund',
      receiver: 'You',
      status: 'failed',
      date: '2026-03-16',
      description: 'Seed Funding - Round 1',
    },
  ]);

  // Handle Transaction
  const handleTransaction = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    if (activeTab === 'withdraw' && amt > balance) {
      alert('Insufficient balance!');
      return;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: activeTab,
      amount: amt,
      sender: activeTab === 'deposit' ? 'Bank Transfer' : 'You',
      receiver: activeTab === 'deposit' ? 'You' : receiver || 'Bank Account',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      description: activeTab === 'deposit'
        ? 'Wallet Deposit'
        : activeTab === 'withdraw'
        ? 'Wallet Withdrawal'
        : `Transfer to ${receiver}`,
    };

    if (activeTab === 'deposit') setBalance(prev => prev + amt);
    if (activeTab === 'withdraw') setBalance(prev => prev - amt);
    if (activeTab === 'transfer') setBalance(prev => prev - amt);

    setTransactions([newTx, ...transactions]);
    setAmount('');
    setReceiver('');
    setSuccessMsg(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} of $${amt.toLocaleString()} successful!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Status Style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'failed': return <XCircle size={12} />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft size={16} className="text-green-500" />;
      case 'withdraw': return <ArrowUpRight size={16} className="text-red-500" />;
      case 'transfer': return <ArrowLeftRight size={16} className="text-blue-500" />;
      case 'funding': return <TrendingUp size={16} className="text-purple-500" />;
      default: return null;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-green-50';
      case 'withdraw': return 'bg-red-50';
      case 'transfer': return 'bg-blue-50';
      case 'funding': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6"> Payment Section</h1>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <CheckCircle size={18} />
          {successMsg}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-primary-100 text-sm">Wallet Balance</p>
            <Wallet size={20} className="text-primary-200" />
          </div>
          <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
          <p className="text-primary-200 text-xs mt-1">Available funds</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">Total Received</p>
            <ArrowDownLeft size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${transactions
              .filter(t => t.status === 'completed' && (t.type === 'deposit' || t.type === 'funding'))
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs mt-1">Deposits + Funding</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">Total Sent</p>
            <ArrowUpRight size={20} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${transactions
              .filter(t => t.status === 'completed' && (t.type === 'withdraw' || t.type === 'transfer'))
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs mt-1">Withdrawals + Transfers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Action Panel */}
        <div className="flex flex-col gap-4">

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
              {(['deposit', 'withdraw', 'transfer'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white text-primary-600 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Amount (USD)</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>

              {activeTab === 'transfer' && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Receiver Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={receiver}
                    onChange={e => setReceiver(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
              )}

              <button
                onClick={handleTransaction}
                className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all ${
                  activeTab === 'deposit' ? 'bg-green-500 hover:bg-green-600' :
                  activeTab === 'withdraw' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {activeTab === 'deposit' ? '⬇ Deposit' :
                 activeTab === 'withdraw' ? '⬆ Withdraw' :
                 '↔ Transfer'}
              </button>
            </div>
          </div>

          {/* Funding Deal Mock */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-3"> Fund a Deal</h2>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <p className="text-xs text-purple-600 font-medium">Nexus Deal — Series A</p>
              <p className="text-xs text-gray-500 mt-1">Investor → Entrepreneur</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800">$50,000</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Active</span>
              </div>
              <button
                onClick={() => {
                  setSuccessMsg('Deal funding of $50,000 initiated!');
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }}
                className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg text-xs hover:bg-purple-700 transition-all"
              >
                 Fund This Deal
              </button>
            </div>
          </div>
        </div>

        {/* Right: Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">
                 Transaction History ({transactions.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Sender</th>
                    <th className="px-4 py-3 text-left">Receiver</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} className="border-t border-gray-50 hover:bg-gray-50 transition-all">
                      <td className="px-4 py-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeBg(tx.type)}`}>
                          {getTypeIcon(tx.type)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-gray-700">{tx.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{tx.sender}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{tx.receiver}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-gray-800">
                          ${tx.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border w-fit ${getStatusStyle(tx.status)}`}>
                          {getStatusIcon(tx.status)}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-400">{tx.date}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;