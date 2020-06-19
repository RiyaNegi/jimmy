import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import Loader from "react-loader-spinner";
import "./leaderboard.css";

const Leaderboard = ({ className, style, topContributors }) => {
  return (
    <div
      className={`box-shadow leaderboard-box ${className} px-0 pt-3`}
      style={{ height: "fit-content", ...style }}
    >
      <span className="text-muted" style={{ marginLeft: "15px" }}>
        Top Contributors
      </span>
      <div className="d-flex flex-column mt-2">
        {!topContributors ? (
          <div className="loader">
            <Loader type="ThreeDots" color="#ffe31a" height={100} width={100} />
          </div>
        ) : (
          topContributors.map((user) => (
            <div className="mt-1 font-weight-bold leaderboard-row">
              <Link
                to={`users/${user.id}`}
                className="d-flex flex-row no-decoration py-2"
              >
                <span className="col-9 d-flex flex-row pr-0">
                  <span className="d-flex align-self-center text-truncate">
                    {user.firstName} {user.lastName}
                  </span>
                  {user.badges && user.badges.length > 0 && (
                    <Badge
                      pill
                      variant="secondary"
                      className="d-flex align-self-center ml-1 "
                      style={{ fontSize: "11px" }}
                    >
                      {user.badges[0]}
                    </Badge>
                  )}
                </span>
                <span className="col-3 pl-0 font-weight-bold d-flex text-muted justify-content-end">
                  {user.karma} 🔥
                </span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
