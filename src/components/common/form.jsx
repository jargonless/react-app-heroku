import React, { Component } from "react"
import Joi from "joi-browser"
import Input from "./input"
import Select from "./select"

class Form extends Component {
  state = {
    data: {},
    errors: {}
  }

  validate = () => {
    const options = { abortEarly: false }
    const { error } = Joi.validate(this.state.data, this.schema, options)
    if (!error) return null

    const errors = {}
    for (let item of error.details) errors[item.path[0]] = item.message
    return errors
  }

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value }
    const schema = { [name]: this.schema[name] }
    const { error } = Joi.validate(obj, schema)
    return error ? error.details[0].message : null
  }

  handleSubmit = e => {
    e.preventDefault()

    // const errors = this.validate()
    // this.setState({ errors: errors || {} })
    // if (errors) return

    this.doSubmit()
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors }
    const errorMessage = this.validateProperty(input)
    if (errorMessage) errors[input.name] = errorMessage
    else delete errors[input.name]

    const data = { ...this.state.data }
    data[input.name] = input.value

    this.setState({ data, errors })
  }

  renderInfo(data) {
    return (
      <div>
        <h1>title</h1>
        <h1>{data.title}</h1>
        <h2>Genre</h2>
        <h3>{data.genreName}</h3>
        <h2>Number in Stock</h2>
        <h3>{data.numberInStock}</h3>
        <h2>Rental Period</h2>
        <h3>This count starts from the date of rental. The movie will be automatically returned to database after 48 hours</h3>
      </div>
    )
  }
  renderButton(label) {
    return (
      <button className="btn btn-primary">
        {label}
      </button>
    )
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    )
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    )
  }
}

export default Form
