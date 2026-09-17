import React from 'react'

const SearchBar = ({ handleChange }) => {
    return (
        <div className="search">
            <div className="searchBar">
                <img src="./img/icons8-search-64.png" alt="" />
                <img src="./img/icons8-back-96.png" alt="" />
                <input type="text" name="search_user" id="search_user" placeholder="Search" onChange={handleChange} />
            </div>

        </div>
    )
}

export default SearchBar