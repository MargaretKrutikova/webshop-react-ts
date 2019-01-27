import * as React from "react"
import { connect } from "react-redux"
import { compose } from "recompose"
import { createStructuredSelector } from "reselect"
import { productsActions, productsSelectors, Product } from "store/products"

// types
type StateProps = {
  paginatedProducts: Product[]
  currentPage: number
}

type DispatchProps = {
  search: (searchTerm: string) => void
  goToPage: (page: number, itemsPerPage: number) => void
}

type Props = StateProps & DispatchProps

const enhance = compose<Props, {}>(
  connect<StateProps, DispatchProps>(
    createStructuredSelector({
      paginatedProducts: productsSelectors.getCurrentPageItems,
      currentPage: productsSelectors.getCurrentPage
    }),
    {
      goToPage: productsActions.goToPage,
      search: productsActions.search
    }
  )
)

class ProductListing extends React.Component<Props> {
  myRef: React.RefObject<HTMLInputElement> = React.createRef()

  render() {
    const { paginatedProducts, goToPage, search, currentPage } = this.props
    return (
      <>
        <div style={{ marginBottom: 20 }}>
          <input placeholder="search" ref={this.myRef} />
          <button
            onClick={() => {
              if (this.myRef.current) {
                search(this.myRef.current.value)
              }
            }}
          >
            Search
          </button>
        </div>
        <div style={{ marginBottom: 30 }}>
          {[1, 2, 3, 4].map(value => (
            <span
              onClick={() => goToPage(value, 3)}
              key={value}
              style={{
                padding: 8,
                ...(currentPage === value
                  ? { fontWeight: "bold", border: "1px dotted black" }
                  : { cursor: "pointer" })
              }}
            >
              {value}
            </span>
          ))}
        </div>
        {paginatedProducts.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </>
    )
  }
}

export default enhance(ProductListing)
