import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderStatus from '../components/orderstatus';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch order details');
        }

        setOrder(data.data || data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Loading order details...
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>
        Error: {error}
      </div>
    );

  if (!order)
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Order not found.
      </div>
    );

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
      <Link
        to="/orders"
        style={{ textDecoration: 'none', color: '#007bff' }}
      >
        &larr; Back to Orders
      </Link>

      <h2 style={{ marginTop: '15px' }}>Order Details</h2>

      <div
        style={{
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '15px'
          }}
        >
          <div>
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>

            <p>
              <strong>Date:</strong>{' '}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <OrderStatus status={order.status} />
          </div>
        </div>

        <hr
          style={{
            border: '0',
            borderTop: '1px solid #eee',
            margin: '15px 0'
          }}
        />

        <h4>Ordered Items</h4>

        <div style={{ marginBottom: '15px' }}>
          {order.items?.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f9f9f9'
              }}
            >
              <span>
                {item.name} (Qty: {item.quantity})
              </span>

              <span>₹{item.total}</span>
            </div>
          ))}
        </div>

        <hr
          style={{
            border: '0',
            borderTop: '1px solid #eee',
            margin: '15px 0'
          }}
        />

        <h4>Delivery Information</h4>

        <p style={{ margin: '5px 0' }}>
          {order.shippingAddress?.address},{' '}
          {order.shippingAddress?.city}
        </p>

        <p style={{ margin: '5px 0' }}>
          Postal Code: {order.shippingAddress?.postalCode}
        </p>

        <hr
          style={{
            border: '0',
            borderTop: '1px solid #eee',
            margin: '15px 0'
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          <span>Total Amount:</span>

          <span>₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;