import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Card, Collapse, CardText, CardBody,
  CardTitle, CardSubtitle, Button, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';

const google_maps = "https://www.google.ca/maps/place/";
export default class ShelterList extends React.Component {
  state = {
    filterToggled: false,
    femaleOnly: false,
    youthOnly: false,
    
    shelters: [],
    filteredShelters: []
  }

  componentDidMount(){
    self = this;
    axios.post("/shelters")
    .then((res) => {
      var result = [];
      console.log(res.data);
      var shelterobj = res.data;
      for(var key in shelterobj){
        result.push(shelterobj[key]);
      }
      self.setState({shelters: result});
      self.setState({filteredShelters: result});
      console.log(result);
    });
  }


  getDirections(shelter) {
    var url = google_maps + shelter.address.split(' ').join('+');
    window.open(url, '_blank');
  }

  fitsSearch(shelter) {
    var fitsName = shelter.name.toLowerCase().startsWith(this.search.value.toLowerCase());
    var fitsAddress = shelter.address.toLowerCase().startsWith(this.search.value.toLowerCase());
    var fitsCategory = shelter.category.toLowerCase().startsWith(this.search.value.toLowerCase());

    return fitsName || fitsAddress || fitsCategory;
  }

  filterShelters = () => {
    this.setState({ filteredShelters: this.state.shelters.filter(shelter => this.fitsSearch(shelter))});
  }

  toggleFilters = () => {
    var newState = !this.state.filterToggled;
    this.setState({filterToggled: newState});
  }

  changeFilters = (filter) => {
    var femaleOnly = this.state.femaleOnly;
    var youthOnly = this.state.youthOnly;

    switch(filter){
      case "Female":
        femaleOnly = !femaleOnly;
        break;

      case "Youth":
        youthOnly = !youthOnly
        break;

      default:
        break;
    }

    this.applyFilters(femaleOnly, youthOnly);
  }

  applyFilters = (femaleOnly, youthOnly) => {
    if(femaleOnly && youthOnly){
      this.setState({ femaleOnly: femaleOnly,
                      youthOnly: youthOnly,
                      filteredShelters: this.state.shelters.filter(shelter => this.fitsSearch(shelter) && !shelter.isMale && shelter.isYouth)
                    });
    }
    else if(femaleOnly){
      this.setState({ femaleOnly: femaleOnly,
                      youthOnly: youthOnly,
                      filteredShelters: this.state.shelters.filter(shelter => this.fitsSearch(shelter) && !shelter.isMale)});
    }
    else if(youthOnly){
      this.setState({ femaleOnly: femaleOnly,
                      youthOnly: youthOnly,
                      filteredShelters: this.state.shelters.filter(shelter => this.fitsSearch(shelter) && shelter.isYouth)});
    }
    else{
      this.setState({ femaleOnly: femaleOnly,
                      youthOnly: youthOnly,
                      filteredShelters: this.state.shelters.filter(shelter => this.fitsSearch(shelter))})
    }
  }

  render() {
    return(
      <div>
        <div className="Navbar">
          <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
            <a className="navbar-brand" href="#">INSERT LOGO HERE</a>

            <form className="form-inline my-2 my-lg-0">
              <input className="form-control"
                     type="text"
                     placeholder="Search Shelters"
                     aria-label="Search"
                     defaultValue=""
                     ref={input => this.search = input}
                     onKeyUp={this.filterShelters}>
              </input>
            </form>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="navbar-nav ml-auto">
                <button type="button" className="btn btn-secondary">Login</button>
              </div>
            </div>
          </nav>
        </div>
        <div>
            <Card>
              <CardBody>
                <a onClick={this.toggleFilters} style={{ marginBottom: '1rem', cursor: 'pointer' }}>Filters +</a>
                <Collapse isOpen={this.state.filterToggled}>
                  <FormGroup check>
                    <Input type="checkbox" name="check" id="exampleCheck" onChange={() => this.changeFilters("Female")} />
                    <Label for="exampleCheck" check>Female Only</Label>
                    <br/>
                    <Input type="checkbox" name="check" id="exampleCheck" onChange={() => this.changeFilters("Youth")} />
                    <Label for="exampleCheck" check>Youth Only</Label>
                  </FormGroup>
                </Collapse>
              </CardBody>
            </Card>
        </div>
      {this.state.filteredShelters.map(shelter => (
        <Card>
          <CardBody>
            <CardTitle>{shelter.name}</CardTitle>
            <CardSubtitle>{shelter.address}</CardSubtitle>
            <CardText>Beds Available: {shelter.beds_available}</CardText>
            <Button color="primary" onClick={() => this.getDirections(shelter)}>Get Directions</Button>
          </CardBody>
        </Card>
      ))
      }
    </div>
    );
  }
}
