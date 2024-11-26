// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract Assessment {
    uint256 public balance;

    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed sender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint initBalance) payable {
        balance = initBalance; 
    }

    // Function to get the current balance
    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 previousBalance = balance;
        balance += _amount;
        assert(balance == previousBalance + _amount);
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(balance >= _withdrawAmount, "Insufficient balance");
        uint256 previousBalance = balance;
        balance -= _withdrawAmount;
        assert(balance == (previousBalance - _withdrawAmount));
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function transfer(address _to, uint256 _value) public {
        require(_to != address(0), "Invalid recipient address");
        require(_value > 0, "Value must be greater than zero");
        require(balance >= _value, "Insufficient balance");

        balance -= _value;
        emit Transfer(msg.sender, _to, _value);
    }
}
