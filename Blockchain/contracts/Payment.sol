// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Payment {
    enum PaymentStatus {
        Pending,
        Paid,
        Returned
    }

    struct PaymentInfo {
        address landlord;
        address tenant;
        string propertyID;
        uint256 escrowAmount;
        bool tenantApproved;
        bool landlordApproved;
        PaymentStatus status;
    }

    PaymentInfo[] public paymentsRegistry;

    // Event definitions for debugging
    event PaymentCreated(address indexed tenant, address indexed landlord, string propertyID, uint256 amount);
    event PaymentApproved(address indexed approver, string propertyID, PaymentStatus status);
    event PaymentStatusChanged(string propertyID, PaymentStatus newStatus);

    // Basic Contract Functions
    function createPayment(
        address _tenant,
        address _landlord,
        string memory _propertyID,
        uint256 _amount
    ) external {
        for (uint i = 0; i < paymentsRegistry.length; i++) {
            if (
                paymentsRegistry[i].landlord == _landlord &&
                paymentsRegistry[i].tenant == _tenant &&
                keccak256(abi.encodePacked(paymentsRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
            ) {
                if (paymentsRegistry[i].status == PaymentStatus.Pending) {
                    revert("Similar Payment already pending");
                }

                if (
                    paymentsRegistry[i].status == PaymentStatus.Paid ||
                    paymentsRegistry[i].status == PaymentStatus.Returned
                ) {
                    paymentsRegistry[i].escrowAmount = _amount;
                    paymentsRegistry[i].status = PaymentStatus.Pending;
                    paymentsRegistry[i].tenantApproved = false;
                    paymentsRegistry[i].landlordApproved = false;
                    emit PaymentStatusChanged(_propertyID, PaymentStatus.Pending);
                    return;
                }
            }
        }

        PaymentInfo storage newPayment = paymentsRegistry.push();
        newPayment.landlord = _landlord;
        newPayment.tenant = _tenant;
        newPayment.propertyID = _propertyID;
        newPayment.escrowAmount = _amount;
        newPayment.status = PaymentStatus.Pending;
        newPayment.tenantApproved = false;
        newPayment.landlordApproved = false;
        emit PaymentCreated(_tenant, _landlord, _propertyID, _amount);
    }

    function makePayment(
        address _tenant,
        address _landlord,
        string memory _propertyID
    ) external {
        for (uint256 i = 0; i < paymentsRegistry.length; i++) {
            if (
                paymentsRegistry[i].tenant == _tenant &&
                paymentsRegistry[i].landlord == _landlord &&
                keccak256(abi.encodePacked(paymentsRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
            ) {
                PaymentInfo storage payment = paymentsRegistry[i];
                require(payment.status == PaymentStatus.Pending, "Payment is not Pending");

                if (msg.sender == _tenant) {
                    payment.tenantApproved = true;
                    emit PaymentApproved(_tenant, _propertyID, payment.status);
                }

                if (msg.sender == _landlord) {
                    require(payment.tenantApproved, "Tenant has not Approved yet");
                    payment.landlordApproved = true;
                    emit PaymentApproved(_landlord, _propertyID, payment.status);
                }

                if (payment.landlordApproved && payment.tenantApproved) {
                    payment.status = PaymentStatus.Paid;
                    emit PaymentStatusChanged(_propertyID, PaymentStatus.Paid);
                }
                return;
            }
        }
    }

    function disapprovePayment(
        address _tenant,
        address _landlord,
        string memory _propertyID
    ) external {
        for (uint256 i = 0; i < paymentsRegistry.length; i++) {
            if (
                paymentsRegistry[i].tenant == _tenant &&
                paymentsRegistry[i].landlord == _landlord &&
                keccak256(abi.encodePacked(paymentsRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
            ) {
                PaymentInfo storage payment = paymentsRegistry[i];
                require(payment.status == PaymentStatus.Pending, "Payment is not Pending or already Returned");
                payment.status = PaymentStatus.Returned;
                emit PaymentStatusChanged(_propertyID, PaymentStatus.Returned);
                return;
            }
        }
    }

    function getPaymentDetails(
        address _tenant,
        address _landlord,
        string memory _propertyID
    ) external view returns (PaymentInfo memory) {
        for (uint i = 0; i < paymentsRegistry.length; i++) {
            if (
                paymentsRegistry[i].tenant == _tenant &&
                paymentsRegistry[i].landlord == _landlord &&
                keccak256(abi.encodePacked(paymentsRegistry[i].propertyID)) == keccak256(abi.encodePacked(_propertyID))
            ) {
                return paymentsRegistry[i];
            }
        }
        revert("Payment not found");
    }

    function registryLength() external view returns (uint256) {
        return paymentsRegistry.length;
    }
}
