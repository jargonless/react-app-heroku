import http from '../services/httpService'
const apiEndpoint = "/rentals"

function rentalUrl(id) {
  return `${apiEndpoint}/${id}`
}

export function rentMovie(reqBody) {
  return http.post(apiEndpoint, reqBody)
}

export function getRentals(userId) {
  return http.get(`${apiEndpoint}/u/${userId}`)
}

export function deleteRental(rentalId) {
  return http.delete(rentalUrl(rentalId))
}

