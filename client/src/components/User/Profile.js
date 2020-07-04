import React, { Component } from "react";
import * as actions from "../../actions";
import * as postActions from "../../actions/postActions";
import { connect } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Button, Tabs, Tab, Badge } from "react-bootstrap";
import PostsList from "../Post/PostsList";
import * as authActions from "../../actions/authActions";
import { faFire as faHeartr } from "@fortawesome/free-solid-svg-icons";


import "./user.css";

class Profile extends Component {
  state = {
    edit: "edit",
    showModal: false,
  };

  componentWillMount() {
    let id = this.props.match.params.id;
    if (this.props.account && id === this.props.account.id) {
      this.props.fetchUser(this.props.match.params.id, true);
    } else {
      this.props.fetchUser(this.props.match.params.id, false);
    }
  }

  handleEditPost(postId) {
    return (e) => {
      let id = this.props.match.params.id;
      if (id === this.props.account.id) {
        this.props.fetchPost(postId, true);
      } else {
        this.props.fetchPost(postId, false);
      }
    };
  }


  renderPosts(posts, { draft } = { draft: false }) {
    return (
      <PostsList
        posts={posts}
        draft={draft}
        user={this.props.user}
        account={this.props.account}
      />
    );
  }

  renderUserCard() {
    return (
      <React.Fragment>
        <div className="box-shadow d-flex flex-column align-items-center profile-box p-3">
          <img
            className=""
            src={this.props.user.imageUrl}
            style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
            alt="userIcon"
          />
          <label className="mt-3 font-weight-bold text-center">
            {this.props.user.firstName} {this.props.user.lastName}
          </label>
          <div>
            <div className="d-flex flex-row align-items-center">
              <FontAwesomeIcon
                className="white-heart"
                icon={faHeartr}
                size="1x"
                color="gray"
              />
              <div className="ml-2 text-muted font-weight-bold">
                {this.props.user.likesCount} likes
            </div>
            </div>
          </div>
          {this.props.user.badges && this.props.user.badges.length > 0 && (
            <Badge pill variant="secondary" className="d-flex mt-2">
              {this.props.user.badges[0]}
            </Badge>
          )}
          <div className="text-muted font-weight-bold text-center">
            {this.props.user.college}
          </div>
          {this.props.user.year && (
            <div className="text-muted font-weight-bold">
              Year {this.props.user.year}
            </div>
          )}
          {this.props.account && this.props.user.id === this.props.account.id && (
            <div className="text-muted font-weight-bold">
              <a href={`/users/${this.props.user.id}/form`}>edit</a>
            </div>
          )}
        </div>
        {this.props.account &&
          this.props.account.id === this.props.user.id && (
            <div className="mt-4">
              <Button variant=" col-12 new-post-button p-0">
                <Link className="com-links" to={"/CreatePost"}>
                  <div className=" p-2 py-2 com-links"><span role="img" aria-label="post">📝</span> New Post</div>
                </Link>
              </Button>
            </div>
          )}

      </React.Fragment>
    );
  }

  render() {
    if (!this.props.user || !this.props.posts || (this.props.account ? (this.props.account.id === this.props.user.id ? !this.props.drafts : null) : null)) {
      return (
        <div className="col-6 mt-5">
          <PacmanLoader
            size={40}
            color={"yellow"}
          />
        </div>
      );
    }

    return (
      <div className="mt-4 row">
        <div className="col-12 col-md-3">{this.renderUserCard()}</div>
        <div className="col-12 col-md-9">
          <React.Fragment>
            <Tabs defaultActiveKey={this.props.location.state && this.props.location.state.draft ? "user-drafts" : "user-posts"} id="user-tab">
              {(this.props.account &&
                this.props.account.id === this.props.user.id && this.props.posts.length === 0) ? (
                  <Tab eventKey="user-posts" title="Posts">
                    <div className="mt-3">
                      <span className="d-flex flex-column text-center text-muted mt-3" role="img" aria-label="post"><h3>📝</h3></span>
                      <label className="d-flex flex-column text-center text-muted">No posts created<br /> Get started and create awesome posts!</label>
                    </div>
                  </Tab>
                ) : (this.props.posts.length === 0) ?
                  (
                    <Tab eventKey="user-posts" title="Posts">
                      <div className="mt-3">
                        <span className="d-flex flex-column text-center text-muted mt-3" role="img" aria-label="post"><h3>📝</h3></span>
                        <label className="d-flex flex-column text-center text-muted">No posts created</label>
                      </div>
                    </Tab>
                  ) : (this.props.posts.length > 0) && (
                    <Tab eventKey="user-posts" title="Posts">
                      <div className="mt-3">{this.renderPosts(this.props.posts)}</div>
                    </Tab>
                  )}
              {(this.props.account &&
                this.props.account.id === this.props.user.id && this.props.drafts.length > 0) ? (
                  <Tab eventKey="user-drafts" title="Drafts">
                    <div className="mt-3">
                      {this.renderPosts(this.props.drafts, { draft: true })}
                    </div>
                  </Tab>
                ) : (this.props.account &&
                  this.props.account.id === this.props.user.id && this.props.drafts.length === 0) && (<Tab eventKey="user-drafts" title="Drafts">
                    <div className="mt-3">
                      <span className="d-flex flex-column text-center text-muted mt-3" role="img" aria-label="post"><h3>📝</h3></span>
                      <label className="d-flex flex-column text-center text-muted">No drafts created<br /> Get started and save your ongoing work here!</label>
                    </div>
                  </Tab>)}
            </Tabs>
          </React.Fragment>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userDetails.user,
    account: state.auth.data,
    posts: state.posts.posts,
    drafts: state.posts.drafts,
  };
};

export default connect(mapStateToProps, {
  ...actions,
  ...postActions,
  ...authActions,
})(Profile);
