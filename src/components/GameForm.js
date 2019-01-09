import React, { Component } from 'react';
import classnames from 'classnames';

class GameForm extends Component {
    state = {
        _id: this.props.game ? this.props.game._id : null,
        title: this.props.game ? this.props.game.title : '',
        cover: this.props.cover ? this.props.game.cover : '',
        errors: {},
        loadding: false,
        // done:false
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.game) {
            this.setState({
                _id: nextProps.game._id,
                title: nextProps.game.title,
                cover: nextProps.game.cover,
            })
        }

    }

    handleChange = (e) => {
        if (!!this.state.errors[e.target.name]) {
            let errors = Object.assign({}, this.state.errors); //克隆对象
            delete errors[e.target.name];
            this.setState({
                [e.target.name]: e.target.value,
                errors
            })
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let errors = {}

        if (this.state.title === '') errors.title = "Can't be Empty";
        if (this.state.cover === '') errors.cover = "Can't be Empty";
        this.setState({ errors }); // this.setState({errors:errors});

        const isValid = Object.keys(errors).length === 0
        if (isValid) {
            const { _id, title, cover } = this.state;
            //loading
            this.setState({ loadding: true });

            this.props.saveGame({ _id, title, cover })
                .catch((error) => error.response.json().then(
                    ({ errors }) => {
                        this.setState({
                            errors, loadding: false
                        })
                    }
                ))
        }
    }

    render() {
        const from = (
            <form className={classnames('ui', 'form', { loading: this.state.loadding })} onSubmit={this.handleSubmit}>
                <h1>Add New game</h1>
                {!!this.state.errors.global && <div className="ui negative message">{this.state.errors.global}</div>}
                {!!this.state.errors.global && <div classnames="ui negative message">{this.state.errors.global}</div>}

                <div className={classnames('field', { error: !!this.state.errors.title })}>
                    <label htmlFor="title">Ttitle</label>
                    <input type="text"
                        value={this.state.title}
                        onChange={this.handleChange}
                        name="title" />
                    <span>{this.state.errors.title}</span>
                </div>

                <div className={classnames('field', { error: !!this.state.errors.cover })}>
                    <label htmlFor="title">Cover Url</label>
                    <input type="text"
                        value={this.state.cover}
                        onChange={this.handleChange}
                        name="cover" />
                    <span>{this.state.errors.cover}</span>
                </div>

                <div className="field">
                    {this.state.cover !== '' && <img src={this.state.cover} alt="cover" className="ui small bordered image" />}
                </div>

                <div className="field">
                    <button className="ui primary button">Save</button>
                </div>

            </form>
        )
        return (
            <div>
                {from}
            </div>
        )
    }
}

export default GameForm;
