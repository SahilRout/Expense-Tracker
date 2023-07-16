import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { auth } from "../firebase";
import './Home.css'
const Home = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const { logOut, user, total, setTransactionName, setTransacitonType, setPrice, addTransaction, transactions, deleteTransaction } = useUserAuth();
  return (
    <div className="mainBlock">
      <div className="trackerBlock">
        <div className="welcome">
          <span>Balance</span>
          <button className="exit" onClick={handleLogout}>Exit</button>
        </div>
        <div className="totalMoney">₹{total}</div>
        <div className="newTransactionBlock">
          <div className="newTransaction">
            <form >
              <input type="text"
                placeholder="Transaction Name"
                name="transactionName" pattern="[A-Za-z0-9]{1,20}" onChange={(e) => setTransactionName(e.target.value)} />
              <div className="inputGroup">
                <select name="type" onChange={(e) => setTransacitonType(e.target.value)} >
                  <option value="deposit">Deposit</option>
                  <option value="expense">Expense</option>
                </select>
                <input type="number"
                  placeholder="Price"
                  name="Price"
                  onChange={(e) => setPrice(e.target.value)} />
              </div>

              <button type="submit" className="addTransaction" onClick={(e) => { addTransaction(e) }}>+ Add Transaction</button>
            </form>
          </div>
        </div>

        <div className="latestTransactions">
          <p>Latest Transactions</p>
          <ul>
            {transactions.length === 0 ? "No Transactions" : transactions.map((transaction) => {
              if (transaction.email === auth.currentUser.email) {
                return (<li>
                  {console.log(transaction)}<div>{transaction.transactionName}</div>
                  <div>{transaction.transactionType === "deposit" ? "+" : "-"}₹{transaction.price}</div>
                  <button className="btn btn-sm btn-danger" onClick={(e) => { deleteTransaction(transaction, e) }} >Delete</button>
                </li>)
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
