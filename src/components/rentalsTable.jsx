import React, { Component } from "react"
import auth from "../services/authService"
import { Link } from "react-router-dom"
import Table from "./common/table"
import Like from "./common/like"

class RentalsTable extends Component {
  columns = [
    { path: "movie.title", label: "Title" },
    { path: "movie.genre.name", label: "Genre" },
    { path: "dateOut", label: "Rental Date" },
    {
      key: "like",
      content: movie => (
        <Like liked={movie.liked} onClick={() => this.props.onLike(movie)} />
      )
    }
  ]

  deleteColumn = {
    key: "delete",
    content: rental => (
      <button
        onClick={() => this.props.onDelete(rental)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  }

  constructor() {
    super()
    const user = auth.getCurrentUser()
    if (user) this.columns.push(this.deleteColumn)
  }

  render() {
    const { rentals, onSort, sortColumn } = this.props

    return (
      <Table
        columns={this.columns}
        data={rentals}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    )
  }
}

export default RentalsTable
