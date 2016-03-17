import React from 'react';

// Material UI Components
import Dialog from 'material-ui/lib/dialog';

// TODO: change this to a primary nav menu item
const HelpDialog = (props) => {
    return <Dialog title="Help" {...props}>
        <h3>Army Syntax</h3>
        <p>
           Units each take up one line. Let&rsquo;s start with an
           example unit.
        </p>

        <p className="example-snippet">
            5 Chaos Marines: melta gun, melta bombs - 90
        </p>

        <p>
            &ldquo;5 &rdquo;<br/>
            The first segment of the line is the number of models in the
            unit.
        </p>

        <p>
            &ldquo;Chaos Marines&rdquo;<br/>
            The next segment is the unit name.
        </p>

        <p>
            &ldquo;: melta gun, melta bombs &rdquo;<br/>
            The next segment is the unit's wargear. Only modifications
            to the unit's default configuration need to be listed.
        </p>

        <p>
            &ldquo; - 90&rdquo;<br/>
            The final segment is the points value of the unit.
        </p>
    </Dialog>
};

export default HelpDialog;
