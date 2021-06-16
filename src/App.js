import React from "react";
import { useQuery } from "react-query";

import axios from "axios";

export default function App() {
  const [show, toggle] = React.useReducer((d) => !d, true);
  return (
    <div>
      <button onClick={() => toggle()}>{show ? "Hide" : "Show"}</button>
      {/* <Count /> */}

      {show ? (
        <div>
          <Pokemon queryKey="pokemons" />{" "}
          {/*  if we are using the same key for the same data, react query is  only going to use that data only once and also it is going to request that data only once, it means we can use the same query key across our application and we dont have to worry about having multiple versions of data hanging around or multiple requests going out to server */}
          <Pokemon queryKey="pokemons" />
        </div>
      ) : null}
    </div>
  );
}

// function usePokemon() {
//   return useQuery("pokemons", async () => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return axios.get("https://pokeapi.co/api/v2/pokemon").then((res) => res.data.results);
//   });
// }

// function Count() {
//   const queryInfo = usePokemon();
//   return <h3>You are looking at {queryInfo.data?.length} pokemon</h3>;
// }

function Pokemon({ queryKey }) {
  const queryInfo = useQuery(
    queryKey,
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // added set timeout 1s in order to see the loading indicators because the request is too fast
      return axios.get("https://pokeapi.co/api/v2/pokemon").then((res) => res.data.results);
    },
    {
      staleTime: 7000,
      cacheTime: Infinity, //? inactive state is when query is no longer used on the screen, default time data is saved in memory is 5 min, the query data that we fetched is no longer in use(when the component is not active) and the data it previously fetched will still be available in memory(cache) in case we need to use it again, when we hit the show button the list is immediately restored thats because we have the data in memory so we are able to pull it out synchronously and show it immediately. Whenever this happens it also updates in the background so it makes sure we are getting the most up to date version of our data regardless we are having in our memory or not. In this instance we changed the cache time to Infinity so it will remain in memory even though we are not using it and it will be always available, cache time can be changed to any duration
    },
  );

  return queryInfo.isLoading ? (
    "Loading..."
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
      <br />

      {queryInfo.isFetching ? <h3>Updating(Sending Request)</h3> : null}
    </div>
  );
}
