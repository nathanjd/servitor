/** In this file, we create a React component which incorporates components provided by material-ui */

import React from 'react';

import Army from '../lib/army';
import ArmyService from '../lib/army-service';

// Material UI Components
import AddIcon from 'material-ui/lib/svg-icons/content/add';
import AppBar from 'material-ui/lib/app-bar';
import Card from 'material-ui/lib/card';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';

// Custom Components
import ArmyCard from './army-card.jsx';
import HelpDialog from './help-dialog.jsx';

// Material UI Theme
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Colors from 'material-ui/lib/styles/colors';

export default class Main extends React.Component {
    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    constructor(props) {
        super(props);

        this.state = {
            armies: ArmyService.getAll(),
            muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
            helpDialogOpen: false,
            leftNavOpen: false,
            title: 'Armies'
        };
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
            accent1Color: Colors.deepOrange500,
        });

        this.setState({muiTheme: newMuiTheme});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    handleArmyChange = (event) => {
        ArmyService.save(this.state.armies);
    }

    handleRequestLeftNavChange = (requestOpen) => {
        this.setState({ leftNavOpen: requestOpen });
    }

    handleRequestLeftNavOpen = () => {
        this.setState({ leftNavOpen: true });
    }

    handleRequestHelpOpen = () => {
        this.setState({ helpDialogOpen: true });
    }

    handleRequestHelpClose = () => {
        this.setState({ helpDialogOpen: false });
    }

    handleResetArmiesTap = () => {
        ArmyService.resetToDefault();

        this.setState({ armies: ArmyService.getAll() });
    }

    handleSpeedDialTap = (event) => {
        // Clone currently loaded armies.
        let newArmies = this.state.armies.slice();

        // Append a new army to cloned list.
        newArmies.push(new Army());

        this.setState({ armies: newArmies });

        ArmyService.save(newArmies);
    }

    render() {
        const armies = this.state.armies;

        const armyCards = armies.map((army, i) =>
            <ArmyCard
                onChange={this.handleArmyChange}
                army={army}
                key={i}
            />
        );

        const letfNavIcon = this.state.leftNavOpen ?
            <IconButton><NavigationClose /></IconButton> : undefined;

        const containerStyle = {
            margin: '0',
            position: 'relative',
            height: '100%',
        };

        const speedDialStyle = {
            position: 'fixed',
            bottom: '2em',
            right: '2em',
        };

        const standardActions = [
            { text: 'Okay' },
        ];

        return (
            <div style={containerStyle}>
                <AppBar
                    title={this.state.title}
                    iconElementLeft={letfNavIcon}
                    onLeftIconButtonTouchTap={this.handleRequestLeftNavOpen}
                    iconElementRight={
                        <IconMenu iconButtonElement={
                            <IconButton><MoreVertIcon /></IconButton>
                        }>
                            <MenuItem
                                onTouchTap={this.handleResetArmiesTap}
                                primaryText="Reset Armies"
                            />
                            <MenuItem
                                onTouchTap={this.handleRequestHelpOpen}
                                primaryText="Help"
                            />
                            <MenuItem primaryText="Sign out" />
                        </IconMenu>
                    }
                />

                {armyCards}

                <FloatingActionButton
                    style={speedDialStyle}
                    onTouchTap={this.handleSpeedDialTap}
                >
                    <AddIcon/>
                </FloatingActionButton>

                <HelpDialog
                    open={this.state.helpDialogOpen}
                    onRequestClose={this.handleRequestHelpClose}
                />

                <LeftNav
                    docked={false}
                    open={this.state.leftNavOpen}
                    onRequestChange={this.handleRequestLeftNavChange}
                >
                    <MenuItem>Armies</MenuItem>
                    <MenuItem onTouchTap={this.handleRequestHelpOpen}>
                        Help
                    </MenuItem>
                </LeftNav>
            </div>
        );
    }
}

export default Main;
