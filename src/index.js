import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
// import createHashHistory from 'history/createHashHistory';
import routes from './config/routes';
// import createHistory from 'history/createBrowserHistory'
//import useScroll from 'scroll-behavior/lib/useStandardScroll' //跳转之后调整scroll position到顶部.
// const history = useRouterHistory(createHashHistory)({queryKey: false});
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router history={hashHistory} routes={routes} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
