import React from 'react'

type State = {
  isLoading: boolean
  isRefetching: boolean
  error: Error | null
  data: { [key: string]: any } | null
}

type Props = {
  children: (st: State & { refetch: Function }) => React.ReactNode
  method: Function
  body?: Object
}

const initialState = {
  isLoading: true,
  isRefetching: false,
  error: null,
  data: null,
}

export class Query extends React.PureComponent<Props, State> {
  state = initialState

  componentDidMount() {
    this.query()
  }

  query = (body = this.props.body, isRefetch = false) => {
    this.setState(
      state => (isRefetch ? { ...state, isRefetching: true } : { ...state, isLoading: true }),
      () =>
        this.props
          .method(body)
          .then((res: { [key: string]: any }) =>
            // @ts-ignore
            this.setState({
              error: null,
              ...(isRefetch ? { isRefetching: false } : { isLoading: false }),
              data: res,
            }),
          )
          .catch((err: Error) =>
            // @ts-ignore
            this.setState({
              error: err,
              ...(isRefetch ? { isRefetching: false } : { isLoading: false }),
              data: null,
            }),
          ),
    )
  }

  refetch = (body: any) => this.query(body, true)

  render() {
    return this.props.children({ ...this.state, refetch: this.refetch })
  }
}
