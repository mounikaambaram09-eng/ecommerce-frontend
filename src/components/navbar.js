import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import { CartContext } from '../context/cartcontext';

function Navbar() {

  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const { cartItems, getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCount = getCartCount
    ? getCartCount()
    : (
        Array.isArray(cartItems)
          ? cartItems.reduce(
              (sum, item) => sum + (item.quantity || 1),
              0
            )
          : 0
      );

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#333',
        color: '#fff'
      }}
    >


      <Link
        to={isAdmin ? "/admin" : "/"}
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      >
        MyStore
      </Link>


      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}
      >


        {(!isLoggedIn || !isAdmin) && (
          <>
            <Link
              to="/"
              style={{
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              Home
            </Link>

            <Link
              to="/products"
              style={{
                color: '#f3f6f8',
                textDecoration: 'underline',
                fontSize: '16px'
              }}
            >
              Products
            </Link>
          </>
        )}



        {isLoggedIn ? (
          <>

           

            {!isAdmin && (
              <>

                <Link
                  to="/cart"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Cart ({totalCount})
                </Link>

                <Link
                  to="/orders"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  My Orders
                </Link>

              </>
            )}



            {isAdmin && (
              <>

                <Link
                  to="/admin"
                  style={{
                    color: 'burlywood',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin/orders"
                  style={{
                    color: 'burlywood',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Admin Orders
                </Link>

                <Link
                  to="/admin/products"
                  style={{
                    color: 'orangered',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Admin Products
                </Link>

                <Link
                  to="/admin/categories"
                  style={{
                    color: 'orangered',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Admin Categories
                </Link>

              </>
            )}


  

            <span
              style={{
                color: '#2ecc71',
                fontWeight: '500'
              }}
            >
              Welcome, {user?.name || 'User'}
              {isAdmin ? ' Admin' : ''}
            </span>



            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>

          </>

        ) : (


          <>
            <Link
              to="/login"
              style={{
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              Register
            </Link>
          </>

        )}

      </div>
    </nav>
  );
}

export default Navbar;