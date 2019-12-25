pragma solidity 0.5.0;

contract Meme {
    
    string public name;
    //for product count as in Ethererum we have no way of knowing the size of mapping
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product
    {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
        string memeHash;
    }

    //events are created to make sure that receipts are obtained after a txn is completed.
    event ProductCreated
    (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,
        string memeHash
       
    );

     event ProductPurchased
    (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased,
        string memeHash
       
    );

    //constructor runs ONLY ONCE when the SC is deployed
    constructor() public
    {
        name= "Dapp Marketplace";
    }

    function createProduct(string memory _name, uint _price, string memory _memeHash) public
    {
        //Require valid name
        require(bytes(_name).length > 0);
        //Require valid price
        require(_price > 0);
        //Increment productCount
        productCount ++;
        //Create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false, _memeHash);
        //Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false, _memeHash);
    }

    function purchaseProduct(uint _id) public payable
    {
        //fetch product
        //memory space is being used to store copy of said product i.e copy of products[_id]
        Product memory _product = products[_id];

        //fetch owner
        address payable _seller = _product.owner;

        //check if product has valid id
        require(_product.id >0 && _product.id <= productCount);

        //check if there is enough ether
        require(msg.value >= _product.price);

        //check is the product hasn't  been sold already
        require(!_product.purchased);

        //check if the buyer is not the seller
        require(_seller != msg.sender);

        //purchase it i.e transfer ownership
        _product.owner = msg.sender;

        //marks as purchased
        _product.purchased = true;

        //update product
        products[_id] = _product;

        //pay the seller by sending ether
        address(_seller).transfer(msg.value);

        //trigger an event 
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true, _product.memeHash);
    }
}