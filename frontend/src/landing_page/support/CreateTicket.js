import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChartSimple,
  faFilterCircleDollar,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
// import "./index.css"; // Assuming you have a CSS file for styling

function CreateTicket() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2">To create a ticket, select a relevant topic</h1>

        <div className="col-4 p-5 mt-2 mb-2">
          <h4>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Account Opening
          </h4>
          <a href="#" className="link-no-underline">Online Account Opening</a><br />
          <a href="#" className="link-no-underline">Offline Account Opening</a><br />
          <a href="#" className="link-no-underline">Company, Partnership and HUF Account</a><br />
          <a href="#" className="link-no-underline">Opening</a><br />
          <a href="#" className="link-no-underline">NRI Account Opening</a><br />
          <a href="#" className="link-no-underline">Charges at Zerodha</a><br />
          <a href="#" className="link-no-underline">Zerodha IDFC FIRST Bank 3-in-1 Account</a><br />
          <a href="#" className="link-no-underline">Getting Started</a><br />
        </div>

        <div className="col-4 p-5 mt-2 mb-2">
          <h4>
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Your Zerodha Account
          </h4>
          <a href="#" className="link-no-underline">Login Credentials</a><br />
          <a href="#" className="link-no-underline">Account Modification and Segment Addition</a><br />
          <a href="#" className="link-no-underline">DP ID and Bank details</a><br />
          <a href="#" className="link-no-underline">Your Profile</a><br />
          <a href="#" className="link-no-underline">Transfer and conversion of shares</a><br />
        </div>

        <div className="col-4 p-5 mt-2 mb-2">
          <h4>
            <FontAwesomeIcon icon={faChartSimple} className="me-2" />
            Trading Platforms
          </h4>
          <a href="#" className="link-no-underline">Margin/Leverage, Products and Orders types</a><br />
          <a href="#" className="link-no-underline">Kite Web and Mobile</a><br />
          <a href="#" className="link-no-underline">Trading FAQs</a><br />
          <a href="#" className="link-no-underline">Corporate Actions</a><br />
          <a href="#" className="link-no-underline">Sentinel</a><br />
          <a href="#" className="link-no-underline">Kite API</a><br />
          <a href="#" className="link-no-underline">Pi and other platforms</a><br />
          <a href="#" className="link-no-underline">Stockreports</a><br />
          <a href="#" className="link-no-underline">GTT</a><br />
        </div>

        <div className="col-4 p-5 mt-2 mb-2">
          <h4>
            <FontAwesomeIcon icon={faFilterCircleDollar} className="me-2" />
            Funds
          </h4>
          <a href="#" className="link-no-underline">Adding Funds</a><br />
          <a href="#" className="link-no-underline">Withdrawing Funds</a><br />
          <a href="#" className="link-no-underline">eMandates</a><br />
          <a href="#" className="link-no-underline">Adding Bank Accounts</a><br />
        </div>

        <div className="col-4 p-5 mt-2 mb-2">
          <h4>
            <FontAwesomeIcon icon={faTerminal} className="me-2" />
            Console
          </h4>
          <a href="#" className="link-no-underline">Reports</a><br />
          <a href="#" className="link-no-underline">Ledger</a><br />
          <a href="#" className="link-no-underline">Portfolio</a><br />
          <a href="#" className="link-no-underline">60 Day Challenge</a><br />
          <a href="#" className="link-no-underline">IPO</a><br />
          <a href="#" className="link-no-underline">Referral Program</a><br />
        </div>

        <div className="col-4 p-5 mt-2 mb-2">
          <h4>
            <FontAwesomeIcon icon={faTerminal} className="me-2" />
            Coin
          </h4>
          <a href="#" className="link-no-underline">Understanding Mutual Funds</a><br />
          <a href="#" className="link-no-underline">About Coin</a><br />
          <a href="#" className="link-no-underline">Buying and Selling through Coin</a><br />
          <a href="#" className="link-no-underline">Starting an SIP</a><br />
          <a href="#" className="link-no-underline">Managing your portfolio</a><br />
          <a href="#" className="link-no-underline">Coin App</a><br />
          <a href="#" className="link-no-underline">Moving to Coin</a><br />
          <a href="#" className="link-no-underline">Government Securities</a><br />
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
