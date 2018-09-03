import React, { Component } from 'react';
import {
  // InstantSearch,
  Hits,
  // SearchBox,
  Highlight,
  RefinementList,
  // Pagination,
  // CurrentRefinements,
  // ClearRefinements,
  connectSearchBox,
  connectHits,
  // connectCurrentRefinements,
  connectRefinementList
} from 'react-instantsearch-dom';
// import Grid from '@material-ui/core/Grid';
// import Hidden from '@material-ui/core/Hidden';
import { Input } from 'reactstrap';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Truncate from 'react-truncate';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import { Badge } from 'reactstrap';
import './algolia.css';

const MySearchBox = ({currentRefinement, refine}) =>
<form>
  <Input style={{width:'100%', height:'36px', flexGrow: 1}} type="text" name="search" id="runbookSearch" placeholder="Runbook Search" value={currentRefinement} onChange={e => refine(e.target.value)}/>
</form>

const CustomSearch = connectSearchBox(MySearchBox);

function findAndReplace(string, target, replacement) {
 var i = 0, length = string.length;
 for (i; i < length; i++) {
  string = string.replace(target, replacement);
 }
 return string;
}

export const AlgoliaSearch = () =>
  <CustomSearch/>


function Post({ hit }) {
  return (
    <Grid item xs={12} key={hit.title+Math.random()+(Math.random())} style={{ marginBottom:15, maxWidth:'100%', marginLeft:10, marginRight:10}}>
      <Link to={{ pathname: '/post/' + hit.id + '/'+findAndReplace(findAndReplace(hit.title,' ','-'),'\'','')}}>
        <Button variant="contained" style={{ height:150,background:'#283593',borderColor:'#474f97', textTransform: 'none',  minWidth:'100%'}}>
            <Grid container style={{flexGrow:1, marginLeft:10}}>
                <Grid item xs={9} style={{textAlign:'left'}}>
                    <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                        <Grid item zeroMinWidth>
                            <Typography variant="title" style={{color:'white', minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                              <Hidden mdDown>
                              <Truncate width={580} lines={1} ellipsis={<span>...</span>}>
                                 <Highlight attribute="title" hit={hit} />
                             </Truncate>
                           </Hidden>
                            </Typography>

                            <Typography variant="subheading" style={{color:'#939ed5', marginTop:10, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                              <Hidden mdDown>
                              <Truncate width={580} lines={1} ellipsis={<span>...</span>}>
                                 {hit.description}
                             </Truncate>
                             </Hidden>
                           </Typography>

                          <Typography variant="body2" style={{color:'white', minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                           <Hidden smUp>
                           <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                              {hit.title}
                          </Truncate>
                        </Hidden>
                         </Typography>
                         <Typography variant="caption" style={{color:'#939ed5', marginTop:10, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                           <Hidden smUp>
                           <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                              {hit.description}
                          </Truncate>
                        </Hidden>

                            </Typography>
                        </Grid>
                        <Grid item style={{marginTop:10 ,marginRight:5, overflow:"hidden"}}>
                          <Grid container style={{ flexGrow:1, height:"100%", width:"100%", }}  alignItems={"center"} direction={"row"} justify={"space-between"}>
                            {hit.tags.map((value) => {
                              return(
                                <Grid key={value+Math.random()+(Math.random())} item >
                                <h5><Badge color="primary" style={{textTransform: 'none', marginRight:5,}}>{value}</Badge></h5>
                              </Grid>)
                            }
                            )}
                          </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Hidden smDown>
                <Grid item style={{ textAlign:'left',borderLeft: '2px solid rgba(0, 0, 0, 0.12)'}}>
                    <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                        <Grid item>
                            <Typography variant="subheading" style={{color:'#939ed5', marginLeft:20, marginTop:10}}>
                                {hit.objectives.length} Objectives
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
              </Hidden>
            </Grid>
        </Button>
      </Link>
    </Grid>
  );
}

const CustomHits = connectHits(({ hits }) => (
  <Hits style={{width:'100%'}} hitComponent={Post} />
))

const MaterialUiCheckBoxRefinementList = ({
  items,
  attribute,
  refine,
  createURL,
}) => (
  <List>
    {items.map((item,index) => (
      <ListItem
        key={item.label+index}
        dense
        button
        onClick={e => {
            e.preventDefault();
            refine(item.value);
          }}
      >
    <Typography style={{color:'white'}}>{item.label}</Typography>
      </ListItem>
    ))}
  </List>
);

export const AlgoliaConnectedCheckBoxRefinementList = connectRefinementList(
  MaterialUiCheckBoxRefinementList
);

export const AlgoliaHits = () =>
<CustomHits style={{width:'100%'}} />

export const AlgoliaRefinementList = () =>
  <RefinementList attribute="title" />

class Config extends Component {

}


export default Config;
