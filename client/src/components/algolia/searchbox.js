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

export const MySearchBox = ({currentRefinement, refine}) =>
  <input
    type="text"
    value={currentRefinement}
    onChange={e => refine(e.target.value)}
  />

export const CustomSearch = connectSearchBox(MySearchBox);

class Searchbox extends Component {

}

export default Searchbox;
