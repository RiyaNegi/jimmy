import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import * as actions from "../../actions";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import Loader from "react-loader-spinner";
import ControlledEditor from "./controlledEditor";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }
  componentWillMount() {
    if (this.props.match.params.id) {
      if (this.props.account.id) {
        this.props.fetchPost(this.props.match.params.id, true);
      } else {
        this.props.fetchPost(this.props.match.params.id, false);
      }
    }
  }

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormSubmit = (name) => {
    let postId = parseInt(this.props.match.params.id);
    return (params) => {
      if (name === "save" && params["title"]) {
        this.props.updatePost(
          postId,
          params["title"],
          false,
          params["postEditor"]
        );
        this.setState({ editorState: EditorState.createEmpty() });
      } else if (name === "publish" && params["title"]) {
        this.props.updatePost(
          postId,
          params["title"],
          true,
          params["postEditor"]
        );
        this.setState({ editorState: EditorState.createEmpty() });
      }
    };
  };
  render() {
    const { handleSubmit, submitting, pristine } = this.props;
    let edit = this.props.location.state.edit
      ? this.props.location.state.edit
      : false;
    if (!this.props.post) {
      console.log("loaderrr");
      return (
        <div className="loader">
          <Loader type="ThreeDots" color="#ffe31a" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="mt-3">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <Select
              className="basic-single col-3"
              classNamePrefix="select"
              isSearchable={false}
              name="postTag"
              options={options}
            />

            <div className="">
              <div className="d-flex flex-row">
                <button
                  className="ml-2 btn btn-light site-button post-button"
                  action="submit"
                  name="publish"
                  onClick={handleSubmit(this.handleFormSubmit("publish", edit))}
                >
                  Publish Draft
                </button>
                <Link
                  className="com-links ml-2 "
                  to={`/previewPost/${this.props.post.id}`}
                >
                  <button
                    className="btn btn-secondary site-button dept-button draft-button"
                    action="submit"
                    name="save"
                  >
                    Preview
                  </button>
                </Link>

                <button
                  className="ml-2 btn btn-secondary"
                  action="submit"
                  name="save"
                  onClick={handleSubmit(this.handleFormSubmit("save", edit))}
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <fieldset>
              <Field
                className="col-12 post-title-input"
                type="text"
                name="title"
                placeholder="Title"
                component="input"
              />
            </fieldset>
            <Field
              name="postEditor"
              component={ControlledEditor}
              editorContent={this.props.editorContent}
            />
          </div>
        </form>
      </div>
    );
  }
}

const populatePostValues = (state, desc) => {
  if (state.postDetails.details) {
    var info = {};
    info = {
      ...info,
      ...{ title: state.postDetails.details.title },
      postEditor: desc,
    };
    return info;
  } else return;
};

const mapStateToProps = (state) => {
  let desc = state.postDetails.description
    ? state.postDetails.description
    : convertToRaw(EditorState.createEmpty().getCurrentContent());
  return {
    account: state.auth.data,
    editorContent: desc,
    post: state.postDetails.details,
    description: state.postDetails.description,
    initialValues: populatePostValues(state, desc),
  };
};

const CreateFormPost = reduxForm({
  form: "createPost",
  enableReinitialize: true,
})(CreatePost);

export default connect(mapStateToProps, actions)(CreateFormPost);