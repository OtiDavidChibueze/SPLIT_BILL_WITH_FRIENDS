import { useState } from "react";

const initialFriends = [
  {
    id: 31931,
    name: "OTI",
    img: "https://i.pravatar.cc/48?u=933372",
    balance: 7,
  },
  {
    id: 319121,
    name: "DAVID",
    img: "https://i.pravatar.cc/48?u=118836",
    balance: -10,
  },
  {
    id: 319321,
    name: "CHIBUEZE",
    img: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const EatAndSplit = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [selectFriend, setSelectedFriend] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectedFriend = (friend) => {
    setSelectedFriend(friend.id !== selectFriend?.id ? friend : null);
  };

  const handleNewFriend = (newFriend) => {
    setFriends((friends) => [...friends, newFriend]);
    setIsOpen(!isOpen);
  };

  const handleOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleSplitBill = (splitBill) => {
    console.log(splitBill);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend?.id
          ? { ...friend, balance: friend.balance + splitBill }
          : friend
      )
    );

    setSelectedFriend(null);
  };

  return (
    <div>
      <FriendList
        data={friends}
        selectFriend={selectFriend}
        onHandleSelectedFriend={handleSelectedFriend}
      />

      {isOpen && <AddFriend handleNewFriend={handleNewFriend} />}

      <Button onClick={handleOpen}>{isOpen ? "Close" : "Add Friend"} </Button>

      {selectFriend && (
        <SplitBill selectFriend={selectFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
};

const FriendList = ({ data, selectFriend, onHandleSelectedFriend }) => {
  return (
    <div>
      {data.map((friend) => (
        <Friends
          friend={friend}
          key={friend.id}
          selectFriend={selectFriend}
          onHandleSelectedFriend={onHandleSelectedFriend}
        />
      ))}
    </div>
  );
};

const Friends = ({ friend, selectFriend, onHandleSelectedFriend }) => {
  const isSelected = friend.id === selectFriend?.id;

  return (
    <div>
      <img src={friend.img} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance > 0 ? (
        <p style={{ color: "green" }}>
          {friend.name} owes you ${friend.balance}
        </p>
      ) : friend.balance < 0 ? (
        <p style={{ color: "red" }}>
          you owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      ) : (
        <p>
          you and {friend.name} are even ${friend.balance}
        </p>
      )}

      <Button onClick={() => onHandleSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </div>
  );
};

const AddFriend = ({ handleNewFriend }) => {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  const handleForm = (e) => {
    e.preventDefault();

    if (!name) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      img: setImg(`${img}?${id}`),
      balance: 0,
    };

    handleNewFriend(newFriend);

    setName("");
  };

  return (
    <form onSubmit={handleForm}>
      <label htmlFor=""> Friend Name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="">Image Url </label>
      <input type="text" value={img} disabled />
      <Button>Add</Button>
    </form>
  );
};

const SplitBill = ({ selectFriend, onSplitBill }) => {
  const [bill, setBill] = useState("");
  const [userExpenses, setUserExpenses] = useState("");
  const friendExpenses = bill ? bill - userExpenses : "";
  const [paidBy, setPaidBy] = useState("user");

  const handleSplitBill = (e) => {
    e.preventDefault();

    if (!bill || !userExpenses) return;

    onSplitBill(paidBy !== "user" ? -userExpenses : friendExpenses);

    setBill("");
    setPaidBy("user");
    setUserExpenses("");
  };

  return (
    <form onSubmit={handleSplitBill}>
      <h3 style={{ textTransform: "uppercase" }}>
        split bill with {selectFriend.name}
      </h3>

      <div>
        <label htmlFor="">Bill Value</label>
        <input
          type="text"
          placeholder={0}
          onChange={(e) => setBill(Number(e.target.value))}
        />
        <label htmlFor="">Your expenses</label>
        <input
          type="text"
          onChange={(e) => setUserExpenses(Number(e.target.value))}
        />
        <label htmlFor=""> {selectFriend.name} expenses</label>
        <input type="text" value={Math.abs(friendExpenses)} disabled />
        <label htmlFor="">Who is paying?</label>
        <select
          name=""
          id=""
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{selectFriend.name}</option>
        </select>
      </div>

      <Button>Split Bill</Button>
    </form>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
    </div>
  );
};

export default EatAndSplit;
