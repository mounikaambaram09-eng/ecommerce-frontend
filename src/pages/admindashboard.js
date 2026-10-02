import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "confirmed"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="admin-dashboard-page">
          <div className="dashboard-loading">
            <div className="dashboard-spinner"></div>
            <h3>Loading Dashboard...</h3>
            <p>Please wait while we load your order statistics.</p>
          </div>
        </div>
      </>
    );
  }


  if (error) {
    return (
      <>
        <style>{styles}</style>

        <div className="admin-dashboard-page">
          <div className="dashboard-error">
            <div className="error-icon">!</div>

            <h2>Unable to Load Dashboard</h2>

            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <style>{styles}</style>

      <div className="admin-dashboard-page">

        

        <div className="dashboard-header">

          <div>
            <p className="dashboard-welcome">
              Welcome back, Admin 👋
            </p>

            <h1>Admin Dashboard</h1>

            <p className="dashboard-subtitle">
              Here's what's happening with your orders today.
            </p>
          </div>

          <div className="dashboard-date">
            <span>📅</span>
            <div>
              <small>Today</small>
              <strong>
                {new Date().toLocaleDateString()}
              </strong>
            </div>
          </div>

        </div>


    

        <div className="section-heading">
          <div>
            <h2>Order Overview</h2>
            <p>Track your order activity at a glance</p>
          </div>
        </div>


       

        <div className="stats-grid">

       

          <div className="stat-card total-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                📦
              </div>

              <span className="stat-label">
                TOTAL
              </span>

            </div>

            <div className="stat-content">

              <h2>{totalOrders}</h2>

              <p>Total Orders</p>

            </div>

            <div className="stat-footer">
              <span>All orders</span>
              <span>→</span>
            </div>

          </div>


          {/* PENDING */}

          <div className="stat-card pending-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                ⏳
              </div>

              <span className="stat-label">
                PENDING
              </span>

            </div>

            <div className="stat-content">

              <h2>{pendingOrders}</h2>

              <p>Pending Orders</p>

            </div>

            <div className="stat-footer">
              <span>Awaiting action</span>
              <span>→</span>
            </div>

          </div>


         

          <div className="stat-card processing-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                ⚙️
              </div>

              <span className="stat-label">
                PROCESSING
              </span>

            </div>

            <div className="stat-content">

              <h2>{processingOrders}</h2>

              <p>Processing Orders</p>

            </div>

            <div className="stat-footer">
              <span>Being processed</span>
              <span>→</span>
            </div>

          </div>


         

          <div className="stat-card delivered-card">

            <div className="stat-card-top">

              <div className="stat-icon">
                ✓
              </div>

              <span className="stat-label">
                DELIVERED
              </span>

            </div>

            <div className="stat-content">

              <h2>{deliveredOrders}</h2>

              <p>Delivered Orders</p>

            </div>

            <div className="stat-footer">
              <span>Successfully delivered</span>
              <span>→</span>
            </div>

          </div>

        </div>


        <div className="summary-panel">

          <div className="summary-icon">
            📊
          </div>

          <div className="summary-content">

            <h3>Order Summary</h3>

            <p>
              You currently have{" "}
              <strong>{totalOrders}</strong>{" "}
              total orders, with{" "}
              <strong>{pendingOrders}</strong>{" "}
              pending and{" "}
              <strong>{deliveredOrders}</strong>{" "}
              successfully delivered.
            </p>

          </div>

        </div>

      </div>
    </>
  );
};



