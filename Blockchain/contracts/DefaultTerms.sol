// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DefaultTerms {
    string[] public defaultTerms;

    constructor() {
        // Initialize default terms in the constructor
        defaultTerms.push(
            "LANDLORD: The party who owns the property and is leasing it to the tenant."
        );

        defaultTerms.push(
            "TENANT: The party who is renting the property from the lessor."
        );

        defaultTerms.push(
            "LEASE DURATION: The duration for which the property is being leased (e.g., 12 months)."
        );

        defaultTerms.push(
            "RENT AMOUNT: The amount paid by the tenant to the lessor for using the property."
        );

        defaultTerms.push(
            "RENT PAYMENT: The amount paid by the tenant to the lessor must be paid on the 1st of each month."
        );

        defaultTerms.push(
            "LATE RENT: There is a grace period of 1 week for late rent, after which a 2% fine must be added to the rent amount."
        );

        defaultTerms.push(
            "SECURITY DEPOSIT: A refundable amount paid by the tenant as security against damages or unpaid rent."
        );

        defaultTerms.push(
            "UTILITIES: Services such as water, electricity, and gas are not included in the rent amount."
        );

        defaultTerms.push(
            "UTILITIES: All utility services bills must be paid by the tenant."
        );

        defaultTerms.push(
            "MAINTENANCE: Tenant is responsible for minor maintenance (e.g., changing light bulbs, regular cleaning)."
        );

        defaultTerms.push(
            "MAINTENANCE: Landlord is responsible for major repairs and maintenance (e.g., plumbing issues, structural repairs)."
        );

        defaultTerms.push(
            "MAINTENANCE: A dispute can be raised by the tenant and resolved by the landlord through renting portal."
        );

        defaultTerms.push(
            "SUBLEASING: Property must only be used for residential purposes only, no subleasing without permission."
        );

        defaultTerms.push(
            "ALTERATIONS: Tenant must obtain written permission from the landlord before making any alterations, improvements, or additions to the property."
        );

        defaultTerms.push(
            "GUESTS: Tenant agrees to be responsible for the conduct of their guests on the property and ensures they comply with lease terms."
        );

        defaultTerms.push(
            "NOTICE OF ABSENCE: Tenant agrees to notify the landlord if they will be away from the property for an extended period."
        );

        defaultTerms.push(
            "EMERGENCY CONTACTS: Tenant must provide emergency contact information, such as a designated person to reach in case of emergencies."
        );

        defaultTerms.push(
            "PROPERTY DAMAGE: Tenant agrees to report any damages caused by them or their guests promptly and is responsible for repairing or reimbursing the landlord for such damages."
        );

        defaultTerms.push(
            "WASTE DISPOSAL: Tenant agrees to dispose of waste properly, following local ordinances and recycling guidelines."
        );

        defaultTerms.push(
            "FIRE SAFETY: Tenant agrees to follow fire safety regulations, such as not blocking exits, keeping smoke detectors operational, and not tampering with fire safety equipment."
        );

        defaultTerms.push(
            "HOUSING CODE COMPLIANCE: Landlord agrees that the property complies with all applicable housing codes and regulations."
        );

        defaultTerms.push(
            "ENTRY: Landlord has the right to enter the property for inspections, repairs, or showings, with 1 week notice."
        );

        defaultTerms.push(
            "TERMINATION: Conditions under which the lease can be terminated by either party."
        );

        defaultTerms.push(
            "LANDLORD EARLY TERMINATION: If landlord terminates the agreement before termination date, the tenant will be allowed to stay on the property for 1 month rent free before moving out."
        );

        defaultTerms.push(
            "TENANT EARLY TERMINATION: If tenant terminates the agreement before termination date, the landlord is entitled to 1 month rent which is deducted from the security deposit."
        );

        defaultTerms.push(
            "RENEWAL: After termination date a contract may be renewed by the tenant by rebooking the property."
        );

        defaultTerms.push(
            "PROPERTY FOR SALE: Tenant agrees to allow the property to be shown to potential buyers or renters with 1 month notice and rent free stay, from the landlord."
        );

        defaultTerms.push(
            "NON-DISCRIMINATION: Both parties agree to comply with fair housing laws and not discriminate based on race, color, religion, sex, national origin, disability, or familial status."
        );

        defaultTerms.push(
            "NOTICE DELIVERY: Notices and communications between landlord and tenant can be delivered in person, by mail, or electronically."
        );

        defaultTerms.push(
            "NOTICE PERIOD: A notice period of 1 month must be issued before terminating the lease by both landlord and tenant."
        );

        defaultTerms.push(
            "NOTICE OF SALE: Tenant must be notified in advance if the property is being sold, with details on the new owner's responsibilities."
        );

        defaultTerms.push(
            "SIGNATURES: Both parties must approve the agreement to make it legally binding."
        );

        defaultTerms.push(
            "ENTIRE AGREEMENT: This contract constitutes the entire agreement between the parties and supersedes any prior agreements or understandings."
        );
    }

    function getDefaultTerms() external view returns (string[] memory) {
        return defaultTerms;
    }
}
