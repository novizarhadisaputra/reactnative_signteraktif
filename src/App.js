import React from 'react'
import { StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import RootNavigation from './navigations'
import store from './redux/store'

const App = () => {
    return (
        <Provider store={store}>
            <RootNavigation></RootNavigation>
        </Provider>
    )
}

export default App

const styles = StyleSheet.create({})
