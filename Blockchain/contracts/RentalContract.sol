// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RentalContract {

    address public landlord; // Landlord Address
    address public tenant; // Tenant Address
    
    uint256 public rentAmount; // Monthly Rent Amount
    uint256 public securityDeposit; // Security Deposit
    uint256 public leaseDuration; // in months
    uint256 public startDate; // Start date
    uint256 public terminationDate; // Termination date

    enum AgreementStatus { Pending, Active, Terminated }
    AgreementStatus public status; // Status of Agreement

    struct ContractTerms {
        string termName;
        string description;
    }
    
    ContractTerms[] public sampleContractTerms;

    struct SecurityDepositDispute {
        string reason;
        string resolution;
        bool resolved;
    }

    struct RentPaymentDispute {
        string month;
        string resolution;
        bool resolved;
    }

    struct MaintenanceDispute {
        string issue;
        string resolution;
        bool resolved;
    }

    mapping(address => SecurityDepositDispute) public securityDepositDisputes;
    mapping(address => RentPaymentDispute) public rentPaymentDisputes;
    mapping(address => MaintenanceDispute) public maintenanceDisputes;

    // Events for dispute resolution
    event SecurityDepositDisputeRaised(address indexed _tenant, string _reason);
    event SecurityDepositDisputeResolved(address indexed _tenant, string _resolution);

    event RentPaymentDisputeRaised(address indexed _tenant, string _month);
    event RentPaymentDisputeResolved(address indexed _tenant, string _month, string _resolution);

    event MaintenanceDisputeRaised(address indexed _tenant, string _issue);
    event MaintenanceDisputeResolved(address indexed _tenant, string _issue, string _resolution);

    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only landlord can perform this action");
        _;
    }

    modifier onlyTenant() {
        require(msg.sender == tenant, "Only tenant can perform this action");
        _;
    }

    modifier onlyParties() {
        require(msg.sender == landlord || msg.sender == tenant, "Only parties involved can perform this action");
        _;
    }

    modifier agreementActive() {
        require(status == AgreementStatus.Active, "Agreement status must be active");
        _;
    }

    constructor() {
        landlord = msg.sender;
        
        // Initialize sample contract terms
        // sampleContractTerms.push(ContractTerms("Term 1", "Description of Term 1"));
        // sampleContractTerms.push(ContractTerms("Term 2", "Description of Term 2"));
        // Add more terms as needed
        // Initialize sample contract terms
        sampleContractTerms.push(ContractTerms("LESSOR", "The party who owns the property and is leasing it to the tenant."));
        sampleContractTerms.push(ContractTerms("TENANT", "The party who is renting the property from the lessor."));
        sampleContractTerms.push(ContractTerms("LEASE TERM", "The duration for which the property is being leased (e.g., 12 months)."));
        sampleContractTerms.push(ContractTerms("RENT", "The amount paid by the tenant to the lessor for using the property."));
        sampleContractTerms.push(ContractTerms("SECURITY DEPOSIT", "A refundable amount paid by the tenant as security against damages or unpaid rent."));
        sampleContractTerms.push(ContractTerms("UTILITIES", "Services such as water, electricity, and gas provided to the property."));
        sampleContractTerms.push(ContractTerms("MAINTENANCE", "Responsibilities related to property upkeep and repairs."));
        sampleContractTerms.push(ContractTerms("TERMINATION", "Conditions under which the lease can be terminated by either party."));
        sampleContractTerms.push(ContractTerms("NOTICE PERIOD", "The advance notice required before terminating the lease."));
        sampleContractTerms.push(ContractTerms("DEFAULT", "Situations where either party fails to fulfill their obligations."));
        sampleContractTerms.push(ContractTerms("SIGNATURES", "Both parties must sign the agreement to make it legally binding."));

    }
    
    function initiateAgreement(
        address _tenant,
        uint256 _rentAmount,
        uint256 _securityDeposit,
        uint256 _leaseDuration,
        uint256 _startDate
    ) external  {
        require(status == AgreementStatus.Pending, "Agreement already initiated");
        tenant = _tenant;
        securityDeposit = _securityDeposit;
        leaseDuration = _leaseDuration;
        startDate = _startDate;
        status = AgreementStatus.Pending;
        
        if (_leaseDuration > 12) {
            rentAmount = _rentAmount;
            for (uint256 i = 0; i < _leaseDuration - 12; i++) {
                rentAmount = rentAmount + (rentAmount * 10 / 100); // Increase rent by 10% yearly
            }
        } else {
            rentAmount = _rentAmount;
        }
    }

    function approveAgreement() external onlyTenant {
        require(status == AgreementStatus.Pending, "Agreement is not pending");
        status = AgreementStatus.Active;
        terminationDate = startDate + (leaseDuration * 30 days);
    }

    function disapproveAgreement() external onlyTenant {
        require(status == AgreementStatus.Pending, "Agreement is not pending");
        status = AgreementStatus.Terminated;
    }

    function terminateAgreement() external onlyLandlord {
        require(status != AgreementStatus.Terminated, "Agreement has already been terminated");
        status = AgreementStatus.Terminated;
    }

    function renewContract(
        uint256 _newLeaseDuration,
        uint256 _newStartDate,
        uint256 _newRentAmount
    ) external onlyLandlord {
        require(status == AgreementStatus.Active, "Agreement must be active to renew");
        require(_newLeaseDuration > 0, "New lease duration must be greater than zero");
        
        // Update lease duration and start date
        leaseDuration = _newLeaseDuration;
        startDate = _newStartDate;
        
        // If the new lease duration is greater than 12 months, adjust the rent amount accordingly
        if (_newLeaseDuration > 12) {
            rentAmount = _newRentAmount;
            for (uint256 i = 0; i < _newLeaseDuration - 12; i++) {
                rentAmount = rentAmount + (rentAmount * 10 / 100); // Increase rent by 10% yearly
            }
        } else {
            rentAmount = _newRentAmount;
        }
        
        // Reset termination date based on the new lease duration
        terminationDate = startDate + (_newLeaseDuration * 30 days);
    }


    // Function to retrieve landlord's address
    function getLandlord() external view returns (address) {
        return landlord;
    }
    
    // Function to retrieve tenant's address
    function getTenant() external view returns (address) {
        return tenant;
    }
    
    // Function to retrieve rent amount
    function getRentAmount() external view returns (uint256) {
        return rentAmount;
    }
    
    // Function to retrieve security deposit
    function getSecurityDeposit() external view returns (uint256) {
        return securityDeposit;
    }
    
    // Function to retrieve lease duration
    function getLeaseDuration() external view returns (uint256) {
        return leaseDuration;
    }
    
    // Function to retrieve start date
    function getStartDate() external view returns (uint256) {
        return startDate;
    }
    
    // Function to retrieve termination date
    function getTerminationDate() external view returns (uint256) {
        return terminationDate;
    }
    
    // Function to retrieve agreement status
    function getStatus() external view returns (string memory) {
        if (status == AgreementStatus.Pending) {
            return "Pending";
        } else if (status == AgreementStatus.Active) {
            return "Active";
        } else if (status == AgreementStatus.Terminated) {
            return "Terminated";
        } else {
            return "Error";
        }
    }

    // Function to retrieve contract terms
    function getContractTerms() external view returns (ContractTerms[] memory) {
        return sampleContractTerms;
    }
    
        // Function to retrieve all contract details
    function getContractDetails() external view returns (
        address _landlord,
        address _tenant,
        uint256 _rentAmount,
        uint256 _securityDeposit,
        uint256 _leaseDuration,
        uint256 _startDate,
        uint256 _terminationDate,
        string memory _status
    ) {
        _landlord = landlord;
        _tenant = tenant;
        _rentAmount = rentAmount;
        _securityDeposit = securityDeposit;
        _leaseDuration = leaseDuration;
        _startDate = startDate;
        _terminationDate = terminationDate;
        
        if (status == AgreementStatus.Pending) {
            _status = "Pending";
        } else if (status == AgreementStatus.Active) {
            _status = "Active";
        } else if (status == AgreementStatus.Terminated) {
            _status = "Terminated";
        } else {
            _status = "Error";
        }
    }


    //Dispute Resolution Functions

     // Function to raise a dispute regarding the security deposit
    function raiseSecurityDepositDispute(string memory _reason) external onlyTenant agreementActive {
        require(!securityDepositDisputes[msg.sender].resolved, "Dispute already resolved");
        securityDepositDisputes[msg.sender] = SecurityDepositDispute(_reason, "", false);
        emit SecurityDepositDisputeRaised(msg.sender, _reason);
    }

    // Function for the landlord to respond to a security deposit dispute
    function respondToSecurityDepositDispute(address _tenant, string memory _resolution) external onlyLandlord agreementActive {
        require(!securityDepositDisputes[_tenant].resolved, "Dispute already resolved");
        securityDepositDisputes[_tenant].resolution = _resolution;
        securityDepositDisputes[_tenant].resolved = true;
        emit SecurityDepositDisputeResolved(_tenant, _resolution);
    }

    // Function to raise a dispute regarding rent payment for a specific month
    function raiseRentPaymentDispute(string memory _month) external onlyTenant agreementActive {
        require(!rentPaymentDisputes[msg.sender].resolved, "Dispute already resolved");
        rentPaymentDisputes[msg.sender] = RentPaymentDispute(_month, "", false);
        emit RentPaymentDisputeRaised(msg.sender, _month);
    }

    // Function for the landlord to respond to a rent payment dispute
    function respondToRentPaymentDispute(address _tenant, string memory _month, string memory _resolution) external onlyLandlord agreementActive {
        require(!rentPaymentDisputes[_tenant].resolved, "Dispute already resolved");
        rentPaymentDisputes[_tenant].resolution = _resolution;
        rentPaymentDisputes[_tenant].resolved = true;
        emit RentPaymentDisputeResolved(_tenant, _month, _resolution);
    }

    // Function to raise a dispute regarding maintenance issues
    function raiseMaintenanceDispute(string memory _issue) external onlyTenant agreementActive {
        require(!maintenanceDisputes[msg.sender].resolved, "Dispute already resolved");
        maintenanceDisputes[msg.sender] = MaintenanceDispute(_issue, "", false);
        emit MaintenanceDisputeRaised(msg.sender, _issue);
    }

    // Function for the landlord to respond to a maintenance dispute
    function respondToMaintenanceDispute(address _tenant, string memory _issue, string memory _resolution) external onlyLandlord agreementActive {
        require(!maintenanceDisputes[_tenant].resolved, "Dispute already resolved");
        maintenanceDisputes[_tenant].resolution = _resolution;
        maintenanceDisputes[_tenant].resolved = true;
        emit MaintenanceDisputeResolved(_tenant, _issue, _resolution);
    }

        // Function for tenant to get details of their security deposit dispute
    function getSecurityDepositDispute() external view onlyTenant returns (string memory, string memory, bool) {
        SecurityDepositDispute memory dispute = securityDepositDisputes[msg.sender];
        return (dispute.reason, dispute.resolution, dispute.resolved);
    }

    // Function for tenant to get details of their rent payment dispute
    function getRentPaymentDispute() external view onlyTenant returns (string memory, string memory, bool) {
        RentPaymentDispute memory dispute = rentPaymentDisputes[msg.sender];
        return (dispute.month, dispute.resolution, dispute.resolved);
    }

    // Function for tenant to get details of their maintenance dispute
    function getMaintenanceDispute() external view onlyTenant returns (string memory, string memory, bool) {
        MaintenanceDispute memory dispute = maintenanceDisputes[msg.sender];
        return (dispute.issue, dispute.resolution, dispute.resolved);
    }

    // Function for landlord to get details of tenant's security deposit dispute
    function getTenantSecurityDepositDispute(address _tenant) external view onlyLandlord returns (string memory, string memory, bool) {
        SecurityDepositDispute memory dispute = securityDepositDisputes[_tenant];
        return (dispute.reason, dispute.resolution, dispute.resolved);
    }

    // Function for landlord to get details of tenant's rent payment dispute
    function getTenantRentPaymentDispute(address _tenant) external view onlyLandlord returns (string memory, string memory, bool) {
        RentPaymentDispute memory dispute = rentPaymentDisputes[_tenant];
        return (dispute.month, dispute.resolution, dispute.resolved);
    }

    // Function for landlord to get details of tenant's maintenance dispute
    function getTenantMaintenanceDispute(address _tenant) external view onlyLandlord returns (string memory, string memory, bool) {
        MaintenanceDispute memory dispute = maintenanceDisputes[_tenant];
        return (dispute.issue, dispute.resolution, dispute.resolved);
    }
    
}