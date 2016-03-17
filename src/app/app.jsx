(function () {
    let React = require('react');
    let ReactDom = require('react-dom');
    let injectTapEventPlugin = require('react-tap-event-plugin');
    let Main = require('./components/main.jsx'); // Our custom react component

    // Needed for React Developer Tools
    window.React = React;

    // Needed for onTouchTap
    // Can go away when react 1.0 release
    // Check this repo:
    // https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    // Render the main app react component into #main.
    // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
    ReactDom.render(<Main />, document.getElementById('main'));

})();
