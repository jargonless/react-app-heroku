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
      dailyRentalRate: ""
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
      .label("Daily Rental Rate")
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
      dailyRentalRate: movie.dailyRentalRate
    }
  }

  doSubmit = async () => {
    const body = {
      movieId: `${this.state.data._id}`,
      userId: `${getCurrentUser()._id}`
    }
    await rentMovie(body)
    window.confirm('The movie is added to your rental list')
    this.props.history.push("/movies")
  }

  render() {
    return (
      <div>
        {this.renderInfo(this.state.data)}
        <form onSubmit={this.handleSubmit}>
          {this.renderButton("Rent")}
        </form>
      </div>


    )
  }
}

export default MovieForm
