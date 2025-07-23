import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5 " id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="">Track Tickets</a>
      </div>
      <div className="row p-5 m-3, mb-5">
        <div className="col-6 p-3 ">
          <h1 className="fs-3 mb-5">
            Search for an answer or browse help topics to create a ticket
          </h1>
          <input style={{marginBottom: "2%"}} placeholder="Eg. how do I activate F&O" />
          <br />
          <ol>
            <li><a href=""style= {{ padding: "2%", margin: "1%", textDecoration:" none" }}>Track account opening</a></li>
            <li><a href="" style={{ padding: "2%", margin: "1%", textDecoration:" none" }}>Track segment activation</a></li>
            <li><a href="" style={{ padding: "2%", margin: "1%", textDecoration:" none" }}>Intraday margins</a></li>
            <li><a href="" style={{ padding: "2%", margin: "1%", textDecoration:" none" }}>Kite user manual</a></li>
          </ol>
        </div>
        <div className="col-6 p-3">
          <h1 className="fs-3">Featured</h1>
          <ol>
            <li>
              <a href="" style={{textDecoration:" none"}}>Current Takeovers and Delisting - January 2024</a>
            </li>
            <li>
              <a href="" style={{textDecoration:" none"}}>Latest Intraday leverages - MIS & CO</a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;