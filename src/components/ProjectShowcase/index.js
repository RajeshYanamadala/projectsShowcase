import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusContext = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_process: 'IN_PROCESS',
}

class ProjectShowcase extends Component {
  state = {
    category: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusContext.initial,
    retry: false,
    loading: true,
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.renderCategoryListItems()
    // }, 1500)
    // this.setState({apiStatus: apiStatusContext.in_process})
    this.renderCategoryListItems()
  }

  onChangeSelectOption = event => {
    const selectValue = event.target.value
    // setTimeout(() => {
    //   this.setState({category: selectValue}, this.renderCategoryListItems)
    // }, 1500)
    // this.setState({apiStatus: apiStatusContext.in_process})
    this.setState({category: selectValue}, this.renderCategoryListItems)
  }

  renderCategoryListItems = async () => {
    const {category} = this.state
    console.log(category)
    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    this.setState({apiStatus: apiStatusContext.in_process})
    const response = await fetch(projectsApiUrl, options)
    if (response.status === 200) {
      const data = await response.json()
      //   console.log(response)
      const projectsData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList: projectsData,
        apiStatus: apiStatusContext.success,
        loading: false,
      })
    } else {
      this.setState({apiStatus: apiStatusContext.failure, loading: false})
    }
  }

  renderCategoriesSuccessView = () => {
    const {projectsList} = this.state

    return projectsList.map(eachData => (
      <li key={eachData.id} className="list-card">
        <img src={eachData.imageUrl} alt={eachData.name} className="image" />
        <p className="paragraph">{eachData.name}</p>
      </li>
    ))
  }

  onClickRetryBtn = () => {
    this.renderCategoryListItems()
  }

  renderCategoryFailureView = () => {
    const {retry, loading} = this.state

    return (
      <>
        {!loading && (
          <div className="failure-card">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
              alt="failure view"
              className="failure-image"
            />
            <h1 className="heading">Oops! Something Went Wrong</h1>
            <p className="paragraph">
              We cannot seem to find the page you are looking for
            </p>
            <div>
              <button
                type="button"
                className="button"
                onClick={this.onClickRetryBtn}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  renderCategoryProcessView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" height={40} wi={40} color=" #328af2" />
    </div>
  )

  renderDisplayCategories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusContext.success:
        return this.renderCategoriesSuccessView()
      case apiStatusContext.failure:
        return this.renderCategoryFailureView()
      case apiStatusContext.in_process:
        return this.renderCategoryProcessView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <>
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="app-container">
          <select
            className="select"
            onChange={this.onChangeSelectOption}
            value={category}
          >
            {categoriesList.map(eachText => (
              <option key={eachText.id} value={eachText.id}>
                {eachText.displayText}
              </option>
            ))}
          </select>
          <div className="content-card">
            <ul className="un-order-list">{this.renderDisplayCategories()}</ul>
          </div>
        </div>
      </>
    )
  }
}

export default ProjectShowcase
