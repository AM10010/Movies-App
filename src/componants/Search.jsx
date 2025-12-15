const Search = ({searchTerm ,setSearchTerm})=>{
    return (
       <div className="search">
        <div >
            <img src="./search.svg" alt="" />
        <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search through 300+ movies online" />
        </div>
        </div>
    );
}
export default Search;