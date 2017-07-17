import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import Auth from '../Auth0/Auth0';

import { fetchProfile, editUserProfile } from '../actions/user_actions';

const auth = new Auth();

class User_Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      files: []
    };
    // this.upload = this.upload.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.profile)    
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-error' : ''}`;

    return (
      <div className={className}>
        <label>
          {field.label}
        </label>
        <input
          className="form-control"
          type="text"
          placeholder={field.placeholder}
          {...field.input}
        />
        <div className="help-block">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  renderSuccess() {
    if (this.state.submitted) {
      return <div>Successfully updated profile</div>;
    } else {
      return <div />;
    }
  }

  onDrop(acceptedFiles, rejectedFiles) {
    let array = this.state.files;
    acceptedFiles.map(file => {
      array.push(file);
    });
    this.setState({
      files: array
    });
  }

  showName() {
    const { email, name, handle } = this.props.profile.data;
    let tmp = email || '';
    return name || tmp.substring(0, tmp.indexOf('@'));
  }

  showHandle() {
    const { email, name, handle } = this.props.profile.data;
    let tmp = email || '';
    return handle ? handle : tmp.substring(0, 4);
  }

  onSubmit(values) {
    this.props.editUserProfile(values, this.props.profile.data.id);
    this.setState({ submitted: true });
  }

  render() {
    const { handleSubmit } = this.props;
    const { profile } = this.props.profile.data;

    return (
      <div id="user-profile">
        <div>
          <img
            src={'http://bit.ly/2tRR5GW'}             
            id="user-profile-pic"
            className="img-circle img-responsive"
            width="304"
            height="236"
          />
        </div>

        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <div>
            <Field
              label="Your name"
              name="name"
              type="text"
              placeholder={this.showName()}
              component={this.renderField}
            />
          </div>
          <Field
            label="Create a chat handle name"
            name="handle"
            type="text"
            placeholder={this.showHandle()}
            component={this.renderField}
          />

          <button type="submit" className="btn btn-secondary btn-lg my-btns">
            Submit
          </button>

          <Link to="/home">
            <button type="button" className="btn btn-danger btn-lg my-btns">
              Cancel
            </button>
          </Link>
        </form>
        <div>
          {this.renderSuccess()}
        </div>
      </div>
    );
  }
}

function validate(values) {
  const error = {};
  if (!values.name) {
    error.name = 'Enter your name';
  }

  if (!values.handle) {
    error.handle = 'Enter a chat handle name';
  }

  return error;
}

function mapStateToProps(state) {
  return {
    profile: state.profile
  };
}

export default reduxForm({
  validate: validate,
  form: 'ProfileForm'
})(connect(mapStateToProps, { editUserProfile, fetchProfile })(User_Profile));
