import { deepPurple, purple } from '@material-ui/core/colors';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { Navbar } from './components/navbar/Navbar';
import { Home } from './pages/home/Home';

const theme = createTheme({
  palette: {
    primary: deepPurple,
    secondary: purple
  }
});

function App(): JSX.Element {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home}></Route>
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