const styles = `


.admin-dashboard-page {
  min-height: calc(100vh - 80px);
  padding: 40px 35px 60px;
  background: #f5f7fb;
  box-sizing: border-box;
}



.dashboard-header {
  max-width: 1200px;
  margin: 0 auto 40px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
}

.dashboard-welcome {
  margin: 0 0 5px;
  color: #6366f1;
  font-size: 14px;
  font-weight: 600;
}

.dashboard-header h1 {
  margin: 0;
  color: #111827;
  font-size: 34px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.dashboard-subtitle {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 15px;
}



.dashboard-date {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 13px 18px;

  background: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.dashboard-date > span {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eef2ff;
  border-radius: 9px;

  font-size: 18px;
}

.dashboard-date small {
  display: block;
  color: #9ca3af;
  font-size: 11px;
}

.dashboard-date strong {
  display: block;
  margin-top: 2px;
  color: #374151;
  font-size: 13px;
}



.section-heading {
  max-width: 1200px;
  margin: 0 auto 20px;
}

.section-heading h2 {
  margin: 0;
  color: #1f2937;
  font-size: 21px;
}

.section-heading p {
  margin: 5px 0 0;
  color: #9ca3af;
  font-size: 13px;
}



.stats-grid {
  max-width: 1200px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 20px;
}


.stat-card {
  position: relative;

  min-height: 215px;

  padding: 23px;

  background: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 16px;

  box-sizing: border-box;

  overflow: hidden;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-5px);

  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.10);
}


/* TOP */

.stat-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


/* ICON */

.stat-icon {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  font-size: 21px;
}


/* LABEL */

.stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #9ca3af;
}


/* CONTENT */

.stat-content {
  margin-top: 25px;
}

.stat-content h2 {
  margin: 0;

  font-size: 36px;
  line-height: 1;

  color: #111827;
  font-weight: 750;
}

.stat-content p {
  margin: 8px 0 0;

  color: #6b7280;

  font-size: 14px;
  font-weight: 600;
}


/* FOOTER */

.stat-footer {
  position: absolute;

  bottom: 20px;
  left: 23px;
  right: 23px;

  padding-top: 13px;

  border-top: 1px solid #f0f1f4;

  display: flex;
  justify-content: space-between;

  color: #9ca3af;

  font-size: 11px;
}

.stat-footer span:last-child {
  font-size: 16px;
  color: #6b7280;
}




/* TOTAL */

.total-card .stat-icon {
  background: #eef2ff;
  color: #4f46e5;
}

.total-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background: #4f46e5;
}


/* PENDING */

.pending-card .stat-icon {
  background: #fff7ed;
  color: #ea580c;
}

.pending-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background: #f97316;
}



.processing-card .stat-icon {
  background: #eff6ff;
  color: #2563eb;
}

.processing-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background: #3b82f6;
}



.delivered-card .stat-icon {
  background: #ecfdf5;
  color: #059669;
}

.delivered-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background: #10b981;
}



.summary-panel {
  max-width: 1200px;

  margin: 30px auto 0;

  padding: 24px;

  display: flex;
  align-items: center;
  gap: 18px;

  background: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 16px;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
}

.summary-icon {
  width: 50px;
  height: 50px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f3f4f6;

  border-radius: 12px;

  font-size: 22px;
}

.summary-content h3 {
  margin: 0 0 6px;

  color: #1f2937;
  font-size: 16px;
}

.summary-content p {
  margin: 0;

  color: #6b7280;

  font-size: 13px;

  line-height: 1.6;
}

.summary-content strong {
  color: #4f46e5;
}



.dashboard-loading {
  min-height: 450px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  color: #6b7280;
}

.dashboard-loading h3 {
  margin: 15px 0 5px;
  color: #374151;
}

.dashboard-loading p {
  margin: 0;
  font-size: 13px;
}

.dashboard-spinner {
  width: 42px;
  height: 42px;

  border: 4px solid #e5e7eb;
  border-top-color: #4f46e5;

  border-radius: 50%;

  animation: dashboard-spin 0.8s linear infinite;
}

@keyframes dashboard-spin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}


.dashboard-error {
  max-width: 500px;

  margin: 80px auto;

  padding: 35px;

  background: #ffffff;

  border-radius: 16px;

  text-align: center;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

.error-icon {
  width: 48px;
  height: 48px;

  margin: 0 auto 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fee2e2;

  color: #dc2626;

  border-radius: 50%;

  font-size: 25px;
  font-weight: 700;
}

.dashboard-error h2 {
  margin: 0 0 8px;

  color: #1f2937;
}

.dashboard-error p {
  margin: 0;

  color: #dc2626;

  font-size: 14px;
}



@media (max-width: 1000px) {

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}



@media (max-width: 650px) {

  .admin-dashboard-page {
    padding: 25px 15px 40px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;

    margin-bottom: 30px;
  }

  .dashboard-header h1 {
    font-size: 28px;
  }

  .dashboard-date {
    width: 100%;
    box-sizing: border-box;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    min-height: 200px;
  }

  .summary-panel {
    align-items: flex-start;
  }

}



@media (max-width: 400px) {

  .dashboard-header h1 {
    font-size: 25px;
  }

  .stat-content h2 {
    font-size: 32px;
  }

  .summary-panel {
    padding: 18px;
  }

}

`;

export default AdminDashboard;