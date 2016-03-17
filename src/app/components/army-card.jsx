import _ from 'lodash';
import React from 'react';

import Army from '../lib/army';

import {
    CompositeDecorator,
    ContentState,
    Editor,
    EditorState
} from 'draft-js';

// Material UI Components
import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';

// Material UI Theme
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Colors from 'material-ui/lib/styles/colors';

const LINE_REGEX = /^([^:]*):*(.*)\s-\s(\d+)$/gm;
const NAME_REGEX = /^([^:]*):*.*\s-\s\d+$/gm;
const WARGEAR_REGEX = /^[^:]*:*(.*)\s-\s\d+$/gm;
const POINTS_REGEX = /^[^:]*:*.*\s-\s(\d+)$/gm;
// const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

const styles = {
    name: {
        fontWeight: 900,
    },
    wargear: {
        // color: '#777',
    },
    points: {
        color: '#999',
        fontWeight: 900,
    },
}

function nameStrategy(contentBlock, callback) {
    let matches;
    while ((matches = LINE_REGEX.exec(contentBlock.getText())) !== null) {
        let start = matches.index;
        callback(start, start + matches[1].length);
    }
}

function wargearStrategy(contentBlock, callback) {
    let matches;
    while ((matches = LINE_REGEX.exec(contentBlock.getText())) !== null) {
        let start =
            // Start of Line
            matches.index
            // Name and Potential ':'
            + matches[1].length + (matches[2].length ? 1 : 0);

        if (matches[2].length) {
            callback(start, start + matches[2].length);
        }
    }
}

function pointsStrategy(contentBlock, callback) {
    let matches;
    while ((matches = LINE_REGEX.exec(contentBlock.getText())) !== null) {
        let start =
            // Start of Line
            matches.index
            // Name and Potential ':'
            + matches[1].length + (matches[2].length ? 1 : 0) +
            // Potential Wargear and ' - '
            matches[2].length + 3;

        callback(start, start + matches[3].length);
    }
}

// const nameStrategy = (contentBlock, callback) =>
//     findWithRegex(NAME_REGEX, contentBlock, callback);
// const wargearStrategy = (contentBlock, callback) =>
//     findWithRegex(WARGEAR_REGEX, contentBlock, callback);
// const pointsStrategy = (contentBlock, callback) =>
//     findWithRegex(POINTS_REGEX, contentBlock, callback);



const NameSpan = (props) =>
    <span {...props} className="name" style={styles.name}>
        {props.children}
    </span>;
const WargearSpan = (props) =>
    <span {...props} className="wargear" style={styles.wargear}>
        {props.children}
    </span>;
const PointsSpan = (props) =>
    <span {...props} className="points" style={styles.points}>
        {props.children}
    </span>;

const compositeDecorator = new CompositeDecorator([
    {
        strategy: nameStrategy,
        component: NameSpan,
    },
    {
        strategy: wargearStrategy,
        component: WargearSpan,
    },
    {
        strategy: pointsStrategy,
        component: PointsSpan,
    },
]);

export default class ArmyCard extends React.Component {
    static propTypes = {
        // { points(), text }
        army: React.PropTypes.object,
    }

    constructor(props) {
        super(props);

        const { army } = this.props;

        let editorState;

        if (army) {
            let contentState =
                ContentState.createFromText(army.text);
            editorState =
                EditorState.createWithContent(contentState, compositeDecorator);
        } else {
            editorState = EditorState.createEmpty(compositeDecorator);
        }

        // For ensuring the editor is focused when the padding around it is
        // clicked.
        this.focus = () => this.refs.editor.focus();

        this.state = {
            armyLog: this.props.army.log,
            editorState: editorState,
            points: this.props.army.points(),
        };
    }

    handleArmyChange = (editorState) => {
        const currentContent = editorState.getCurrentContent()
        const nextArmyText = currentContent.getPlainText();

        this.props.army.parse(nextArmyText);

        this.setState({
            editorState: editorState,
            points: this.props.army.points(),
        });

        if (typeof this.props.onChange === 'function') {
            this.props.onChange();
        }
    }

    logLog = () => {
        console.log(this.props.army.parseLog.join('\n'));
    }

    render() {
        const army = this.props.army;
        const {
            editorState,
            points
        } = this.state;

        const armyTextStyle = {
            whiteSpace: 'pre',
        };

        const containerStyle = {
            margin: '0',
        };

        const standardActions = [
            { text: 'Okay' },
        ];

        return (
            <div style={containerStyle}>
                <Card initiallyExpanded={false}>
                    <CardHeader
                        title={army.name}
                        subtitle={
                             <span className="points">{points}</span>
                        }
                        avatar={<Avatar style={{color: 'red'}}>A</Avatar>}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />

                    <CardText
                        expandable={true}
                        onClick={this.focus}
                        style={armyTextStyle}
                    >
                        <Editor
                            editorState={editorState}
                            onChange={this.handleArmyChange}
                            ref="editor"
                        />
                    </CardText>

                    <CardActions expandable={true}>
                        <FlatButton label="Logs" onClick={this.logLog} />
                    </CardActions>
                </Card>
            </div>
        );
    }
}
