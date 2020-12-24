import React, { Component } from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {

  state = {
    purchasing: false,
    loading: false,
    error: false,
  }

  componentDidMount() {
    console.log(this.props);
    // axios.get('https://build-burger-of-your-dream.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState({ ingredients: response.data });
    //   })
    //   .catch(error => {
    //     this.setState({error: true});
    //   });
  }




  updatePurchaseState(ingredients) {

    const sum = Object.keys(ingredients).map(ingrKey => {
      return ingredients[ingrKey];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0);
    return sum > 0;
  }




  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = {
      ...this.props.ingrs
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />

    if (this.props.ingrs) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingrs} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoveed}
            disabled={disabledInfo}
            purchaseable={this.updatePurchaseState(this.props.ingrs)}
            ordered={this.purchaseHandler}
            price={this.props.price} />
        </Aux>
      );
      orderSummary = <OrderSummary
        ingredients={this.props.ingrs}
        price={this.props.price}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingrs: state.ingredients,
    price: state.totalPrice
  };
}

const mapDipatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingrName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingrName}),
    onIngredientRemoveed: (ingrName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingrName})
  }
}

export default connect(mapStateToProps, mapDipatchToProps)(withErrorHandler(BurgerBuilder, axios));