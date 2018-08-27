import React, { Component } from 'react';
import {
  InstantSearch,
  Hits,
  // SearchBox,
  Highlight,
  RefinementList,
  // Pagination,
  // CurrentRefinements,
  // ClearRefinements,
  connectSearchBox,
  connectHits,
} from 'react-instantsearch-dom';
// import Grid from '@material-ui/core/Grid';
// import Hidden from '@material-ui/core/Hidden';
import { Input } from 'reactstrap';

const MySearchBox = ({currentRefinement, refine}) =>
<form>
  <Input style={{width:'100%', height:'36px', flexGrow: 1}} type="text" name="search" id="runbookSearch" placeholder="Runbook Search" value={currentRefinement} onChange={e => refine(e.target.value)}/>
</form>

const CustomSearch = connectSearchBox(MySearchBox);

export const AlgoliaSearch = () =>
  <CustomSearch/>

  function Product({ hit }) {
    return (
      <div style={{ marginTop: '10px' }}>
        <span className="hit-name">
          <Highlight attribute="name" hit={hit} />
        </span>
      </div>
    );
  }

  const CustomHits = connectHits(({ hits }) => (
    <Hits hitComponent={Product} />
  ))

export const AlgoliaHits = () =>
<CustomHits/>


export const AlgoliaRefinementList = () =>
  <RefinementList attribute="category" />

class Config extends Component {
  render(){
    return (
      <InstantSearch
        appId="latency"
        apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
        indexName="bestbuy"
      >
        <CustomHits />
      </InstantSearch>
    )
  }
}


export default Config;
