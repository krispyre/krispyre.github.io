import React from "react";
import pfp from "./assets/pfp.png";
const Card = () => {
  return (
    <div id="card">
      <div id="text">
        <div id="intro">
          <h1>kristen wong</h1>
          <p>
            Email: <code>krispyre[at]gmail.com</code>
          </p>
          <p>hello i code and draw</p>
        </div>
        <nav id="exp">
          {" "}
          <ul>
            <li>
              <a href="/dualpfp">make a dual discord pfp here</a>
            </li>
            <li>
              <a href="#resume">resume</a>
            </li>
          </ul>
        </nav>
        <nav id="contacts">
          {" "}
          <ul>
            <li>
              <a href="https://instagram.com/krispyre_">insta</a>
            </li>
            <li>
              <a href="https://www.github.com/krispyre">gih</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="pfp">
        <img src={pfp} />
      </div>
      {/*  */}
    </div>
  );
};

export default Card;
