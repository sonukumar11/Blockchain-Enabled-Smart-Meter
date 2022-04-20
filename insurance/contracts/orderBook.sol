// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract orderBook {
      address public owner;

  // energy of the owner
  uint public energy;

  constructor(){
    owner=msg.sender;
    energy=100;
  }
  struct customer{
    address add;
    uint eng;
  }
  mapping(address=>bool) public valid;
  mapping(address=>customer) public detail;

  function regCust() public {
    bool v=valid[msg.sender];
    require(v==false,"hey already reg");
    customer storage cus=detail[msg.sender];
    cus.add=msg.sender;
    cus.eng=0;
    valid[msg.sender]=true;
  }

  //adding 100 units enery every time by the owner
  function addEnergy() public{
    require(msg.sender==owner);
    energy+=100;
  }

  function buy() public payable{
       bool v=valid[msg.sender];
       require(v,"hey already reg");
       customer storage cus=detail[msg.sender];
       (bool send, ) = owner.call{value: msg.value}("");
       require(send,"failed");
       cus.eng+=10;
       energy-=10;

  }


  function customerInfo() public{
    
  }
}
