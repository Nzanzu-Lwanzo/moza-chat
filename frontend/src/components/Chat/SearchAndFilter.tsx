import { MagnifyingGlass } from "@phosphor-icons/react";

const SearchAndFilter = () => {
  return (
    <>
      <div className="top__bar">
        <div className="filter__box">
          <div className="icon">
            <MagnifyingGlass />
          </div>
          <input
            type="search"
            name="search"
            placeholder="Cherchez ou filtrez"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="filter__tags">
        <button type="button" className="filter__tag">
          Administrateur
        </button>
        <button type="button" className="filter__tag">
          Participant
        </button>
        <button type="button" className="filter__tag">
          Non lus
        </button>
      </div>
    </>
  );
}

export default SearchAndFilter