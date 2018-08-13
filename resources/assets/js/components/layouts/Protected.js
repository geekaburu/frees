import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

const Protected = ({component: Component, ...rest }) =>(
	<Route {...rest} render={(props)=>(
		User.isLoggedIn() ? <Component {...props} /> : <Redirect to={{
			pathname: '/login',
			state: { from: props.location }
		}} />	
	)}/>
)

export default Protected