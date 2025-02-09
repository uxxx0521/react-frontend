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
    if (incomeInputValue.trim() !== "") {
      setCurrentBalance(
        (prevCurrentlBalance) => prevCurrentlBalance + Number(incomeInputValue)
      );
      setTotalIncome(
        (prevTotalIncome) => prevTotalIncome + Number(incomeInputValue)
      );
      const newEntry = {
        type: "Income",
        number: Number(incomeInputValue),
        category: incomeCategorySelect,
        date: new Date().toLocaleDateString("en-CA"),
      };
      setEntries([...entries, newEntry]);
      setIncomeInputValue("");
    }
  }
  function handleExpenseAddClick() {
    if (expenseInputValue.trim() !== "") {
      setCurrentBalance(
        (prevCurrentlBalance) => prevCurrentlBalance - Number(expenseInputValue)
      );
      setTotalExpenses(
        (prevTotalExpenses) => prevTotalExpenses + Number(expenseInputValue)
      );
      const newEntry = {
        type: "Expense",
        number: Number(expenseInputValue),
        category: expenseCategorySelect,
        date: new Date().toLocaleDateString("en-CA"),
      };
      setEntries([...entries, newEntry]);
      setExpenseInputValue("");
    }
  }
  function deleteEntry(index) {
    const entryToDelete = entries[index];
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    if (entryToDelete.type === "Income") {
      setCurrentBalance(
        (prevCurrentlBalance) => prevCurrentlBalance - entryToDelete.number
      );
      setTotalIncome(
        (prevTotalIncome) => prevTotalIncome - entryToDelete.number
      );
    } else {
      setCurrentBalance(
        (prevCurrentlBalance) => prevCurrentlBalance + entryToDelete.number
      );
      setTotalExpenses(
        (prevTotalIncome) => prevTotalIncome - entryToDelete.number
      );
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
      <div className="App-expense-tracker-page">
        <div className="Express-tracker-dashboard">
          <Button_Expense_Tracker
            text="Home"
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
            <h1 className="app-section-title">Balance Summary</h1>
            <div className="App-balance-summary-display-section">
              <div className="Current-balance-display-box">
                <p>Current Balance</p>
                <p>${currentBalance}</p>
              </div>
              <div className="Total-income-display-box">
                <p>Total Income</p>
                <p>${totalIncome}</p>
              </div>
              <div className="Total-expenses-display-box">
                <p>Total Expenses</p>
                <p>${totalExpenses}</p>
              </div>
            </div>
          </div>

          {/*NEW Transaction*/}
          <div className="App-add-new-transaction-section">
            <h1 className="app-section-title">Add New Transaction</h1>
            <p>Add income</p>
            <input
              placeholder="Income amount"
              type="number"
              id="incomeInput"
              value={incomeInputValue}
              onChange={handleIncomeInputChange}
            ></input>
            <select onChange={handleIncomeCategorySelectChange}>
              <option value="Salary">Salary</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
            <button onClick={handleIncomeAddClick}>Add</button>
            <p>Add Expense</p>
            <input
              placeholder="Expense amount"
              type="number"
              id="expenseinput"
              value={expenseInputValue}
              onChange={handleExpenseInputChange}
            ></input>
            <select onChange={handleExpenseCategorySelectChange}>
              <option value="Mortgage">Mortgage</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
            <button onClick={handleExpenseAddClick}>Add</button>
          </div>



          {/*Transaction History*/}
          <div className="App-trasaction-history">
            <h1 className="app-section-title">{isSearchActive ? "Searched Result" : "Transaction History"}</h1>
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
      </div >

    </>
  );
}

export default Expense_tracker;
