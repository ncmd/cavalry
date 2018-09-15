import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessenger,
  addGroupDepartment,
  addGroupLocation,
  addGroups
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import {Link} from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Form, FormGroup, Input } from 'reactstrap';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";

class Request extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            width: window.innerWidth,
            height: window.innerHeight,
            selectedOption:'setupgroups',
            inputContactname:'',
            inputEmailaddress:'',
            inputInstantmessenger:'',
            inputDepartment:'',
            inputLocation:'',
            groups:[],
            groupItemCounter:0,
            groupIndex:0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleInputContactname = inputContactname => event => {
        this.setState({
            inputContactname: event.target.value,
        }, () => {
          this.props.addGroupContactname(this.state.inputContactname)
        });
    };


    render() {
        return (
            <div>
                <Header/>
                  <script type="text/javascript">

                </script>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,

                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{ height:300,background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'row'} spacing={40}>
                      <Grid item>
                        Input
                      </Grid>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      <Grid item>
                        Existing Requests
                      </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ groups }) {
    return { groups };
}
export default connect(mapStateToProps, {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessenger,
  addGroupDepartment,
  addGroupLocation,
  addGroups
})(withRouter(Request));
