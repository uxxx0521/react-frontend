import Button_Expense_Tracker from "../Button/Button_Expense_tracker";

function Sign_in() {
  return (
    <>
      <div className="sign-in-page">
        <div>
          <h1>Sign in</h1>
          <div className="id-input-group">
            <label>ID:</label>
            <input type="text" id="id"></input>
          </div>
          <div className="password-input-group">
            <label>Password:</label>
            <input type="text" id="password"></input>
          </div>
          <Button_Expense_Tracker
            text="OK"
            link="/portfolio/expense_tracker"
            className="sign-in-page-ok-button"
          />
        </div>
      </div>
    </>
  );
}

export default Sign_in;
