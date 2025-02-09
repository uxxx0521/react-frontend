import Button_Header from '../Button/Button_header'

function Header() {

  return (
    <header>
      <h1 className="header-title">Welcome to Chengzhe's Portfolio!</h1>

      <div style={{ height: '10px' }} ></div>
      <div className="button-div">
        <div><Button_Header text="Home" link="/" className="button-header" /></div>
        <div><Button_Header text="Resume" link="/resume" className="button-header" /></div>
        <div><Button_Header text="Portfolio" link="/portfolio" className="button-header" /></div>
        <div><Button_Header text="Github" link="/github" className="button-header" /></div>
      </div>
      <hr></hr>
    </header>


  );

}

export default Header;