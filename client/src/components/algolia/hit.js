import React, { Component } from 'react';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  RefinementList,
  Pagination,
  CurrentRefinements,
  ClearRefinements,
  connectSearchBox,
  connectHits,
} from 'react-instantsearch-dom';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

function Product({ hit }) {
  return (
    <div style={{ marginTop: '10px' }}>
      <span className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </span>
    </div>
  );
}

export const CustomHits = connectHits(({ hits }) => (
  <Hits hitComponent={Product} />
))

class Hit extends Component {
  render(){
    return (
        <CustomHits/>
    )
  }
}


export default Hit;
