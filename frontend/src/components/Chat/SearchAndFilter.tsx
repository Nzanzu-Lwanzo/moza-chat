import { MagnifyingGlass } from "@phosphor-icons/react";
import useSearchAndFilterStore from "../../stores/SearchAndFilterStore";
import useSearchAndFilter from "../../hooks/useSearchAndFilter";
import Loader from "../CrossApp/Loader";
import { COLOR_SCHEMA } from "../../utils/constants";

const SearchAndFilter = () => {
  const { filterSection, switchFilterSection } = useSearchAndFilterStore();
  const { search, filter, pending } = useSearchAndFilter();

  return (
    <>
      <div className="top__bar">
        <div className="filter__box">
          <div className="icon">
            {pending ? (
              <Loader
                height={15}
                width={15}
                ringColor={COLOR_SCHEMA.whity}
                trackColor={COLOR_SCHEMA.accent}
              />
            ) : (
              <MagnifyingGlass />
            )}
          </div>
          <input
            type="search"
            name="search"
            placeholder="Cherchez ou filtrez"
            autoComplete="off"
            onChange={search}
          />
        </div>
      </div>
      <div className="filter__tags">
        <button
          type="button"
          className={`filter__tag ${filterSection === "ALL" ? "active" : null}`}
          onClick={() => {
            switchFilterSection("ALL");
            filter("ALL");
          }}
        >
          Toutes
        </button>
        <button
          type="button"
          className={`filter__tag ${
            filterSection === "PRIVATE" ? "active" : null
          }`}
          onClick={() => {
            switchFilterSection("PRIVATE");
            filter("PRIVATE");
          }}
        >
          Privées
        </button>
        <button
          type="button"
          className={`filter__tag ${
            filterSection === "PARTICIPANT" ? "active" : null
          }`}
          onClick={() => {
            switchFilterSection("PARTICIPANT");
            filter("PARTICIPANT");
          }}
        >
          Participant
        </button>
        <button
          type="button"
          className={`filter__tag ${
            filterSection === "MY_ROOMS" ? "active" : null
          }`}
          onClick={() => {
            switchFilterSection("MY_ROOMS");
            filter("MY_ROOMS");
          }}
        >
          Mes rooms
        </button>
      </div>
    </>
  );
};

export default SearchAndFilter;
