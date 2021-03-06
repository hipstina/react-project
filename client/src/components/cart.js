import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../styles/css/cart.css'
import config from 'react-global-configuration'

class Cart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shoppingCartSize: 0,
            items: []
        };

        if (this.props && this.props.shoppingCart) {
            this.state = {
                shoppingCartSize: this.props.shoppingCartSize,
                shoppingCart: this.props.shoppingCart,
                items: [],
                itemQuantities: []
            }
        }

        this.navigateBack = this.navigateBack.bind(this);
    }

    navigateBack() {
        this.props.navigate.goBack(null);
    }

    onValueChange(productId, index, e) {
        var value = e.target.value;
        console.log("onValueChange: " + e.target.value);
        if (value < 0) {
            value = 0;
        }

        var tempQuantities = this.state.itemQuantities;
        tempQuantities[Number(index)] = value;

        this.setState({
            ...this.state,
            itemQuantities: tempQuantities
        });

        if (value != 0) {
            this.props.actions.updateQuantity(productId, Number(value));
        }
    }

    // onClick(productId, quantity) {
    //     this.props.actions.updateQuantity(productId, Number(quantity));
    // }

    componentDidMount() {
        if (this.props && this.props.shoppingCart) {

            var url = config.get('api') + "/item/";

            var itemList = [];
            var itemQuantities = [];
            this.props.shoppingCart.forEach((item, index) => {
                var getItem;
                axios.get(url + item.productId).then((res) => {
                    getItem =  res.data[0];
                    itemList.push(getItem);
                    itemQuantities.push(item.quantity);
                    this.setState({
                        items: itemList,
                        itemQuantities: itemQuantities
                    });
                }).catch(function(error) {
                    console.log(error);
                })
            });
        }
    }

    render() {
        var shoppingCartSize = this.props.shoppingCartSize ? this.props.shoppingCartSize : 0;

        console.log('this.state.items: ', this.state.items);

        return (
            <div className="cart">
                <div className="checkoutBar">
                    <div className="backButton">
                        <button onClick={this.navigateBack}>Back</button>
                    </div>
                    <div className="checkoutButton">
                        <Link to={{ pathname: '/checkout',
                                    state: {cart: this.state.items.map((item, i) => {
                                        var match = this.props.shoppingCart.find((element) => {
                                            return element.productId === item.productId;
                                        });

                                        var quantity = (match && match.quantity) || 0;

                                        if (quantity === 0) return {};

                                        return {
                                            item: item,
                                            quantity: quantity
                                        }
                                    })}}}>
                            <button className="greenButton">Checkout</button>
                        </Link>
                    </div>
                </div>
                <div>
                    <span>Items:  {shoppingCartSize}</span>
                    {/* <span>Total:  {shoppingCartSize}</span> */}
                </div>
                <div className="items">
                    {this.state.itemQuantities &&
                    this.state.items &&
                    this.props.shoppingCart &&
                    this.props.shoppingCart.map((product, i) => {
                        var item = this.state.items.find((element) => {
                            return element.productId === product.productId;
                        });
                        if (!item)
                            return [];
                        
                        var quantity = this.state.itemQuantities[i] ? this.state.itemQuantities[i] : 0;
                        var savedQuantity = product.quantity;
                        return (
                            <div className="item row" key={i}>
                                <div className="thumbnail two columns">
                                    <Link to={{ pathname: '/item/' + item.productId,
                                                state: { item: item}}}>
                                        <img alt={item.title} src={require("../assets/" + item.img)} />
                                    </Link>
                                </div>
                                <div className="title five columns">
                                    <span>
                                        {item.title}
                                    </span>
                                </div>
                                <div className="price one column">
                                    ${item.price}
                                </div>
                                <div className="quantity two columns">
                                    <span>
                                        Quantity:
                                    </span>
                                    <div>
                                        <input type="number" value={quantity} onChange={this.onValueChange.bind(this, item.productId, i)}/>
                                    </div>
                                    {/* <div>
                                        <button onClick={this.onClick.bind(this, item.productId, this.state.itemQuantities[i])}>Update</button>
                                    </div> */}
                                </div>
                                <div className="total two columns">
                                    ${savedQuantity * item.price}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Cart;