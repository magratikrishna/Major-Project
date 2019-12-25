import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Meme from '../abis/Meme.json'
import Navbar from './Navbar'
import Main from './Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host : 'ipfs.infura.io', port:5001, protocol:'https'})

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({contract: contract})
      this.setState({ loading : false})
      const productCount = await contract.methods.productCount().call()
      console.log(productCount.toString())

      // const memeHash = await contract.methods.get().call() //call does not cost gas but send will cost gas
      // this.setState({memeHash})

      //Load product
      for (var i = 1; i <= productCount; i++) {
        const product = await contract.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
          //adding product to products array initialized in the constructor. the ...this.set.... bla bla is called the EcmaScript Spread operator
        })
      }
      console.log(this.state.products)
    }
    else {
      window.alert('Meme contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account : '',
      buffer: null,
      contract: null,
      memeHash: '',
      productCount: 0,
      products: [],
      loading: true
    };
    //function binding
    this.createProduct = this.createProduct.bind(this) //by doing this we let react know that createProduct function is same as the props createProduct  we are passing onto the component Main located in Main.js
    this.purchaseProduct = this.purchaseProduct.bind(this)
    //this.captureFile = this.captureFile.bind(this) //bind na garda ni caprture file works because capture file does not use this anywhere inside the function definition
    //this.onSubmitt = this.onSubmitt.bind(this) //we only use bind if our fucntion uses this inside it
  }

  async loadWeb3() { //this code is given to us by metamask
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum) //import web3 
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  captureFile = (event) => {
    event.preventDefault() 
    console.log('file caught')
    console.log('memeHash before', this.state.memeHash)
    const file = event.target.files[0] 
    const reader = new window.FileReader() //file reader lets web app read contents of the file asynchronously
    reader.readAsArrayBuffer(file)  //reads contents of file and when read operation is finished the loadend is triggered
    reader.onloadend = () => {  //onloadend is an event handler that represents the code to be called when the loadend event is raised
      this.setState({ buffer: Buffer(reader.result) })
      console.log(this.state.buffer)
    }
  }
  
  onSubmitt = (event) => {
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result)=> {
        //console.log('Ipfs reault', result)
        const memeHash = result[0].hash
        this.setState({memeHash : memeHash})
        console.log(this.state.memeHash)
        if(error) {
          console.log('before')
          console.error(error)
          return 
        }
        if(memeHash !== ''){
          window.alert('File uploaded to IPFS press Add Product')
        }
        else{
          window.alert('File uploaded to IPFS failed')
        }
      

        
    })
  }

  createProduct(name, price, memeHash) {
    this.setState({ loading:true}) //anytime we are creating a product loading should be true //loading gif halnu parcha final tira
    this.state.contract.methods.createProduct(name, price, memeHash).send({ from : this.state.account }) //method will expose fucntion of the SC
    //also here we are using send because we are sending ether
    .once('receipt',(receipt) => { //this receipt is given after a txn
      this.setState({ loading:false })
    })
    //ALWAYS BIND FUCNTIONS becuase we are using this.setState and tbis.state here. 
  }
  
  purchaseProduct(id, price) {
    this.setState({ loading:true}) //anytime we are creating a product loading should be true
    this.state.contract.methods.purchaseProduct(id).send({ from : this.state.account, value: price }) //method will expose fucntion of the SC
    //also here we are using send because we are sending ether
    //value is used kinki in our test we have passed from and value parameter while sending ether 
    .once('receipt',(receipt) => { //this receipt is given after a txn
      this.setState({ loading:false })
    })
    //ALWAYS BIND FUCNTIONS 
  }

  

  render() {
    return (
      <div>
        <Navbar 
          

          
        />
        { //unnecessary {}
          <div className="container-fluid mt-5">
            <div className="row">
              { //unnecessary {}
                <main role="main" className="col-lg-12 d-flex">
                  { this.state.loading
                      ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                      : <Main 
                      account={this.state.account}
                      products = {this.state.products}
                      createProduct={this.createProduct}
                      purchaseProduct={this.purchaseProduct}
                      buffer={this.state.buffer}
                      memeHash={this.state.memeHash}
                      captureFile={this.captureFile}
                      onSubmitt={this.onSubmitt}
                      /> //we are passing function using props
                  }
                </main> 
              }
            </div>
          </div> 
        }
      </div>
    );
  }
}

export default App;
