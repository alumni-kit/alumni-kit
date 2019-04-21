import { Button, Divider, Modal } from "semantic-ui-react";
import React, { Component } from 'react';

class AboutModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openAboutModal });
    }

    close = () => this.props.App.setState({ openAboutModal: false });

    render() {
        return (
            <Modal
                id="about-modal"
                closeIcon
                onClose={this.close}
                open={this.state.open}
                size="medium"
            >
                <Modal.Header>About</Modal.Header>
                <Modal.Content className="about-modal__content">
                    <p><b>Source code:</b> <a href="https://github.com/alumni-kit/alumni-kit" target="_blank">https://github.com/alumni-kit/alumni-kit</a></p>
                    <p><b>Contributors:</b> Jay Arella, Joann Im</p>
                    <p><b>Credit: </b>Application icon, <a href="http://paomedia.github.io/small-n-flat/">address-book-alt</a>, made by <a href="https://github.com/paomedia/small-n-flat" target="_blank">paomedia</a> from <a href="http://paomedia.github.io/small-n-flat/" target="_blank">http://paomedia.github.io/small-n-flat/</a></p>
                    <Divider />
                    <p>MIT License <br />
                    <br />
                    Copyright (c) 2019 alumni-kit<br />
                    <br />
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:<br />
                    <br />
                    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.<br />
                    <br />
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="yellow" onClick={this.close}>Exit</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default AboutModal;