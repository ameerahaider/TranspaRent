// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './SafeMath.sol';

contract Reviews {

    using SafeMath for uint;

    // Struct to represent the Review details
    struct ReviewDetails {
        address account;
        address reviewer;
        string review;
        uint rating; // out of ten
        uint requestedDate;
    }

    // Mapping to store reviews by account address
    mapping(address => ReviewDetails[]) public reviews;

    // Variable to store the available balance in the contract
    uint public availableBalance;

    // Function to add funds to the contract
    function addFunds() public payable {
        availableBalance = availableBalance.add(msg.value);
    }

    // Function to add a review
    function addReview(address account, string memory str, uint rating) public {
        // Create a new review
        ReviewDetails memory newReview = ReviewDetails({
            account: account,
            reviewer: msg.sender,
            review: str,
            rating: rating,
            requestedDate: block.timestamp
        });
        // Add the review to the array of reviews for the specified account
        reviews[account].push(newReview);
    }

    // Function to get all reviews for a specific account
    function getReviews(address account) external view returns (ReviewDetails[] memory) {
        return reviews[account];
    }
}
