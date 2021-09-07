import { MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { CoffeeForm } from './pages/coffeeForm/CoffeeForm';
import { Start } from './pages/start/Start';
import { ThankYou } from './pages/thankYou/ThankYou';

const theme = createTheme({
  typography: {
    fontFamily: ['Source Code Pro', 'Courier New', 'monospace'].join(',')
  },
  palette: {
    primary: {
      main: '#1f2430'
    },
    secondary: {
      main: '#FAFAFA'
    }
  }
});

function App(): JSX.Element {
  return (
    <MuiThemeProvider theme={theme}>
      <div className='App'>
        <Router>
          <div className='container'>
            <Switch>
              <Route exact path='/' component={Start} />
              <Route exact path='/coffee' component={CoffeeForm} />
              <Route exact path='/thankyou' component={ThankYou} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
