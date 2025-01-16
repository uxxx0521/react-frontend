import React, { useEffect, useState } from "react";
import axios from 'axios'
import Button_Expense_Tracker from "../Button/Button_Expense_tracker";

function Me() {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [incomeInputValue, setIncomeInputValue] = useState();
    const [expenseInputValue, setExpenseInputValue] = useState();
    const [nickName, setNickname] = useState("");
    const [loading, setLoading] = useState(true); // Add a loading state

    const [dateInputValue, setDateInput] = useState();
    const [filteredEntries, setFilteredEntries] = useState([]);

    const [entries, setEntries] = useState([]);
    const [incomeCategorySelect, setIncomeCategorySelect] = useState("Salary");
    const [expenseCategorySelect, setExpenseCategorySelect] =
        useState("Mortgage");

    function handleDateInputChange(event) {
        const selectedDate = event.target.value;
        setDateInput(selectedDate);
    }

    function handleSearchButtonClick() {
        const filtered = entries.filter(
            (entries) => entries.date === dateInputValue
        );
        setFilteredEntries(filtered);
        if (filtered.length === 0) {
            alert("No result found for the selected date");
        }
    }

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
                date: new Date().toISOString().slice(0, 10),
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
                date: new Date().toISOString().slice(0, 10),
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

    // Fetch user data when mount.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
                if (!token) {
                    throw new Error("No access token available");
                }

                const response = await fetch("http://localhost:3000/fetch", {
                    method: "GET", // Explicitly specify the method
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const { generalData, history } = data;

                // Update state with fetched data
                setCurrentBalance(parseFloat(generalData.currentBalance) || 0);
                setTotalExpenses(parseFloat(generalData.totalExpenses) || 0);
                setTotalIncome(parseFloat(generalData.totalIncome) || 0);
                setNickname(generalData.nickname || "Guest");
                setEntries(history.map((entry) => ({
                    ...entry,
                    number: parseFloat(entry.balance), // Ensure balance is a number
                })) || []);

                setLoading(false); // Data has been successfully loaded
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false); // Stop loading on error
            }
        };

        fetchData();
    }, []); // Run only once on component mount

    // Post user data to server
    const saveUserData = async () => {
        try {
            const response = await fetch("http://localhost:3000/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include the token for authentication
                },
                body: JSON.stringify({
                    currentBalance,
                    totalIncome,
                    totalExpenses,
                    history: entries, // Use `entries` here as it's your history array
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save user data.");
            }

            const data = await response.json();
            console.log("User data saved successfully:", data);
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    };

    // Trigger SAVE API CALL whenever relevant state variables change
    useEffect(() => {
        if (!loading) {
            saveUserData();
        }
    }, [currentBalance, totalIncome, totalExpenses, entries]);

    // LOG OUT API CALL
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
            localStorage.removeItem("accessToken"); // Clear access token
            window.location.href = "/portfolio/expense_tracker"; // Redirect to public page
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            <div className="App-expense-tracker-page">
                <div className="Express-tracker-dashboard">
                    <h1 className="Express-tracker-dashboard-title">Dashboard</h1>
                    <Button_Expense_Tracker
                        text="Log out"
                        link="/portfolio/expense_tracker"
                        className="Log-out-button"
                        onClick={handleLogout}
                    />

                </div>

                <div className="App-expense-tracker">
                    {/*BALANCE SUMMARY*/}
                    <div className="App-balance-summary-section">
                        <h1>Balance Summary</h1>
                        <div class="App-balance-summary-display-section">
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
                        <h1>Add New Transaction</h1>
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
                        <h1>Transaction History</h1>
                        <input type="date" onChange={handleDateInputChange}></input>
                        <button onClick={handleSearchButtonClick}>Search</button>
                        <button>Filter</button>
                        <button>Sort</button>
                        <p>History</p>
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
                                            <button onClick={() => deleteEntry(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/*HISTORY LIST TEST*/}
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

                        <p>{dateInputValue}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Me;
