import React, { useEffect, useState } from "react";
import axios from 'axios'
import Button_Expense_Tracker from "../Button/Button_Expense_tracker";
import Stock from "../components/Stock";


function Expense_tracker() {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [incomeInputValue, setIncomeInputValue] = useState();
  const [expenseInputValue, setExpenseInputValue] = useState();
  const [nickName, setNickname] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false); // State to track if search is active

  const [dateInputValue, setDateInput] = useState();
  const [filteredEntries, setFilteredEntries] = useState([]);

  const [entries, setEntries] = useState([]);
  const [incomeCategorySelect, setIncomeCategorySelect] = useState("Salary");
  const [expenseCategorySelect, setExpenseCategorySelect] = useState("Mortgage");

  function handleDateInputChange(event) {
    const selectedDate = event.target.value;
    setDateInput(selectedDate);
  }

  function handleSearchButtonClick() {
    const filtered = entries.filter(
      (entries) => entries.date === dateInputValue
    );
    setFilteredEntries(filtered);
    setIsSearchActive(true); // Mark search as active
    if (filtered.length === 0) {
      alert("No result found for the selected date");
    }
  }

  const handleClearSearch = () => {
    setFilteredEntries([]);
    setDateInput("");
    setIsSearchActive(false); // Reset search state
  };

  function handleIncomeInputChange(event) {
    setIncomeInputValue(event.target.value);
  }
  function handleExpenseInputChange(event) {
    setExpenseInputValue(event.target.value);
  }

  function handleIncomeCategorySelectChange(event) {
    setIncomeCategorySelect(event.target.value);
  }
  function handleExpenseCategorySelectChange(event) {
    setExpenseCategorySelect(event.target.value);
  }

  function handleIncomeAddClick() {
    if (incomeInputValue.trim() !== "" && incomeInputValue > 0) {
      setCurrentBalance((prevCurrentBalance) =>
        parseFloat((prevCurrentBalance + Number(incomeInputValue)).toFixed(2))
      );
      setTotalIncome((prevTotalIncome) =>
        parseFloat((prevTotalIncome + Number(incomeInputValue)).toFixed(2))
      );
      const newEntry = {
        type: "Income",
        number: parseFloat(Number(incomeInputValue).toFixed(2)),
        category: incomeCategorySelect,
        date: new Date().toLocaleDateString("en-CA"),
      };
      setEntries([...entries, newEntry]);
      setIncomeInputValue("");
      setDateInput("");
    }
  }
  function handleExpenseAddClick() {
    if (expenseInputValue.trim() !== "" && expenseInputValue > 0) {
      setCurrentBalance((prevCurrentBalance) =>
        parseFloat((prevCurrentBalance - Number(expenseInputValue)).toFixed(2))
      );
      setTotalExpenses((prevTotalExpenses) =>
        parseFloat((prevTotalExpenses + Number(expenseInputValue)).toFixed(2))
      );
      const newEntry = {
        type: "Expense",
        number: parseFloat(Number(expenseInputValue).toFixed(2)),
        category: expenseCategorySelect,
        date: new Date().toLocaleDateString("en-CA"),
      };
      setEntries([...entries, newEntry]);
      setExpenseInputValue("");
      setDateInput("");
    }
  }
  function deleteEntry(index) {
    if (index < 0 || index >= entries.length) return;
    const entryToDelete = entries[index];
    if (!entryToDelete) return;

    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    const amount = parseFloat(entryToDelete.number.toFixed(2));
    if (entryToDelete.type === "Income") {
      setCurrentBalance(prev => parseFloat((prev - amount).toFixed(2)));
      setTotalIncome(prev => parseFloat((prev - amount).toFixed(2)));
    } else {
      setCurrentBalance(prev => parseFloat((prev + amount).toFixed(2)));
      setTotalExpenses(prev => parseFloat((prev - amount).toFixed(2)));
    }
  }


  /*// Fetch user data when mount.
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch("URL")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await response.json();
        // Destructure the user and history from the response
        const { user: generalData, history } = data;

        setCurrentBalance(generalData.currentBalance)
        setTotalExpenses(generalData.totalExpenses)
        setTotalIncome(generalData.totalIncome)
        setNickname(generalData.nickname)
        setEntries(history);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchdata();
  }, []);
*/

  return (
    <>
      <div className="scroll-container">
        <div className="App-expense-tracker-page">
          <div className="Express-tracker-dashboard">
            <Button_Expense_Tracker
              text="←"
              link="/portfolio"
              className="home-button"
            />
            <h1 className="Express-tracker-dashboard-title">Hi, guest :) Log in to retrieve your data.</h1>
            <div className="right-button-container">
              <Button_Expense_Tracker
                text="Sign in"
                link="/portfolio/expense_tracker/sign_in"
                className="Sign-in-button"
              />
              <Button_Expense_Tracker
                text="Sign up"
                link="/portfolio/expense_tracker/sign_up"
                className="Sign-up-button"
              />
            </div>
          </div>
          <div className="App-expense-tracker">
            {/*BALANCE SUMMARY*/}
            <div className="App-balance-summary-section">
              <div className="app-title-wrapper">
                <h1 className="app-section-title">Balance Summary</h1>
              </div>
              <div className="App-balance-summary-display-section">
                <div className="Current-balance-display-box">
                  <p className="summary">Current Balance</p>
                  <p className="summary-balance">${currentBalance}</p>
                </div>
                <div className="Total-income-display-box">
                  <p className="summary">Total Income</p>
                  <p className="summary-income">${totalIncome}</p>
                </div>
                <div className="Total-expenses-display-box">
                  <p className="summary">Total Expenses</p>
                  <p className="summary-expense">${totalExpenses}</p>
                </div>
              </div>
            </div>
            {/*NEW Transaction*/}
            <div className="App-add-new-transaction-section">
              <div className="app-title-wrapper">
                <h1 className="app-section-title">New Transaction</h1>
              </div>
              <p className="add-income-title">Add Income</p>
              <input
                className="input"
                placeholder="Amount"
                type="number"
                id="incomeInput"
                value={incomeInputValue}
                onChange={handleIncomeInputChange}
              ></input>
              <select className="select" onChange={handleIncomeCategorySelectChange}>
                <option value="Salary">Salary</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
              <button className="add-button" onClick={handleIncomeAddClick}>Add</button>
              <p className="add-income-title">Add Expense</p>
              <input
                className="input"
                placeholder="Amount"
                type="number"
                id="expenseinput"
                value={expenseInputValue}
                onChange={handleExpenseInputChange}
              ></input>
              <select className="select" onChange={handleExpenseCategorySelectChange}>
                <option value="Mortgage">Mortgage</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
              <button className="add-button" onClick={handleExpenseAddClick}>Add</button>
            </div>
            {/*Transaction History*/}
            <div className="App-trasaction-history">
              <div className="app-title-wrapper">
                <h1 className="app-section-title">{isSearchActive ? "Searched Result" : "Transaction History"}</h1>
              </div>

              <div className="history-search-bar">
                <input
                  type="date"
                  onChange={handleDateInputChange}
                  value={dateInputValue}
                />
                <button onClick={handleSearchButtonClick}>Search</button>
                <button>Filter</button>
                <button onClick={handleClearSearch}>Clear</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dateInputValue && filteredEntries.length > 0
                      ? filteredEntries
                      : entries
                    ).map((entries, index) => (
                      <tr key={index}>
                        <td>{entries.type}</td>
                        <td>{entries.number}</td>
                        <td>{entries.category}</td>
                        <td>{entries.date}</td>
                        <td>
                          <button className="delete-button" onClick={() => deleteEntry(index)}>X</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/*HISTORY LIST TEST
              <h2>Searched Result</h2>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((filteredEntries, index) => (
                    <tr key={index}>
                      <td>{filteredEntries.type}</td>
                      <td>{filteredEntries.number}</td>
                      <td>{filteredEntries.category}</td>
                      <td>{filteredEntries.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              */}
            </div>
            <Stock />
          </div>
        </div>
      </div >

    </>
  );
}

export default Expense_tracker;
