import React, { Component } from "react"
import Timer from "../Timer"
import hackathon from "../hackathon11.jpg"
import Leaderboard from "../Post/Leaderboard";
import PostsList from "../Post/PostsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as postActions from "../../actions/postActions";
import * as leaderboardActions from "../../actions/leaderboardActions";
import * as authActions from "../../actions/authActions";
import * as hackathonActions from "../../actions/hackathonActions";
import './hackathon.css';
import { Button, Collapse, Badge } from 'react-bootstrap';
import Registration from "./Registration"
import ideas from './ideas.json'
import PacmanLoader from "react-spinners/PacmanLoader";

class Hackathon extends Component {

  state = {
    showParticipating: false,
    ...ideas.map((idea) => ({ [`show${idea.language}`]: false })),
    open: false
  }

  componentWillMount() {
    this.props.fetchTopContributors();
    this.props.fetchHackathonDetails();
  }

  handleClose() {
    this.setState({ showParticipating: !this.state.showParticipating })
  }

  handleDeleteIdea(postId) {
    this.props.deleteHackathonPost(postId)
  }

  render() {
    // if (this.props.isLoading) {
    //   debugger
    //   return (
    //     <div className="col-6 mt-5">
    //       <PacmanLoader
    //         size={40}
    //         color={"#FADA5E"}
    //       />
    //     </div>
    //   )
    // }
    return (
      <div className="mt-4">
        <img className="col-12 p-0" src={hackathon} height="300px" alt="hackathon" />
        {!this.props.postByCurrentUser ? (
          <div className="col-12 row p-0 m-0 d-flex flex-wrap">
            <div className="col-12 col-md-8 p-0 box-shadow m-0">
              {this.state.showParticipating ?
                (<Registration hackathonId={this.props.hackathonId}
                  onClose={this.handleClose.bind(this)} />) :
                (
                  <div className='d-flex flex-column p-4'>
                    <label> Note :</label>
                    <li>If participating as a team, only one member needs to register for th hackathon(can add teammates later).</li>
                    <li>You only need an awesome idea to register(can fill contents later).</li>
                    <li>Can submit any pre-existing project or make a new project in given time.</li>
                    <li>Plagiarized projects will be disqualified.</li>
                    <button
                      onClick={() => { this.setState({ showParticipating: !this.state.showParticipating }) }}
                      type="button"
                      class="btn btn-primary btn-lg btn-block col-8"
                    >Register</button>
                  </div>
                )}
            </div>
            <div className="col-12 col-md-4 mt-md-0 mt-3">
              <Leaderboard topContributors={this.props.topContributors} />
            </div>
          </div >
        ) : <span className="mt-0 p-0"></span>}
        {!this.props.postByCurrentUser ? (
          <div className="col-md-8 col-12 mt-4 p-0">
            <div className="p-3 d-flex justify-content-between" style={{ backgroundColor: 'white', border: '1px solid #e1e1e1', borderRadius: '3px' }}>
              <div className="col-10 col-md-11">
                <h4 className="">Trouble finding an idea?</h4>
                <h6 className="text-muted">Find inspiration in our curated list! (expand)</h6>
                <Collapse in={this.state.open}>
                  <div id="example-collapse-text">
                    {ideas.map((idea) => (
                      <div className="mt-2">
                        {idea.list.map(i =>
                          <div className="idea-card d-flex justify-content-between mt-2 flex-wrap">
                            <li className="col-md-11 col-10">{i}</li>
                            <span className="col-md-1 col-2 ">
                              <Badge
                                className="post-link badge-light p-2  float-right"
                                style={{ backgroundColor: "#e9e9e9" }}
                              >
                                {idea.label}
                              </Badge>
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
              <div className="col-2 col-md-1 p-2">
                <button
                  className="post-item-buttons collapse-button"
                  onClick={() => this.setState({ open: !this.state.open })}
                  aria-controls="example-collapse-text"
                  aria-expanded={this.state.open}
                >
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    size="2x"
                    color="gray"
                  />
                </button>
              </div>
            </div>
          </div>) : null}


        {this.props.postByCurrentUser ? (
          <div className="col-12 row p-0 m-0">
            <div className="col-8 mt-4 p-0">
              <div className="p-3" style={{ backgroundColor: '#f2fffe', border: '1px solid #e1e1e1', borderRadius: '3px' }}>
                <h4 className="text-muted">My post <span style={{ color: '#c0c0c0' }}>(private)</span></h4>
                <PostsList className="" user={this.props.postByCurrentUser.user}
                  account={this.props.account} hackathon={true}
                  draft={true} posts={[this.props.postByCurrentUser]} handleDeleteIdea={this.handleDeleteIdea.bind(this)} />
                <div className="d-flex justify-content-end">
                  <Button variant="primary">Edit</Button>{' '}
                  <Button className="ml-2" variant="success">Publish</Button>{' '}
                </div>
              </div>
            </div>
            <div className="col-4 mt-4">
              <Leaderboard topContributors={this.props.topContributors} />
            </div>
          </div>
        ) : null}
        <div className="col-8 p-0 mt-4">
          <h4 className="text-muted">Vote for the submissions so far</h4>
          <PostsList className="" posts={this.props.hackathonPosts} />
        </div>
        < a target="_blank" href="https://icons8.com" > Icons8</a >
      </div >
    )
  }

}

const mapStateToProps = (state) => {
  return {
    posts: state.posts.posts,
    account: state.auth.data,
    authenticated: state.auth.authenticated,
    topContributors: state.leaderboard.topContributors,
    hackathonPosts: state.hackathon.hackathonPosts,
    postByCurrentUser: state.hackathon.postByCurrentUser,
    isLoading: state.hackathon.isLoading,
    hackathonId: state.hackathon.hackathonId
  };
};

export default connect(mapStateToProps, { ...actions, ...postActions, ...authActions, ...leaderboardActions, ...hackathonActions })(
  Hackathon);