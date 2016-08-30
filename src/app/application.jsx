import { action, autorun } from 'mobx'
import { observer } from 'mobx-react'
import { Component } from 'react'
import { withRouter } from 'react-router'

// import DevTools from 'mobx-react-devtools'

import { getProjects } from '../projects/projects-api'

import App from '../lib/app'
import state from '../lib/state'

@withRouter
@observer
export default class Application extends Component {
  constructor (props) {
    super(props)

    App.ipc('get:current:user')
    .then(action('got:current:user', (user) => {
      state.userLoaded = true
      state.setUser(user)

      if (!user || !user.session_token) {
        return this.props.router.push('/login')
      }
    }))

    autorun(() => {
      if (!state.userLoaded) return

      if (state.hasUser) {
        getProjects()
        return this.props.router.push('/')
      } else {
        return this.props.router.push('/login')
      }
    })
  }

  render () {
    return this.props.children
  }

  // _devTools () {
  //   if (window.env === 'development') {
  //     // return null
  //     return <DevTools position={{ bottom: 0, left: 20 }}/>
  //   }
  // }
}
