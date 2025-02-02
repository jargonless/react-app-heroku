import React from "react"
import Joi from "joi-browser"
import Form from "./common/form"
import { getMovie } from "../services/movieService"
import { getGenres } from "../services/genreService"
import { rentMovie } from "../services/rentService"
import { getCurrentUser } from "../services/authService"

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      genreName: "",
      numberInStock: "",
      dailyRentalRate: "",
      rentalTime:""
    },
    genres: [],
    errors: {}
  }

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
    rentalTime: Joi.number()
      .required()
      .min(0)
      .label("Rental Time ")
  }

  async populateGenres() {
    const { data: genres } = await getGenres()
    this.setState({ genres })
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id
      if (movieId === "new") return

      const { data: movie } = await getMovie(movieId)
      this.setState({ data: this.mapToViewModel(movie) })
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found")
    }
  }

  async componentDidMount() {
    await this.populateGenres()
    await this.populateMovie()
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      genreName: movie.genre.name,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
      rentalTime: 10
    }
  }

  doSubmit = async () => {
    const body = {
      movieId: `${this.state.data._id}`,
      userId: `${getCurrentUser()._id}`,
      rentalTime: `${this.state.data.rentalTime}`
    }
    await rentMovie(body)
    window.confirm('The movie is added to your rental list')
    this.props.history.push("/movies")
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderForm("title", "Title")}
          {this.renderForm("genreName", "Genre")}
          {this.renderForm("numberInStock", "Number in Stock", "number")}
          {this.renderForm("dailyRentalRate", "Daily rental rate")}
          {this.renderInput("rentalTime", "For how many days would you like to rent it? ")}
          {this.renderButton("Rent")}
        </form>
      </div>
    )
  }
}

export default MovieForm
