import React, { PureComponent } from 'react'

export default class header extends PureComponent {
  render() {
    return (
      <header className='header'>
        <div className='header-left'>
            <a href='/' className='header-link'>TerraSafe</a>
        </div>
        <div className='header-right'>
            <a href="/login" className='header-link'>Login</a>
        </div>
      </header>
    )
  }
}
