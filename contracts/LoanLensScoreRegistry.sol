// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LoanLensScoreRegistry {
    struct CreditScore {
        uint256 score;           // 0-850
        uint256 timestamp;
        bytes32 attestationHash; // From Attestcoin Protocol
        string narrativeIPFS;    // IPFS hash of full AI narrative
        uint8 riskLevel;         // 0=Minimal, 1=Low, 2=Medium, 3=High, 4=Critical
        bool isActive;
    }

    mapping(address => CreditScore) public scores;
    mapping(address => address[]) public scoreViewers; // lenders who viewed this score

    event ScoreRecorded(
        address indexed wallet,
        uint256 score,
        bytes32 attestationHash,
        uint256 timestamp
    );

    event ScoreViewed(
        address indexed wallet,
        address indexed viewer,
        uint256 timestamp
    );

    function recordScore(
        address wallet,
        uint256 score,
        bytes32 attestationHash,
        string calldata narrativeIPFS,
        uint8 riskLevel
    ) external {
        scores[wallet] = CreditScore({
            score: score,
            timestamp: block.timestamp,
            attestationHash: attestationHash,
            narrativeIPFS: narrativeIPFS,
            riskLevel: riskLevel,
            isActive: true
        });
        emit ScoreRecorded(wallet, score, attestationHash, block.timestamp);
    }

    function getScore(address wallet) external returns (CreditScore memory) {
        scoreViewers[wallet].push(msg.sender);
        emit ScoreViewed(wallet, msg.sender, block.timestamp);
        return scores[wallet];
    }

    function getViewerCount(address wallet) external view returns (uint256) {
        return scoreViewers[wallet].length;
    }
}
