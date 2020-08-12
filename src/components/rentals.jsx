import React, { Component } from "react"
import { toast } from "react-toastify"
import RentalsTable from './rentalsTable'
import ListGroup from "./common/listGroup"
import Pagination from "./common/pagination"
import { getRentals, deleteRental } from "../services/rentService"
import { getCurrentUser } from '../services/authService'
import { getGenres } from "../services/genreService"
import { paginate } from "../utils/paginate"
import moment from 'moment'
import _ from "lodash"
import SearchBox from "./searchBox"

class Rentals extends Component {
  state = {
    rentals: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  }

  async componentDidMount() {
    const { data } = await getGenres()
    const genres = [{ _id: "", name: "All Genres" }, ...data]

    const { data: rentals } = await getRentals(getCurrentUser()._id)
    rentals.forEach(e => { e.dateOut = moment(e.dateOut).format('YYYY-MM-DD') })
    this.setState({ rentals, genres })
  }

  handleDelete = async rental => {
    let isReturn = window.confirm("Are you sure you want to return this rental?");
    if (!isReturn) return

    const originalRentals = this.state.rentals
    const rentals = originalRentals.filter(m => m._id !== rental._id)
    this.setState({ rentals })

    try {
      await deleteRental(rental._id)
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.")

      this.setState({ rentals: originalRentals })
    }
  }

  handleLike = rental => {
    const rentals = [...this.state.rentals]
    const index = rentals.indexOf(rental)
    rentals[index] = { ...rentals[index] }
    rentals[index].liked = !rentals[index].liked
    this.setState({ rentals })
  }

  handlePageChange = page => {
    this.setState({ currentPage: page })
  }

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 })
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 })
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn })
  }

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      rentals: allRentals
    } = this.state

    let filtered = allRentals
    if (searchQuery)
      filtered = allRentals.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    else if (selectedGenre && selectedGenre._id)
      filtered = allRentals.filter(m => m.movie.genre._id === selectedGenre._id)

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

    const rentals = paginate(sorted, currentPage, pageSize)

    return { totalCount: filtered.length, data: rentals }
  }

  render() {
    const { length: count } = this.state.rentals
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state
    const { user } = this.props

    const { totalCount, data: rentals } = this.getPagedData()

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p>You've rented {totalCount} movie.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <RentalsTable
            rentals={rentals}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    )
  }
}

export default Rentals
