// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DisputeResolution {
    enum DisputeStatus { Pending, Solved }

    struct Dispute {
        uint256 ID;
        uint256 agreementID;  // Reference to the agreement
        address tenant;
        address landlord;
        string title;
        string reason;
        string resolution;
        DisputeStatus status;
    }

    Dispute[] public disputes;

    function raiseDispute(
        uint256 _agreementID,
        address _tenant,
        address _landlord,
        string memory _title,
        string memory _reason
    ) external {

        Dispute memory newDispute = Dispute({
            ID: disputes.length,
            agreementID: _agreementID,
            tenant: _tenant,
            landlord: _landlord,
            title: _title,
            reason: _reason,
            resolution: "",
            status: DisputeStatus.Pending
        });

        disputes.push(newDispute);
    }

    function resolveDispute(uint256 _disputeID, string memory _resolution) external {
        require(_disputeID < disputes.length, "Invalid dispute ID");
        //require(disputes[_disputeID].landlord == msg.sender, "Only landlord can resolve dispute");
        require(disputes[_disputeID].status == DisputeStatus.Pending, "Dispute already resolved");

        disputes[_disputeID].resolution = _resolution;
        disputes[_disputeID].status = DisputeStatus.Solved;
    }

    function getDisputeDetails(uint256 _disputeID) external view returns (Dispute memory) {
        require(_disputeID < disputes.length, "Invalid dispute ID");
        return disputes[_disputeID];
    }

    function getDisputesForAgreement(uint256 _agreementID) external view returns (Dispute[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < disputes.length; i++) {
            if (disputes[i].agreementID == _agreementID) {
                count++;
            }
        }

        Dispute[] memory result = new Dispute[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < disputes.length; i++) {
            if (disputes[i].agreementID == _agreementID) {
                result[index] = disputes[i];
                index++;
            }
        }

        return result;
    }

    
}
