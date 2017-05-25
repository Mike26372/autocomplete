import React, {Component} from 'react';
import './Search.css';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      autocomplete: [],
      cursor: -1
    }

    this.focus = this.focus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.searchYouTube = this.searchYouTube.bind(this);
  }

  focus() {
    this.formInput.focus();
  }

  handleChange(e) {
    let query = e.target.value;
    console.log('Handle change target value: ', query);
    this.setState({ search: query });
    if (query !== '') {
      this.searchYouTube(query);
    } else {
      this.setState({ autocomplete: [] })
    }
  }

  handleSubmit(e) {
    let { keyCode } = e;
    let { search, cursor } = this.state;
    e.preventDefault();
    if (search !== '' && cursor < 0) {
      this.searchYouTube(search);
    }
  }

  handleKeyDown(e) {
    let { keyCode } = e
    let { cursor, autocomplete } = this.state;
    console.log(keyCode);
    if ( keyCode === 40 ) {
      // move cursor down
      this.setState(prevState => {
        let { cursor, autocomplete } = prevState
        let newCursor = cursor + 1 < autocomplete.length - 1 ? cursor + 1 : autocomplete.length - 1;
        return { cursor: newCursor }
      });
    } else if ( keyCode === 38 ) {
      // move cursor up
      e.preventDefault();
      this.setState(prevState => {
        let { cursor } = prevState
        let newCursor = cursor - 1 >= 0 ? cursor - 1 : -1;
        return {cursor: newCursor};
      });
    } else if ( keyCode === 13 && cursor >= 0 ) {
      let newSearch = autocomplete[cursor];
      this.formInput.value = newSearch;
      this.setState({ cursor: -1 });
      this.handleChange({ target: { value: newSearch } });
    }
  }

  searchYouTube(query) {
    let context = this;
    let {max, key} = this.createOptions();
    console.log(`Search query: ${query}`);
    console.log(`State: ${this.state.search}`);
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${max}&q=${query}&key=${key}&type=video&videoembeddable=true`;
    let init = {headers: {'Content-Type': 'application/json'}, mode: 'cors'}

    let request = new Request(url, init);

    fetch(request)
      .then(response => response.json())
      .then(data => {
        let {items} = data;
        let results = items.reduce((a, c) => a.concat(c.snippet.title),[]);
        console.log(results);
        context.setState({ autocomplete: results })
      })
      .catch(error => { console.error('Fetch error!') })
  }

  createOptions() {
      return {
        max: 5,
        key: process.env.REACT_APP_YOUTUBE_API_KEY
      };
  }

  render() {

    const { autocomplete, cursor } = this.state;

    const activeClass = `Search-list-item Search-active`;
    const inactiveClass = `Search-list-item`;

    return (
      <div>
        <form className="Search-form-inline" 
              onSubmit={this.handleSubmit} 
              autoComplete="off"
              ref={ (input) => this.form = input }>
          <div className="form-group Search-form-group ">
            <input type="text"
                   className="form-control Search-input" 
                   list="titles" 
                   id="exampleInputName2" 
                   placeholder="Enter search..."
                   onChange={this.handleChange} 
                   onKeyDown={this.handleKeyDown}
                   ref={ input => this.formInput = input }
                   />
            <ul className="Search-ul">
              {autocomplete.map((title, i) => <li className={i === cursor ? activeClass : inactiveClass}>{title}</li>)}
            </ul>
          </div>
        </form>
      </div>
    );
  }
}

// <div>
// {autocomplete.map(title => <div>{title}</div>)}
// </div>
// <button type="submit" className="btn btn-default">Search</button>


export default Search;