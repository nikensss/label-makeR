import { deepPurple, purple } from '@material-ui/core/colors';
import { MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { Editor } from './pages/editor/Editor';
import { Start } from './pages/start/Start';

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
          <div className="container">
            <Switch>
              <Route exact path="/" component={Start}></Route>
              <Route exact path="/editor" component={Editor}></Route>
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
