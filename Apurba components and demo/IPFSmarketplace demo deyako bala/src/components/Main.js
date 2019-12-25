import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value //.value is used because name is a form field.. ie form filed ko value we are using 
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          const memeHash = this.props.memeHash
          if(this.props.memeHash !== ''){
            this.props.createProduct(name, price, memeHash) //we are calling the function in App.js which calls the fucntion in the SC
          } else {
            window.alert('Please upload file to IPFS first')
          }
          
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }} //react manages the value of form elements using ref
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price in Ether"
              required />
          </div>
          <div className="form-group mr-sm-2 ">
            <input
              type="file"
              className="form-control "
              placeholder="Select product"
              onChange={this.props.captureFile}
              required />
            <input 
              type="button"
              className="form-control"
              value="Upload file to IPFS"
              placeholder="memeHash" 
              onClick={this.props.onSubmitt}
              />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product,key) => { 
                //looping through the product
                //console.log('product ko memeHash is',product.memeHash)
                return(
                  // we assign a key to each row elements..this is required by react so as to ensure react can identify the products with a key that is automatically given and incremented by .map method
                  <tr key={key}> 
                    <th scope="row">{ product.id.toString() }</th>
                    <td>{ product.name }</td>
                    <td>{ window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                    <td>{ product.owner }</td>
                    <td>
                    { !product.purchased && product.owner!==this.props.account
                        ? <button
                            name={product.id}
                            value={product.price}
                            onClick={(event) => {
                              this.props.purchaseProduct(event.target.name, event.target.value)
                            }}
                        >
                          Buy
                        </button>
                        :   null
                    }
                    </td>
                    <td>
                    { product.purchased && product.owner===this.props.account
                        ? <a 
                        href={"https://ipfs.infura.io/ipfs/" + product.memeHash}
                        className="btn btn-primary " 
                        role="button" 
                        aria-pressed="true"
                        target="_blank"
                        >
                            Download File
                        </a>
                        : null
                    }
                    </td>
                </tr>
                )
            })}
           
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
