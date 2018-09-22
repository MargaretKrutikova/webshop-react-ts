import * as React from "react"
import { connect } from "react-redux"
import { compose } from "recompose"
import { createStructuredSelector } from "reselect"
import { actions, selectors, Product } from "store/products"

// types
type StateProps = {
  products: Product[]
}

type DispatchProps = {
  requestProducts: () => void
}

type Props = StateProps & DispatchProps

const enhance = compose<Props, {}>(
  connect<StateProps, DispatchProps>(
    createStructuredSelector({
      products: selectors.getProductList
    }),
    { requestProducts: actions.requestProducts }
  )
)

class ProductListing extends React.Component<Props> {
  componentDidMount() {
    const { requestProducts } = this.props
    requestProducts()
  }
  render() {
    const { products = [] } = this.props
    return products.map(product => <div key={product.id}>{product.name}</div>)
  }
}

export default enhance(ProductListing)
