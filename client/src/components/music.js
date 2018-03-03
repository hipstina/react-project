import React, { Component } from 'react'
import axios from 'axios'
import ShoppingCartContainer from '../containers/shoppingCartContainer'
import {
    // BrowserRouter as Router,
    // Route,
    Link
} from 'react-router-dom';
import '../styles/css/music.css'
import '../styles/css/shoppingCart.css'

class Music extends Component {

    url = "http://localhost:7777/api/music"

    constructor(props) {
        super(props);

        this.state = {
            music: []
        }
    }

    componentDidMount() {
        axios.get(this.url).then((res) => {
            this.setState({music: res.data});
        }).catch(function(error) {
            console.log(error);
        })
    }

    render() {
        return (
            <div>
                <ShoppingCartContainer />
                <div className="music">
                    {this.state.music.map((album, i) => {
                        return (
                            <div className="album" key={i}>
                                <Link to={{ pathname: '/item/' + album.productId,
                                            state: { item: album}}}>
                                    <img alt={album.title} src={require("../assets/" + album.img)} />
                                </Link>
                                <div>
                                    {album.productId}
                                </div>
                                <div>
                                    {album.title}
                                </div>
                                <div>
                                    {album.price}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Music;