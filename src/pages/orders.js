import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderCard from '../components/ordercard';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');

        
        let userId = localStorage.getItem('userid');

        
        if (!userId) {
          const userData = localStorage.getItem('user');

          if (userData) {
            const user = JSON.parse(userData);

            userId = user?.id || user?._id || user?.userId;
          }
        }

        console.log('TOKEN:', token);
        console.log('USER ID:', userId);

        if (!userId) {
          throw new Error('User ID not found. Please login again.');
        }

        const response = await fetch(
          `http://localhost:5000/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        setOrders(data.data || data);

      } catch (err) {
        console.error('Orders Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          marginTop: '50px'
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '30px auto',
        padding: '0 20px'
      }}
    >
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p>You have not placed any orders yet.</p>

          <Link
            to="/"
            style={{
              color: '#007bff',
              textDecoration: 'underline'
            }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;