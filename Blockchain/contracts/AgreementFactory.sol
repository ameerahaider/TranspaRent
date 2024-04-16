// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DisputeResolution.sol";
import "./DefaultTerms.sol";


contract AgreementFactory {

    enum AgreementStatus {
        Pending,
        Active,
        Terminated
    }

struct Contract {
    uint256 ID;
    address landlord;
    address tenant;
    string landlordUsername;  // New field for landlord's username
    string tenantUsername;    // New field for tenant's username
    uint256 rentAmount;
    uint256 securityDeposit;
    uint256 leaseDuration;
    uint256 startDate;
    uint256 terminationDate;
    string propertyID;
    AgreementStatus status;
    string[] terms;
    bool tenantApproved;
    bool landlordApproved;
}


    Contract[] public contractRegistry;
    DisputeResolution public disputeResolutionContract;
    DefaultTerms public defaultTermsContract;

    constructor(DisputeResolution _disputeResolutionContract, DefaultTerms _defaultTermsContract) {
        disputeResolutionContract = _disputeResolutionContract;
        defaultTermsContract = _defaultTermsContract;
    }

        // ********************************************** Basic Contract Functions

    function createRentalAgreement(
        address _landlord,
        address _tenant,
        string memory _landlordUsername,
        string memory _tenantUsername,
        uint256 _rentAmount,
        uint256 _securityDeposit,
        uint256 _leaseDuration,
        uint256 _startDate,
        string memory _propertyID
    ) external {
        // Check if a similar contract already exists and is in a "Pending" status
        for (uint i = 0; i < contractRegistry.length; i++) {
            if (
                contractRegistry[i].landlord == _landlord &&
                contractRegistry[i].tenant == _tenant &&
                keccak256(abi.encodePacked(contractRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID)) &&
                contractRegistry[i].status == AgreementStatus.Pending
            ) {
                revert("Similar contract already pending");
            }
            
            if (contractRegistry[i].landlord == _landlord &&
                contractRegistry[i].tenant == _tenant &&
                keccak256(abi.encodePacked(contractRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID)) &&
                contractRegistry[i].status == AgreementStatus.Terminated){

                contractRegistry[i].rentAmount = _rentAmount;
                contractRegistry[i].securityDeposit = _securityDeposit;
                contractRegistry[i].leaseDuration = _leaseDuration;
                contractRegistry[i].startDate = _startDate;
                contractRegistry[i].terminationDate = _startDate + (_leaseDuration * 30 days);
                contractRegistry[i].status = AgreementStatus.Pending;
                contractRegistry[i].tenantApproved = false;
                contractRegistry[i].landlordApproved = false;                
                return;
            }
        }

        Contract storage newAgreement = contractRegistry.push(); // Use 'storage' to directly modify state variable
        newAgreement.ID = contractRegistry.length - 1;
        newAgreement.landlord = _landlord;
        newAgreement.tenant = _tenant;
        newAgreement.landlordUsername = _landlordUsername; // Set landlord's username
        newAgreement.tenantUsername = _tenantUsername;     // Set tenant's username
        newAgreement.rentAmount = _rentAmount;
        newAgreement.securityDeposit = _securityDeposit;
        newAgreement.leaseDuration = _leaseDuration;
        newAgreement.startDate = _startDate;
        newAgreement.terminationDate = _startDate + (_leaseDuration * 30 days);
        newAgreement.propertyID = _propertyID; // Set the propertyID
        newAgreement.status = AgreementStatus.Pending;
        newAgreement.tenantApproved = false;
        newAgreement.landlordApproved = false;
        // Get default terms from DefaultTerms contract
        newAgreement.terms = defaultTermsContract.getDefaultTerms();
    }

function approveAgreement(address _tenant, address _landlord, string memory _propertyID) external {
    for (uint i = 0; i < contractRegistry.length; i++) {
        if (
            contractRegistry[i].tenant == _tenant &&
            contractRegistry[i].landlord == _landlord &&
            keccak256(abi.encodePacked(contractRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
        ) {
            require(
                contractRegistry[i].status == AgreementStatus.Pending,
                "Agreement is not pending"
            );

            if (msg.sender == _tenant) {
                contractRegistry[i].tenantApproved = true;
            }

            if (msg.sender == _landlord) {
                require(
                    contractRegistry[i].tenantApproved == true,
                    "Tenant has not Approved yet"
                );
                contractRegistry[i].landlordApproved = true;
            }

            if (contractRegistry[i].landlordApproved && contractRegistry[i].tenantApproved) {
                // Check if the agreement is not terminated
                require(
                    contractRegistry[i].status != AgreementStatus.Terminated,
                    "Agreement is terminated"
                );

                contractRegistry[i].status = AgreementStatus.Active;
            }
            break;
        }
    }
}

    function disapproveAgreement(address _tenant, address _landlord, string memory _propertyID) external {
        for (uint i = 0; i < contractRegistry.length; i++) {
            if (
                contractRegistry[i].tenant == _tenant &&
                contractRegistry[i].landlord == _landlord &&
                keccak256(abi.encodePacked(contractRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
            ) {
                require(
                    contractRegistry[i].status == AgreementStatus.Pending,
                    "Agreement is not pending"
                );
                require(
                    contractRegistry[i].status != AgreementStatus.Active,
                    "Agreement is approved"
                );
                require(
                    contractRegistry[i].status != AgreementStatus.Terminated,
                    "Agreement is terminated"
                );
                contractRegistry[i].status = AgreementStatus.Terminated;
                break;
            }
        }
    }

    function terminateAgreement(address _tenant, address _landlord, string memory _propertyID) external {
        for (uint i = 0; i < contractRegistry.length; i++) {
            if (
                contractRegistry[i].tenant == _tenant &&
                contractRegistry[i].landlord == _landlord &&
                keccak256(abi.encodePacked(contractRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID)) &&
                contractRegistry[i].status != AgreementStatus.Terminated
       ) {
                require(
                    contractRegistry[i].status != AgreementStatus.Terminated,
                    "Agreement has already been terminated"
                );
                require(
                    contractRegistry[i].status == AgreementStatus.Active,
                    "Agreement is not Active"
                );
                contractRegistry[i].status = AgreementStatus.Terminated;
                break;
            }
        }
    }

    // ********************************************** Dispute Resolution Functions

    function raiseDispute(
        uint256 _agreementID,
        string memory _title,
        string memory _reason
    ) external {
        require(_agreementID < contractRegistry.length, "Invalid agreement ID");
        require(
            contractRegistry[_agreementID].tenant == msg.sender,
            "Only tenant can raise a dispute"
        );

        disputeResolutionContract.raiseDispute(
            _agreementID,
            contractRegistry[_agreementID].tenant,
            contractRegistry[_agreementID].landlord,
            _title,
            _reason
        );
    }

    function resolveDispute(
        uint256 _disputeID,
        string memory _resolution
    ) external {
        disputeResolutionContract.resolveDispute(_disputeID, _resolution);
    }

    // ********************************************** Getter Functions

    // Getter function for contractRegistry length

    function getContractID(
        address _tenant,
        address _landlord,
        string memory _propertyID
    ) external view returns (uint256) {
        for (uint i = 0; i < contractRegistry.length; i++) {
            if (
                contractRegistry[i].tenant == _tenant &&
                contractRegistry[i].landlord == _landlord &&
                keccak256(abi.encodePacked(contractRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
            ) {
                return contractRegistry[i].ID;
            }
        }
        revert("Contract not found");
    }

    function getContractDetails(
        address _tenant,
        address _landlord,
        string memory _propertyID
    ) external view returns (Contract memory) {
        for (uint i = 0; i < contractRegistry.length; i++) {
            if (
                contractRegistry[i].tenant == _tenant &&
                contractRegistry[i].landlord == _landlord &&
                keccak256(abi.encodePacked(contractRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
            ) {
                return contractRegistry[i];
            }
        }
        revert("Contract not found");
    }

    function getDisputeDetails(
        uint256 _disputeID
    ) external view returns (DisputeResolution.Dispute memory) {
        return disputeResolutionContract.getDisputeDetails(_disputeID);
    }

    function getAllDisputes(
        uint256 _agreementID
    ) external view returns (DisputeResolution.Dispute[] memory) {
        return disputeResolutionContract.getDisputesForAgreement(_agreementID);
    }


function getLandlordsContracts(address _landlordAddress) external view returns (Contract[] memory) {
    Contract[] memory result = new Contract[](contractRegistry.length);
    uint256 counter = 0;

    for (uint256 i = 0; i < contractRegistry.length; i++) {
        if (contractRegistry[i].landlord == _landlordAddress) {
            result[counter] = contractRegistry[i];
            counter++;
        }
    }

    // Resize the result array to remove any empty elements
    assembly {
        mstore(result, counter)
    }

    return result;
}

function getTenantsContracts(address _tenantAddress) external view returns (Contract[] memory) {
    Contract[] memory result = new Contract[](contractRegistry.length);
    uint256 counter = 0;

    for (uint256 i = 0; i < contractRegistry.length; i++) {
        if (contractRegistry[i].tenant == _tenantAddress) {
            result[counter] = contractRegistry[i];
            counter++;
        }
    }

    // Resize the result array to remove any empty elements
    assembly {
        mstore(result, counter)
    }

    return result;
}

    // function getContractsByAddress(address _address) external view returns (Contract[] memory) {
    //     Contract[] memory result = new Contract[](contractRegistry.length);
    //     uint256 counter = 0;

    //     for (uint256 i = 0; i < contractRegistry.length; i++) {
    //         if (contractRegistry[i].landlord == _address || contractRegistry[i].tenant == _address) {
    //             result[counter] = contractRegistry[i];
    //             counter++;
    //         }
    //     }

    //     return result;
    // }

    //     function getRegistryDetails() external view returns (Contract[] memory) {
    //     Contract[] memory result = new Contract[](contractRegistry.length);

    //     for (uint256 i = 0; i < contractRegistry.length; i++) {
    //         result[i] = Contract({
    //             ID: contractRegistry[i].ID,
    //             landlord: contractRegistry[i].landlord,
    //             tenant: contractRegistry[i].tenant,
    //             rentAmount: contractRegistry[i].rentAmount,
    //             securityDeposit: contractRegistry[i].securityDeposit,
    //             leaseDuration: contractRegistry[i].leaseDuration,
    //             startDate: contractRegistry[i].startDate,
    //             terminationDate: contractRegistry[i].terminationDate,
    //             propertyID: contractRegistry[i].propertyID,
    //             status: contractRegistry[i].status,
    //             terms: contractRegistry[i].terms,
    //             tenantApproved: contractRegistry[i].tenantApproved,
    //             landlordApproved: contractRegistry[i].landlordApproved
    //         });
    //     }

    //     return result;
    // }
}
