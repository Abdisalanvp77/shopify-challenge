import React, { Component } from 'react'
import axios from 'axios';
import Banner from 'react-js-banner';
import "./App.css";
/**API key for accessing omdbapi */
const API_KEY  = "5380268b";

export class App extends Component {
 

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      movies: [],
      isLoading: false,
      searched: false,
      nominations: [],
      banner3Css: { color: "#FFF", backgroundColor: "red", fontSize: 20 }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNomination = this.handleNomination.bind(this);
    this.handleRemoveNomination = this.handleRemoveNomination.bind(this);
  }

  /**
   * life cycle method to access local storage if there were nominated movies.
   */
  componentDidMount() {
    const noms= localStorage.getItem('nominations');
    if (noms) {
      this.setState({
        nominations: JSON.parse(noms)
      });
    } else {
      this.setState({
        nominations: []
      });
    }
    
  }
  /**
   * function to handle nomination of a movie from list of searched movies.
   * Saves data to local storage upon nomination
   * @param {*} movie 
   */
  handleNomination(movie) {
    this.setState({
      nominations: [...this.state.nominations, movie]
    }, () => {
      window.localStorage.setItem('nominations', JSON.stringify(this.state.nominations));
    });
  }
  /**
   * function to handle removal of a nominated movie from list.
   * Saves changed data to local storage upon removal
   * @param {*} movie 
   */
  handleRemoveNomination(movie) {
    this.setState({nominations: this.state.nominations.filter(function(mov) { 
      return mov !== movie;
    })}, () => {
      window.localStorage.setItem('nominations', JSON.stringify(this.state.nominations));
    });
  }

  /**
   * function to handle user input change
   * @param {*} event 
   */
  handleChange(event) {
    this.setState(
      Object.assign({}, this.state, {value: event.target.value})
    );
  }

  /**
   * function to handle input search. makes an api call to omdbapi.
   * @param {*} event 
   */
  handleSubmit(event) {
    event.preventDefault();
    this.setState(
      Object.assign({}, this.state, {isLoading: true, movies: [], searched: true})
    );

    axios
        .get(
          `http://www.omdbapi.com/?s=${this.state.value}&page=${2}&type=movie&apikey=${API_KEY}`)
        .then(res => {
          
          return res.data;
        })
        .then(res => {
          if (!res.Search) {
            this.setState({ movies: [] });
            return;
          }
        
          this.setState({
            movies: [...this.state.movies, res.Search]
          });
        })
        .catch(e => console.error(e)
        );
        
  }

  /**
   * function to render jsx
   * 
   */
  render() {
    return (
      <div className="main">
        <div className="titles">
          <div className="container">
            <h1 className="title">Movie finder</h1>
            <h2 className="subtitle">Find your next favourite movie :)</h2>
          </div>
        </div>
        <div className="container">
          <div className="searchbox">
            <input
              className="input"
              type="text"
              placeholder="Search movies"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <button
              className="button is-info"
              onClick={this.handleSubmit}
            >
              <i class="fa fa-search"></i>
            </button>
            
          </div>
          <div className="content">
            <div className="search-results">
            {this.state.movies.length > 0 ? (
              <h3 className="title">Search result for "{this.state.value}"</h3>) : ""
            }
              <ul>
                {this.state.movies.length > 0 ? (
                    this.state.movies[0].map(movie => 
              
                      <div className="field has-addons">
                        
                        <div className="control">
                          <li key={movie}>{movie.Title}({movie.Year})<br/></li>
                        </div>
                        <div className="control">
                          <button
                            className="button is-info"
                            onClick={() => this.handleNomination(movie)}
                            disabled={this.state.nominations.includes(movie)}
                          >
                            Nominate
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="p">
                      Couldn't find any movie. Please search again using
                      another search criteria.
                    </p>
                  )
                }
              </ul>
            </div>
            <div className="nominations">
              <h3 className="title">Your Nominations</h3>
              {
                  this.state.nominations.length >= 5 ? (
                    <Banner 
                      title="You reached 5 nominations." 
                      css={this.state.banner3Css} 
                      visibleTime={3000}
                    />
                  ) : null
                }
              <ul>
                {this.state.nominations.length > 0 ? (
                    this.state.nominations.map(movie => 
              
                      <div className="field has-addons">
                        <div className="control">
                          <li key={movie}>{movie.Title}({movie.Year})<br/></li>
                        </div>
                        <div className="control">
                          <button
                            className="button is-info"
                            onClick={() => this.handleRemoveNomination(movie)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <p>
                      Please nominate a movie to see a list of your nominations.
                    </p>
                  )
                }
              </ul>                
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App

