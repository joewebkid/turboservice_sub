import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Block from "../Block";
import useDebounce from "./useDebounce";

function searchCharacters(search) {
  const apiKey = "f9dfb1e8d466d36c27850bedd2047687";
  const queryString = `apikey=${apiKey}&titleStartsWith=${search}`;
  return fetch(`https://gateway.marvel.com/v1/public/comics?${queryString}`, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((r) => r.data.results)
    .catch((error) => {
      console.error(error);
      return [];
    });
}

const FilterInput = (props) => {
  const { template } = props;
  const Input = template;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchCharacters(debouncedSearchTerm).then((results) => {
        setIsSearching(false);
        setResults(results);
      });
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  console.log(results);
  //   console.log(template);

  return (
    <Block className="filterControll">
      <Input
        placeholder="Search Marvel Comics"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isSearching && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="loadingSpin"
        />
      )}
    </Block>
  );
};
export default FilterInput;
