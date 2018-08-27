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
  connectSearchBox
} from 'react-instantsearch-dom';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export const AlgoliaConfig = (widget) => (
  <InstantSearch
    appId="latency"
    apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
    indexName="bestbuy"
  >
  {widget}
  </InstantSearch>
)

const AlgoliaCurrentRefinements = () => <CurrentRefinements/>
const AlgoliaClearRefinements = () => <ClearRefinements/>
const AlgoliaPagination = () => <Pagination/>

export const MySearchBox = ({currentRefinement, refine}) =>
  <input
    type="text"
    value={currentRefinement}
    onChange={e => console.log(refine(e.target.value))}
  />

const ConnectedSearchBox = connectSearchBox(MySearchBox);

const Product = ({hit}) => {
  return (
   <div style={{ marginTop: '10px' }}>
     <span className="hit-name">
       <Highlight attribute="name" hit={hit} />
     </span>
   </div>
 );
}

export const RenderFilter = () => {

    return(
      <InstantSearch

      >
      <div className="container">
        <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
        <Hidden smDown>
        <Grid item style={{ width:220,height:800, borderColor:'#474f97', textTransform: 'none', marginRight:20 }}>
            <Grid container style={{flexGrow:1, margin:"0 auto"}} >
              <CurrentRefinements />
              <ClearRefinements />
              <RefinementList attribute="category" />
            </Grid>
        </Grid>
        </Hidden>
          </Grid>
      </div>
    </InstantSearch>
    )
}

const RenderOptions = () => {
  return (
    <Grid item xs style={{height:800, borderColor:'#474f97', textTransform: 'none'}}>
        <Grid container style={{flexGrow:1, margin:"0 auto"}} >
            <Hits hitComponent={Product} />
        </Grid>
        <Pagination />
    </Grid>
  )
}



class algolia extends Component {
}

export default algolia;
