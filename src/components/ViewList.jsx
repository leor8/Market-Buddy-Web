import React, {Component} from 'react';
import { withRouter } from 'react-router';
import {post, get} from 'axios';
import SearchBar from './SearchBar.jsx';
import ListItem from './ListItem.jsx';
import NavBar from './NavBar.jsx';
import Stores from './Stores.jsx';
import Footer from './Footer.jsx';
import {
  Link
} from 'react-router-dom';

import {Tab, Tabs} from 'react-materialize';

function searchItem(anArr, target){
  for(var i = 0; i < anArr.length; i++){
    if(anArr[i].name === target){
      return anArr[i];
    }
  }
  return -1;
}

function searchItemId(anArr, target){
  for(var i = 0; i < anArr.length; i++){
    if(anArr[i].id == target){
      return anArr[i];
    }
  }
  return -1;
}

function existInList(anArr, target){
  for(var i = 0; i < anArr.length; i++){
    if(anArr[i].name === target){
      return true;
    }
  }
  return false;
}

function trimListId(pathName){
  var stopper = "lists/"
  return pathName.slice(pathName.indexOf(stopper) + stopper.length);
}

class ViewList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      searchProduct: [],
      listProduct: [],
      stores: []
    }

    this.addSearchList = this.addSearchList.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.minusQuantity = this.minusQuantity.bind(this);
    this.submitList = this.submitList.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

    componentWillMount() {
      // const listId = this.props.location.pathname.substring(16);
      var pathName = this.props.location.pathname;

      var listId = trimListId(pathName);

      if(!isNaN(Number(listId))){
        // var currList = searchItemId(JSON.parse(localStorage.list), listId);
        // this.setState({ listProduct: currList.product});
        // console.log(this.state.listProduct);
        get("http://192.168.88.120:7000/lists/"+listId)
        .then(response => response.data)
        .then(products => {
          this.setState( { listProduct: products.products} );
        });
      }

      get("http://192.168.88.120:7000/stores")
      .then(response => response.data)
      .then(stores => {
        this.setState( { stores: stores} );
      });
    }

    addSearchList(products){
      if(Array.isArray(products)){
        this.setState( { searchProduct: products } );
      } else {
        this.setState( { searchProduct: "No items found" } );
      }
    }
    addProduct(product){
      // if(!this.state.listProduct.some(item => item.product === product)){
      //   this.setState({
      //     listProduct: this.state.listProduct.concat({product: product, quantity: 1})
      //   });
      // }
      product["quantity"] = 1;

      var newProduct = this.state.listProduct.concat(product);
      this.setState( { listProduct: newProduct } );
    }

    addQuantity(product){
      this.setState((oldState) => {
        return {
          ...oldState,
          listProduct: oldState.listProduct.map((item) => {
            if(item === product){
              return {...item, quantity: item.quantity + 1}
            }
            return item;
          })
        }
      })
    }
    minusQuantity(product){
      this.setState((oldState) => {
        return {
          ...oldState,
          listProduct: oldState.listProduct.map((item) => {
            if(item === product && item.quantity > 0){
              return {...item, quantity: item.quantity - 1}
            }
            return item;
          })
        }
      });

    }
    deleteItem(product){
      this.setState((oldState) => {
        return {
          ...oldState,
          listProduct: oldState.listProduct.map((item) => {
            if(item === product){
              return {...item, quantity: 0}
            }
            return item;
          })
        }
      })
    }

    submitList(e){
        e.preventDefault();

        var data = {};

        var pathName = this.props.location.pathname;
        var listId = trimListId(pathName);
        if(!isNaN(Number(listId))){
          var currList = searchItemId(JSON.parse(localStorage.list), listId);
          currList.product = this.state.listProduct;
          this.setState({ listProduct: currList.product});
            data = {
              list_id: listId,
              list: this.state.listProduct,
              name: JSON.parse(localStorage.listObj).name,
              user: JSON.parse(localStorage.user).id
            }
        } else {
          data = {
            list: this.state.listProduct,
            name: JSON.parse(localStorage.listObj).name,
            user: JSON.parse(localStorage.user).id
          }
        }

        post('http://192.168.88.120:7000/lists/new', data)
            .then(response => response.data)
            .then(b => {
              var newList = JSON.parse(localStorage.list);
              var pathName = this.props.location.pathname;
              var listId = trimListId(pathName);

              var currList = {};
               if(!isNaN(Number(listId))){
                currList = searchItemId(newList, listId);
                currList.product = this.state.listProduct;
              } else {
                currList.product = this.state.listProduct;
              }

              var updatedLists = {
                id: b.id,
                name: data.name,
                product: currList.product,
                user_id: data.user
              }

              newList = newList.concat(updatedLists);



              localStorage.setItem('list', JSON.stringify(newList));

              window.location.href = "/users/"+ JSON.parse(localStorage.user).id;

            });
    }

  render() {

    // Setting the local storage if list is an existing list other
    var pathName = this.props.location.pathname;
    var listId = trimListId(pathName);
    var listItem ={} ;
    if(!isNaN(Number(listId))){
      listItem = searchItemId(JSON.parse(localStorage.list), listId);
      localStorage.setItem("listObj", JSON.stringify(listItem))
    } else {
      listItem.name = JSON.parse(localStorage.listObj).name
    }

    return (

      <div>
        <NavBar />
          <main>
            <div className="row main-div">
              <div className="col s6 m6 l6" id="left">
              <Link className="btn-floating btn-large waves-effect back-btn" to={"/users/"+ JSON.parse(localStorage.user).id}><i className="material-icons">arrow_back</i></Link>
                <h3>{JSON.parse(localStorage.listObj).name }</h3>
                <SearchBar addProduct={this.addProduct} addSearchList={this.addSearchList}/>
                <ListItem listProduct={this.state.listProduct}
                  addQuantity={this.addQuantity}
                  minusQuantity={this.minusQuantity}
                  deleteItem={this.deleteItem}
                  submitList={this.submitList}
                  />
              </div>
              <div className="col s6 m6 l6" id="right-blue">
              <h3>Nearby Stores</h3>
              </div>
             <div className="col s12 m6 l6">
              <h3>Stores</h3>
              <Stores stores={this.state.stores} products={this.state.listProduct} listId={listId} />
          </div>
          </div>

      </main>
      <Footer/>
    </div>
    );
  }
}
export default withRouter(ViewList);