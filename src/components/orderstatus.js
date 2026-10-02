import React from 'react';

const OrderStatus = ({ status }) => {
  const currentStatus =
    typeof status === 'string'
      ? status
      : status?.status || status?.name || '';

  const normalizedStatus = String(currentStatus).toLowerCase();

  const getStatusStyle = () => {
    switch (normalizedStatus) {
      case 'pending':
        return {
          backgroundColor: '#fff3cd',
          color: '#856404'
        };

      case 'processing':
        return {
          backgroundColor: '#cce5ff',
          color: '#004085'
        };

      case 'shipped':
        return {
          backgroundColor: '#d1ecf1',
          color: '#0c5460'
        };

      case 'delivered':
        return {
          backgroundColor: '#d4edda',
          color: '#155724'
        };

      case 'cancelled':
        return {
          backgroundColor: '#f8d7da',
          color: '#721c24'
        };

      default:
        return {
          backgroundColor: '#e2e3e5',
          color: '#383d41'
        };
    }
  };

  return (
    <span
      style={{
        ...getStatusStyle(),
        padding: '6px 12px',
        borderRadius: '15px',
        fontSize: '13px',
        fontWeight: 'bold'
      }}
    >
      {currentStatus || 'Unknown'}
    </span>
  );
};

export default OrderStatus;