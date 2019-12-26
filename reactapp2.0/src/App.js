import React from "react";
import logo from "./logo.svg";
import "./App.css";

//material ui
import Button from "@material-ui/core/Button";
//material theming for better customization {view documentation for more}
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
//importing colors
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
//creating universal themes for better customization
const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green
  },
  status: {
    danger: "orange"
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <div className="App">
          <Button variant="contained" color="primary">
            Hello World!
          </Button>
        </div>
      </React.Fragment>
    </MuiThemeProvider>
  );
}

export default App;
