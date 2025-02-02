import React, { Component } from "react"
import { Route, Redirect, Switch } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Movies from "./components/movies"
import Rentals from "./components/rentals"
import MovieForm from "./components/movieForm"
import NotFound from "./components/notFound"
import NavBar from "./components/navBar"
import LoginForm from "./components/loginForm"
import RegisterForm from "./components/registerForm"
import Logout from "./components/logout"
import ProtectedRoute from "./components/common/protectedRoute"
import auth from "./services/authService"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

class App extends Component {
  state = {}

  componentDidMount() {
    const user = auth.getCurrentUser()
    this.setState({ user })
  }

  render() {
    const { user } = this.state

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <p className="editorInfo">This app is implemented by <b className="editorName">Yixin (Francis) Liu</b> as software development class project</p>
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/movies/:id" component={MovieForm} />
            <Route
              path="/movies"
              render={props => <Movies {...props} user={this.state.user} />}
            />
            <Route
              path="/rentals"
              render={props => <Rentals {...props} user={this.state.user} />}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    )
  }
}

export default App
